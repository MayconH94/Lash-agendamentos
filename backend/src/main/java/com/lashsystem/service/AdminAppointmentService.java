package com.lashsystem.service;

import com.lashsystem.dto.AdminAppointmentResponse;
import com.lashsystem.entity.Appointment;
import com.lashsystem.entity.SalonService;
import com.lashsystem.repository.AppointmentRepository;
import com.lashsystem.repository.SalonServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminAppointmentService {

    private static final ZoneId ZONE = ZoneId.of("America/Sao_Paulo");

    private final AppointmentRepository appointments;
    private final SalonServiceRepository services;

    @Transactional(readOnly = true)
    public List<AdminAppointmentResponse> listByDay(LocalDate date) {
        Instant start = date.atStartOfDay(ZONE).toInstant();
        Instant end = date.plusDays(1).atStartOfDay(ZONE).toInstant();

        List<Appointment> list = appointments.findByDay(start, end);
        Map<UUID, String> names = services.findAllById(
                        list.stream().map(Appointment::getServiceId).distinct().toList())
                .stream().collect(Collectors.toMap(SalonService::getId, SalonService::getName));

        return list.stream().map(a -> toResponse(a, names.get(a.getServiceId()))).toList();
    }

    @Transactional
    public AdminAppointmentResponse cancel(UUID id) {
        Appointment a = appointments.findById(id).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Agendamento não encontrado"));
        a.setStatus("CANCELLED"); // a trava do banco ignora cancelados: o horário volta a ficar livre
        String name = services.findById(a.getServiceId()).map(SalonService::getName).orElse("Serviço");
        return toResponse(appointments.save(a), name);
    }

    private AdminAppointmentResponse toResponse(Appointment a, String serviceName) {
        return new AdminAppointmentResponse(a.getId(), a.getClientName(), a.getClientPhone(),
                a.getServiceId(), serviceName == null ? "Serviço removido" : serviceName,
                a.getPriceAtBooking(), a.getStartTime(), a.getEndTime(), a.getStatus());
    }
}
