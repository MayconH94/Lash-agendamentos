package com.lashsystem.repository;

import com.lashsystem.entity.TimeOff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface TimeOffRepository extends JpaRepository<TimeOff, UUID> {

    // Folgas que ainda não terminaram (para a lista do painel)
    List<TimeOff> findByEndTimeAfterOrderByStartTime(Instant now);

    // Folgas que encostam em um intervalo (para o cálculo de horários)
    @Query("SELECT t FROM TimeOff t WHERE t.startTime < :end AND t.endTime > :start")
    List<TimeOff> findOverlapping(@Param("start") Instant start, @Param("end") Instant end);

    @Query("SELECT COUNT(t) > 0 FROM TimeOff t WHERE t.startTime < :end AND t.endTime > :start")
    boolean hasOverlap(@Param("start") Instant start, @Param("end") Instant end);
}
