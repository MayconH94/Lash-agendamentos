package com.lashsystem.service;

import com.lashsystem.dto.TimeOffRequest;
import com.lashsystem.dto.TimeOffResponse;
import com.lashsystem.entity.TimeOff;
import com.lashsystem.repository.TimeOffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TimeOffService {

    private static final ZoneId ZONE = ZoneId.of("America/Sao_Paulo");

    private final TimeOffRepository repository;

    @Transactional(readOnly = true)
    public List<TimeOffResponse> listUpcoming() {
        return repository.findByEndTimeAfterOrderByStartTime(Instant.now())
                .stream().map(this::toResponse).toList();
    }

    @Transactional
    public TimeOffResponse create(TimeOffRequest req) {
        Instant start;
        Instant end;

        if (req.allDay()) {
            start = req.date().atStartOfDay(ZONE).toInstant();
            end = req.date().plusDays(1).atStartOfDay(ZONE).toInstant();
        } else {
            if (req.start() == null || req.end() == null) {
                throw bad("Informe o horário de início e de fim.");
            }
            LocalTime s = LocalTime.parse(req.start());
            LocalTime e = LocalTime.parse(req.end());
            if (!e.isAfter(s)) {
                throw bad("O fim precisa ser depois do início.");
            }
            start = req.date().atTime(s).atZone(ZONE).toInstant();
            end = req.date().atTime(e).atZone(ZONE).toInstant();
        }

        String reason = req.reason() == null || req.reason().isBlank() ? null : req.reason().trim();
        TimeOff saved = repository.save(TimeOff.builder()
                .startTime(start).endTime(end).reason(reason).build());
        return toResponse(saved);
    }

    @Transactional
    public void delete(UUID id) {
        if (!repository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Folga não encontrada");
        }
        repository.deleteById(id);
    }

    private TimeOffResponse toResponse(TimeOff t) {
        return new TimeOffResponse(t.getId(), t.getStartTime(), t.getEndTime(), t.getReason());
    }

    private static ResponseStatusException bad(String msg) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, msg);
    }
}
