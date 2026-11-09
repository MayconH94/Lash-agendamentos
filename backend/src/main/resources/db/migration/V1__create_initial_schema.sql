-- Extensão que permite combinar igualdade e intervalos na mesma restrição
CREATE EXTENSION IF NOT EXISTS btree_gist;

CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    duration_minutes INT NOT NULL,
    buffer_minutes INT NOT NULL DEFAULT 15,
    price NUMERIC(10, 2) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name VARCHAR(150) NOT NULL,
    client_phone VARCHAR(20) NOT NULL,
    service_id UUID NOT NULL REFERENCES services(id),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'CONFIRMED',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT end_after_start CHECK (end_time > start_time),

    -- Blindagem contra Race Condition:
    CONSTRAINT no_overlapping_appointments
        EXCLUDE USING gist (
            tstzrange(start_time, end_time) WITH &&
        )
        WHERE (status <> 'CANCELLED')
);
