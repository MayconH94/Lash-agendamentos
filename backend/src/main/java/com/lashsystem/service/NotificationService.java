package com.lashsystem.service;

import com.lashsystem.entity.SalonSettings;
import com.lashsystem.repository.SalonSettingsRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Avisa a profissional no WhatsApp quando entra um agendamento novo (via CallMeBot,
 * serviço gratuito que envia mensagens para o PRÓPRIO número dela).
 * Sem CALLMEBOT_APIKEY configurada, não faz nada. Falha de envio nunca atrapalha o agendamento.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private static final ZoneId ZONE = ZoneId.of("America/Sao_Paulo");
    private static final DateTimeFormatter WHEN = DateTimeFormatter.ofPattern("dd/MM/yyyy 'às' HH:mm");

    private final SalonSettingsRepository settings;
    private final RestClient restClient = RestClient.create();

    @Value("${app.notify.callmebot-apikey:}")
    private String apiKey;

    @Async
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onBooked(AppointmentBookedEvent event) {
        if (apiKey == null || apiKey.isBlank()) return;

        try {
            String whatsapp = settings.findById(1).map(SalonSettings::getWhatsapp).orElse(null);
            if (whatsapp == null || whatsapp.isBlank()) return;

            String digits = whatsapp.replaceAll("\\D", "");
            String phone = "+" + (digits.startsWith("55") && digits.length() >= 12 ? digits : "55" + digits);

            String text = "Novo agendamento! 💕\n"
                    + "Cliente: " + event.clientName() + "\n"
                    + "WhatsApp: " + event.clientPhone() + "\n"
                    + "Serviço: " + event.serviceName() + "\n"
                    + "Quando: " + WHEN.format(ZonedDateTime.ofInstant(event.startTime(), ZONE));

            var uri = UriComponentsBuilder.fromUriString("https://api.callmebot.com/whatsapp.php")
                    .queryParam("phone", phone)
                    .queryParam("text", text)
                    .queryParam("apikey", apiKey)
                    .encode()
                    .build()
                    .toUri();

            restClient.get().uri(uri).retrieve().toBodilessEntity();
        } catch (Exception e) {
            log.warn("Não foi possível enviar o aviso de novo agendamento: {}", e.getMessage());
        }
    }
}
