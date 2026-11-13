-- Prazo (em dias) para a cliente voltar para a manutenção; NULL = serviço sem lembrete de retorno
ALTER TABLE services ADD COLUMN maintenance_days INT;
ALTER TABLE services ADD CONSTRAINT services_maintenance_days_valid
    CHECK (maintenance_days IS NULL OR maintenance_days BETWEEN 1 AND 365);

-- Sugestão inicial para serviços de cílios (a profissional ajusta no painel)
UPDATE services SET maintenance_days = 21
WHERE category_id IN (SELECT id FROM service_categories WHERE name = 'Cílios');
