package com.lashsystem.service;

import com.lashsystem.entity.Appointment;
import com.lashsystem.entity.SalonService;
import com.lashsystem.exception.ResourceNotFoundException;
import com.lashsystem.exception.SlotConflictException;
import com.lashsystem.repository.AppointmentRepository;
import com.lashsystem.repository.SalonServiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final SalonServiceRepository serviceRepository;

    @Transactional
    public Appointment book(String clientName, String clientPhone, UUID serviceId, Instant startTime) {
        SalonService salonService = serviceRepository.findById(serviceId)
                .filter(SalonService::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("Serviço não encontrado"));

        Instant endTime = startTime.plus(Duration.ofMinutes(
                salonService.getDurationMinutes() + salonService.getBufferMinutes()));

        // 1ª checagem: rápida, só para dar uma resposta amigável
        if (appointmentRepository.hasOverlap(startTime, endTime)) {
            throw new SlotConflictException("Horário já está ocupado");
        }

        Appointment appointment = Appointment.builder()
                .clientName(clientName)
                .clientPhone(clientPhone)
                .serviceId(serviceId)
                .startTime(startTime)
                .endTime(endTime)
                .status("CONFIRMED")
                .build();

        try {
            // 2ª checagem: a que vale. Se duas requisições passarem pela 1ª ao mesmo
            // tempo, o banco rejeita a segunda aqui.
            return appointmentRepository.saveAndFlush(appointment);
        } catch (DataIntegrityViolationException ex) {
            throw new SlotConflictException("Outra cliente acabou de reservar este horário");
        }
    }
}
