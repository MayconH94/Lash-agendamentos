CREATE TABLE salon_settings (
    id       INT PRIMARY KEY CHECK (id = 1),
    whatsapp VARCHAR(20)
);

INSERT INTO salon_settings (id, whatsapp) VALUES (1, NULL);