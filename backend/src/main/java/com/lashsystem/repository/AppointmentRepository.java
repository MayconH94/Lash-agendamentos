package com.lashsystem.repository;

import com.lashsystem.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {

    // Pré-checagem amigável (a garantia real é a trava do banco)
    @Query("""
        SELECT COUNT(a) > 0 FROM Appointment a
        WHERE a.status <> 'CANCELLED'
          AND a.startTime < :endTime AND a.endTime > :startTime
    """)
    boolean hasOverlap(@Param("startTime") Instant startTime,
                       @Param("endTime") Instant endTime);

    // Vai servir ao Slot Engine: agendamentos ativos de um intervalo (o dia)
    @Query("""
        SELECT a FROM Appointment a
        WHERE a.status <> 'CANCELLED'
          AND a.startTime < :dayEnd AND a.endTime > :dayStart
        ORDER BY a.startTime
    """)
    List<Appointment> findActiveBetween(@Param("dayStart") Instant dayStart,
                                        @Param("dayEnd") Instant dayEnd);

    // Agenda da profissional: todos os agendamentos do dia (inclusive cancelados)
    @Query("""
        SELECT a FROM Appointment a
        WHERE a.startTime >= :dayStart AND a.startTime < :dayEnd
        ORDER BY a.startTime
    """)
    List<Appointment> findByDay(@Param("dayStart") Instant dayStart,
                                @Param("dayEnd") Instant dayEnd);
}
