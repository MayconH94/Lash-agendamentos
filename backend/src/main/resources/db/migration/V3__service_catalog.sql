CREATE TABLE service_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(60) NOT NULL UNIQUE,
    display_order INT NOT NULL DEFAULT 0
);

INSERT INTO service_categories (name, display_order) VALUES
    ('Cílios', 1),
    ('Sonbracelhas', 2);

ALTER TABLE services 
    ADD COLUMN description VARCHAR(500),
    ADD COLUMN image_url VARCHAR(500),
    ADD COLUMN category_id UUID REFERENCES service_categories(id),
    ADD COLUMN display_order INT NOT NULL DEFAULT 0;

-- O serviço que já existe vai para "Cílios"
UPDATE services 
SET category_id = ( SELECT id FROM service_categories WHERE name = 'Cílios'),
    description =  'Efeito volumoso e marcante'
WHERE name = 'Volume russo';

-- Preço congelado no momento do agendamento (mudar o preço depois não altera o histórico)
ALTER TABLE appointments ADD COLUMN price_at_booking NUMERIC(10, 2);

UPDATE appointments a
SET price_at_booking = s.price
FROM services s
WHERE s.id = a.service_id;

ALTER TABLE appointments ALTER COLUMN price_at_booking SET NOT NULL;
