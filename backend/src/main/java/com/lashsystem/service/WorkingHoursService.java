package com.lashsystem.service;

import com.lashsystem.dto.WorkingDayDto;
import com.lashsystem.dto.WorkingDayDto.Interval;
import com.lashsystem.entity.WorkingHours;
import com.lashsystem.repository.WorkingHoursRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class WorkingHoursService {

    private final WorkingHoursRepository repository;

    @Transactional(readOnly = true)
    public List<WorkingDayDto> list() {
        List<WorkingHours> all = repository.findAll();
        List<WorkingDayDto> week = new ArrayList<>();
        for (int day = 1; day <= 7; day++) {
            int d = day;
            List<Interval> intervals = all.stream()
                    .filter(w -> w.getDayOfWeek() == d)
                    .sorted(Comparator.comparing(WorkingHours::getStartTime))
                    .map(w -> new Interval(fmt(w.getStartTime()), fmt(w.getEndTime())))
                    .toList();
            week.add(new WorkingDayDto(d, intervals));
        }
        return week;
    }

    @Transactional
    public List<WorkingDayDto> replaceAll(List<WorkingDayDto> week) {
        Set<Integer> seen = new HashSet<>();
        List<WorkingHours> rows = new ArrayList<>();

        for (WorkingDayDto day : week) {
            if (!seen.add(day.dayOfWeek())) {
                throw bad("Dia da semana repetido");
            }
            List<Interval> sorted = day.intervals().stream()
                    .sorted(Comparator.comparing(i -> LocalTime.parse(i.start())))
                    .toList();

            LocalTime previousEnd = null;
            for (Interval i : sorted) {
                LocalTime start = LocalTime.parse(i.start());
                LocalTime end = LocalTime.parse(i.end());
                if (!end.isAfter(start)) {
                    throw bad("O fechamento precisa ser depois da abertura.");
                }
                if (previousEnd != null && start.isBefore(previousEnd)) {
                    throw bad("Os períodos de um mesmo dia não podem se sobrepor.");
                }
                previousEnd = end;
                rows.add(WorkingHours.builder()
                        .dayOfWeek(day.dayOfWeek()).startTime(start).endTime(end).build());
            }
        }

        repository.deleteAllInBatch();
        repository.saveAll(rows);
        return list();
    }

    private static String fmt(LocalTime t) {
        return String.format("%02d:%02d", t.getHour(), t.getMinute());
    }

    private static ResponseStatusException bad(String msg) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, msg);
    }
}
