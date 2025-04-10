/*
  # Seed Reference Data

  1. Purpose
    - Populate reference tables with initial data
    - Add common species, breeds, and colors
    - Support both English and Ukrainian languages

  2. Data
    - Common pet species
    - Popular breeds for each species
    - Standard colors
*/

-- Insert species
INSERT INTO species (name_en, name_uk) VALUES
  ('Dog', 'Собака'),
  ('Cat', 'Кіт'),
  ('Horse', 'Кінь'),
  ('Rabbit', 'Кролик'),
  ('Bird', 'Птах');

-- Insert breeds (examples for dogs)
WITH dog_id AS (SELECT id FROM species WHERE name_en = 'Dog')
INSERT INTO breeds (species_id, name_en, name_uk) 
SELECT dog_id.id, name_en, name_uk
FROM dog_id, (VALUES
  ('German Shepherd', 'Німецька вівчарка'),
  ('Labrador Retriever', 'Лабрадор-ретривер'),
  ('Golden Retriever', 'Золотистий ретривер'),
  ('Bulldog', 'Бульдог'),
  ('Poodle', 'Пудель'),
  ('Rottweiler', 'Ротвейлер'),
  ('Yorkshire Terrier', 'Йоркширський тер''єр'),
  ('Boxer', 'Боксер'),
  ('Dachshund', 'Такса'),
  ('Siberian Husky', 'Сибірський хаскі')
) AS t(name_en, name_uk);

-- Insert breeds (examples for cats)
WITH cat_id AS (SELECT id FROM species WHERE name_en = 'Cat')
INSERT INTO breeds (species_id, name_en, name_uk)
SELECT cat_id.id, name_en, name_uk
FROM cat_id, (VALUES
  ('Persian', 'Перська'),
  ('Maine Coon', 'Мейн-кун'),
  ('Siamese', 'Сіамська'),
  ('British Shorthair', 'Британська короткошерста'),
  ('Scottish Fold', 'Шотландська висловуха'),
  ('Bengal', 'Бенгальська'),
  ('Sphynx', 'Сфінкс'),
  ('Russian Blue', 'Російська блакитна'),
  ('Ragdoll', 'Регдол'),
  ('American Shorthair', 'Американська короткошерста')
) AS t(name_en, name_uk);

-- Insert colors
INSERT INTO colors (name_en, name_uk) VALUES
  ('Black', 'Чорний'),
  ('White', 'Білий'),
  ('Brown', 'Коричневий'),
  ('Gray', 'Сірий'),
  ('Golden', 'Золотистий'),
  ('Red', 'Рудий'),
  ('Cream', 'Кремовий'),
  ('Blue', 'Блакитний'),
  ('Silver', 'Сріблястий'),
  ('Spotted', 'Плямистий'),
  ('Tabby', 'Смугастий'),
  ('Tricolor', 'Триколірний'),
  ('Brindle', 'Тигровий'),
  ('Merle', 'Мармуровий');
