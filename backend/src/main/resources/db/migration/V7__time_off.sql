-- Folgas e bloqueios: períodos em que a profissional não atende (dia inteiro ou só algumas horas)
CREATE TABLE time_off (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    reason VARCHAR(100),
    CONSTRAINT time_off_valid CHECK (end_time > start_time)
);
