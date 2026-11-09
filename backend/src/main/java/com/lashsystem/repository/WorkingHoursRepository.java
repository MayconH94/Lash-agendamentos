package com.lashsystem.repository;

import com.lashsystem.entity.WorkingHours;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface WorkingHoursRepository extends JpaRepository<WorkingHours, UUID> {

    List<WorkingHours> findByDayOfWeekOrderByStartTime(int dayOfWeek);
}
