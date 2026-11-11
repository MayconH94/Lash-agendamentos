UPDATE service_categories
SET name = 'Sobrancelhas'
WHERE name = 'Sonbracelhas';

UPDATE services
SET category_id = (SELECT id FROM service_categories WHERE name = 'Cílios'),
    description = 'Efeito volumoso e marcante'
WHERE id = '11111111-1111-1111-1111-111111111111';
