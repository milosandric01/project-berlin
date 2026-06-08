INSERT INTO users (email, password_hash) VALUES
  ('kermit@flowiz.dev', '$2b$10$1Te0twevYylP3tM36kW5au/PZfv4E7rbpZ/daKNSAJHho31ducHJG')
ON CONFLICT (email) DO NOTHING;
