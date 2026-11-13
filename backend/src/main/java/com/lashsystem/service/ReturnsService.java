package com.lashsystem.service;

import com.lashsystem.dto.ReturnResponse;
import com.lashsystem.entity.Appointment;
import com.lashsystem.entity.SalonService;
import com.lashsystem.repository.AppointmentRepository;
import com.lashsystem.repository.SalonServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReturnsService {

    private static final ZoneId ZONE = ZoneId.of("America/Sao_Paulo");
    private static final int LOOKBACK_DAYS = 365;     // até onde olhamos o histórico
    private static final int UPCOMING_WINDOW_DAYS = 7; // mostra quem vence nos próximos dias
    private static final int MAX_OVERDUE_DAYS = 90;    // depois disso, a cliente sai da lista

    private final AppointmentRepository appointments;
    private final SalonServiceRepository services;

    /** Clientes cuja manutenção está chegando ou atrasada e que não têm novo horário marcado. */
    @Transactional(readOnly = true)
    public List<ReturnResponse> list() {
        Instant now = Instant.now();
        LocalDate today = LocalDate.now(ZONE);

        List<Appointment> all = appointments.findActiveSince(now.minus(LOOKBACK_DAYS, ChronoUnit.DAYS));
        Map<UUID, SalonService> serviceById = services.findAll().stream()
                .collect(Collectors.toMap(SalonService::getId, s -> s));

        // Agrupa por cliente (telefone) + serviço
        Map<String, List<Appointment>> groups = all.stream()
                .filter(a -> {
                    SalonService s = serviceById.get(a.getServiceId());
                    return s != null && s.getMaintenanceDays() != null;
                })
                .collect(Collectors.groupingBy(a -> digits(a.getClientPhone()) + "|" + a.getServiceId()));

        List<ReturnResponse> result = new ArrayList<>();
        for (List<Appointment> group : groups.values()) {
            boolean hasFuture = group.stream().anyMatch(a -> a.getStartTime().isAfter(now));
            if (hasFuture) continue; // já voltou / já tem horário marcado

            Appointment last = group.stream()
                    .max(Comparator.comparing(Appointment::getStartTime)).orElseThrow();
            SalonService service = serviceById.get(last.getServiceId());

            LocalDate lastDay = last.getStartTime().atZone(ZONE).toLocalDate();
            LocalDate due = lastDay.plusDays(service.getMaintenanceDays());
            long overdue = ChronoUnit.DAYS.between(due, today);

            if (overdue < -UPCOMING_WINDOW_DAYS || overdue > MAX_OVERDUE_DAYS) continue;

            result.add(new ReturnResponse(last.getClientName(), last.getClientPhone(),
                    service.getId(), service.getName(), last.getStartTime(), due, overdue));
        }

        result.sort(Comparator.comparingLong(ReturnResponse::daysOverdue).reversed()); // mais atrasadas primeiro
        return result;
    }

    private static String digits(String phone) {
        return phone == null ? "" : phone.replaceAll("\\D", "");
    }
}
