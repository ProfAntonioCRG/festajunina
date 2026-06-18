/*
# Criacao das tabelas da Festa Junina Escolar

1. Novas Tabelas
- `barracas`: Armazena informacoes das barracas da festa (id, nome, descricao, responsavel, imagem)
- `produtos`: Produtos vendidos em cada barraca (id, nome, preco, barraca_id)
- `apresentacoes`: Programacao de apresentacoes (id, titulo, horario, local, categoria)
- `voluntarios`: Cadastro de voluntarios (id, nome, telefone, funcao)
- `quadrilhas`: Cadastro de equipes de quadrilha (id, nome, telefone, quadrilha, participantes, aprovada)
- `configuracoes`: Configuracoes do frontend como datas e horarios (id, chave, valor)

2. Seguranca
- RLS habilitado em todas as tabelas
- Politicas para anon (leitura publica) e authenticated (CRUD completo)
- Dados publicos de leitura, escritas apenas autenticadas
*/

CREATE TABLE IF NOT EXISTS barracas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  descricao text NOT NULL,
  responsavel text NOT NULL,
  imagem text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS produtos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  preco numeric(10,2) NOT NULL,
  barraca_id uuid NOT NULL REFERENCES barracas(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS apresentacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo text NOT NULL,
  horario text NOT NULL,
  local text NOT NULL,
  categoria text NOT NULL DEFAULT 'quadrilha',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS voluntarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  telefone text NOT NULL,
  funcao text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quadrilhas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  telefone text NOT NULL,
  quadrilha text NOT NULL,
  participantes text NOT NULL,
  aprovada boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS configuracoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chave text UNIQUE NOT NULL,
  valor text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE barracas ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE apresentacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE voluntarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE quadrilhas ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_barracas" ON barracas;
CREATE POLICY "anon_select_barracas" ON barracas FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_barracas" ON barracas;
CREATE POLICY "auth_insert_barracas" ON barracas FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_barracas" ON barracas;
CREATE POLICY "auth_update_barracas" ON barracas FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_barracas" ON barracas;
CREATE POLICY "auth_delete_barracas" ON barracas FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_produtos" ON produtos;
CREATE POLICY "anon_select_produtos" ON produtos FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_produtos" ON produtos;
CREATE POLICY "auth_insert_produtos" ON produtos FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_produtos" ON produtos;
CREATE POLICY "auth_update_produtos" ON produtos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_produtos" ON produtos;
CREATE POLICY "auth_delete_produtos" ON produtos FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_apresentacoes" ON apresentacoes;
CREATE POLICY "anon_select_apresentacoes" ON apresentacoes FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_apresentacoes" ON apresentacoes;
CREATE POLICY "auth_insert_apresentacoes" ON apresentacoes FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_apresentacoes" ON apresentacoes;
CREATE POLICY "auth_update_apresentacoes" ON apresentacoes FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_apresentacoes" ON apresentacoes;
CREATE POLICY "auth_delete_apresentacoes" ON apresentacoes FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_voluntarios" ON voluntarios;
CREATE POLICY "anon_select_voluntarios" ON voluntarios FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_voluntarios" ON voluntarios;
CREATE POLICY "auth_insert_voluntarios" ON voluntarios FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_voluntarios" ON voluntarios;
CREATE POLICY "auth_update_voluntarios" ON voluntarios FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_voluntarios" ON voluntarios;
CREATE POLICY "auth_delete_voluntarios" ON voluntarios FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_quadrilhas" ON quadrilhas;
CREATE POLICY "anon_select_quadrilhas" ON quadrilhas FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_quadrilhas" ON quadrilhas;
CREATE POLICY "auth_insert_quadrilhas" ON quadrilhas FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_quadrilhas" ON quadrilhas;
CREATE POLICY "auth_update_quadrilhas" ON quadrilhas FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_quadrilhas" ON quadrilhas;
CREATE POLICY "auth_delete_quadrilhas" ON quadrilhas FOR DELETE TO authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_configuracoes" ON configuracoes;
CREATE POLICY "anon_select_configuracoes" ON configuracoes FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_configuracoes" ON configuracoes;
CREATE POLICY "auth_insert_configuracoes" ON configuracoes FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_configuracoes" ON configuracoes;
CREATE POLICY "auth_update_configuracoes" ON configuracoes FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_configuracoes" ON configuracoes;
CREATE POLICY "auth_delete_configuracoes" ON configuracoes FOR DELETE TO authenticated USING (true);

INSERT INTO configuracoes (chave, valor) VALUES
  ('evento_nome', 'Festa Junina Escolar 2026'),
  ('evento_data', '2026-06-28'),
  ('evento_hora', '18:00'),
  ('evento_local', 'Patio da Escola'),
  ('evento_descricao', 'Venha celebrar conosco a tradicional Festa Junina!')
ON CONFLICT (chave) DO NOTHING;

INSERT INTO barracas (nome, descricao, responsavel, imagem) VALUES
  ('Barraca da Maria', 'Deliciosos doces tipicos juninos', 'Maria Silva', 'https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg'),
  ('Barraca do Joao', 'Comidas salgadas e cachorro-quente', 'Joao Souza', 'https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg'),
  ('Barraca da Ana', 'Bebidas e refrigerantes', 'Ana Paula', 'https://images.pexels.com/photos/3184183/pexels-photo-3184183.jpeg')
ON CONFLICT DO NOTHING;

INSERT INTO produtos (nome, preco, barraca_id) VALUES
  ('Pamonha', 5.00, (SELECT id FROM barracas WHERE nome = 'Barraca da Maria')),
  ('Canjica', 4.00, (SELECT id FROM barracas WHERE nome = 'Barraca da Maria')),
  ('Milho Verde', 3.00, (SELECT id FROM barracas WHERE nome = 'Barraca da Maria')),
  ('Cachorro-Quente', 8.00, (SELECT id FROM barracas WHERE nome = 'Barraca do Joao')),
  ('Pastel', 6.00, (SELECT id FROM barracas WHERE nome = 'Barraca do Joao')),
  ('Refrigerante', 4.00, (SELECT id FROM barracas WHERE nome = 'Barraca da Ana')),
  ('Suco Natural', 5.00, (SELECT id FROM barracas WHERE nome = 'Barraca da Ana'))
ON CONFLICT DO NOTHING;

INSERT INTO apresentacoes (titulo, horario, local, categoria) VALUES
  ('Quadrilha Junina Infantil', '19:00', 'Patio Central', 'quadrilha'),
  ('Show de Forro', '20:00', 'Palco Principal', 'musica'),
  ('Concurso de Melhor Quadrilha', '21:00', 'Patio Central', 'quadrilha'),
  ('Teatro Junino', '18:30', 'Salao de Eventos', 'teatro'),
  ('Danca Folclorica', '19:30', 'Palco Principal', 'danca')
ON CONFLICT DO NOTHING;
