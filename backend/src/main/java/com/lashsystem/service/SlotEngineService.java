package com.lashsystem.service;

import com.lashsystem.dto.SlotResponse;
import com.lashsystem.entity.Appointment;
import com.lashsystem.entity.SalonService;
import com.lashsystem.entity.WorkingHours;
import com.lashsystem.exception.ResourceNotFoundException;
import com.lashsystem.repository.AppointmentRepository;
import com.lashsystem.repository.SalonServiceRepository;
import com.lashsystem.repository.WorkingHoursRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SlotEngineService {

    private static final ZoneId ZONE = ZoneId.of("America/Sao_Paulo");
    private static final Duration STEP = Duration.ofMinutes(30);
    private static final DateTimeFormatter LABEL = DateTimeFormatter.ofPattern("HH:mm");

    private final AppointmentRepository appointmentRepository;
    private final SalonServiceRepository serviceRepository;
    private final WorkingHoursRepository workingHoursRepository;

    public List<SlotResponse> availableSlots(LocalDate date, UUID serviceId) {
        SalonService service = serviceRepository.findById(serviceId)
                .filter(SalonService::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("Serviço não encontrado"));

        // Dia sem expediente cadastrado = folga
        List<WorkingHours> intervals = workingHoursRepository
                .findByDayOfWeekOrderByStartTime(date.getDayOfWeek().getValue());
        if (intervals.isEmpty()) {
            return List.of();
        }

        Duration serviceTime = Duration.ofMinutes(service.getDurationMinutes());
        Duration blockedTime = Duration.ofMinutes(service.getDurationMinutes() + service.getBufferMinutes());

        // Agendamentos ativos do dia inteiro (do início do 1º intervalo ao fim do último)
        Instant dayStart = toInstant(date, intervals.get(0).getStartTime());
        Instant dayEnd = intervals.stream()
                .map(w -> toInstant(date, w.getEndTime()))
                .max(Instant::compareTo).orElseThrow();
        List<Appointment> booked = appointmentRepository.findActiveBetween(dayStart, dayEnd);

        Instant now = Instant.now();
        List<SlotResponse> slots = new ArrayList<>();

        for (WorkingHours interval : intervals) {
            Instant open = toInstant(date, interval.getStartTime());
            Instant close = toInstant(date, interval.getEndTime());

            for (Instant start = open; !start.plus(serviceTime).isAfter(close); start = start.plus(STEP)) {
                Instant slotStart = start;
                Instant slotEnd = start.plus(blockedTime);

                if (slotStart.isBefore(now)) continue;

                boolean free = booked.stream().noneMatch(a ->
                        a.getStartTime().isBefore(slotEnd) && a.getEndTime().isAfter(slotStart));

                if (free) {
                    slots.add(new SlotResponse(slotStart,
                            LocalTime.ofInstant(slotStart, ZONE).format(LABEL)));
                }
            }
        }
        return slots;
    }

    private Instant toInstant(LocalDate date, LocalTime time) {
        return date.atTime(time).atZone(ZONE).toInstant();
    }
}
