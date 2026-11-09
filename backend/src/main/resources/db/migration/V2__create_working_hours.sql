CREATE TABLE working_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 1 AND 7), -- 1 = segunda ... 7 = domingo
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    CONSTRAINT working_hours_valid CHECK (end_time > start_time)
);

-- Padrão inicial: segunda a sábado, 09:00 às 18:00 (a profissional muda depois)
INSERT INTO working_hours (day_of_week, start_time, end_time)
SELECT d, TIME '09:00', TIME '18:00' FROM generate_series(1, 6) AS d;
