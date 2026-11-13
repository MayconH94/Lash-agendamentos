package com.lashsystem.service;

import java.time.Instant;

// Publicado quando um agendamento é salvo; quem quiser (ex.: avisos) escuta.
public record AppointmentBookedEvent(String clientName, String clientPhone,
                                     String serviceName, Instant startTime) {}
