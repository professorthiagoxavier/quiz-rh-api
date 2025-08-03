-- Script para criar o banco de dados e tabelas do Quiz RH
-- Execute este script no PostgreSQL

-- Criar banco de dados (execute como superuser)
 CREATE DATABASE quiz_rh;

-- Conectar ao banco quiz_rh
-- \c quiz_rh;

-- Criar tabela categorias
CREATE TABLE IF NOT EXISTS categorias (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela perguntas
CREATE TABLE IF NOT EXISTS perguntas (
    id SERIAL PRIMARY KEY,
    categoria_id INTEGER REFERENCES categorias(id) ON DELETE SET NULL,
    texto TEXT NOT NULL,
    dificuldade VARCHAR(20) CHECK (dificuldade IN ('facil', 'medio', 'dificil')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela respostas
CREATE TABLE IF NOT EXISTS respostas (
    id SERIAL PRIMARY KEY,
    pergunta_id INTEGER REFERENCES perguntas(id) ON DELETE CASCADE,
    texto TEXT NOT NULL,
    correta BOOLEAN DEFAULT FALSE
);

-- Criar tabela usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela resultados_quiz
CREATE TABLE IF NOT EXISTS resultados_quiz (
    id SERIAL PRIMARY KEY,
    usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
    pontuacao INTEGER NOT NULL,
    total_perguntas INTEGER NOT NULL,
    data_quiz TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_perguntas_categoria ON perguntas(categoria_id);
CREATE INDEX IF NOT EXISTS idx_perguntas_dificuldade ON perguntas(dificuldade);
CREATE INDEX IF NOT EXISTS idx_respostas_pergunta ON respostas(pergunta_id);
CREATE INDEX IF NOT EXISTS idx_respostas_correta ON respostas(correta);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_resultados_usuario ON resultados_quiz(usuario_id);
CREATE INDEX IF NOT EXISTS idx_resultados_data ON resultados_quiz(data_quiz);

-- Inserir dados de exemplo (opcional)

-- Categorias de exemplo
INSERT INTO categorias (nome, descricao) VALUES
('Gestão de Pessoas', 'Perguntas sobre gestão de recursos humanos'),
('Recrutamento e Seleção', 'Perguntas sobre processos de R&S'),
('Treinamento e Desenvolvimento', 'Perguntas sobre T&D'),
('Benefícios e Remuneração', 'Perguntas sobre benefícios e salários'),
('Legislação Trabalhista', 'Perguntas sobre CLT e leis trabalhistas')
ON CONFLICT DO NOTHING;

-- Perguntas de exemplo
INSERT INTO perguntas (categoria_id, texto, dificuldade) VALUES
(1, 'Qual é o principal objetivo do RH?', 'facil'),
(1, 'O que significa a sigla RH?', 'facil'),
(2, 'Qual é a primeira etapa do processo de recrutamento?', 'medio'),
(2, 'O que é assessment center?', 'dificil'),
(3, 'Qual é o objetivo do treinamento on-the-job?', 'medio'),
(4, 'O que é PLR?', 'medio'),
(5, 'Quantas horas compõem a jornada de trabalho padrão?', 'facil')
ON CONFLICT DO NOTHING;

-- Respostas de exemplo
INSERT INTO respostas (pergunta_id, texto, correta) VALUES
(1, 'Contratar funcionários', false),
(1, 'Gerenciar pessoas', true),
(1, 'Apenas pagar salários', false),
(1, 'Fazer demissões', false),
(2, 'Recursos Humanos', true),
(2, 'Relações Humanas', false),
(2, 'Recursos Hospitalares', false),
(2, 'Relações Hospitalares', false),
(3, 'Aplicação de testes', false),
(3, 'Análise de currículos', false),
(3, 'Definição do perfil da vaga', true),
(3, 'Entrevista com candidatos', false),
(4, 'Centro de avaliação', true),
(4, 'Centro de treinamento', false),
(4, 'Centro de recrutamento', false),
(4, 'Centro de desenvolvimento', false),
(5, 'Treinar fora da empresa', false),
(5, 'Treinar no ambiente de trabalho', true),
(5, 'Treinar online', false),
(5, 'Treinar em grupo', false),
(6, 'Participação nos Lucros e Resultados', true),
(6, 'Plano de Lucros e Resultados', false),
(6, 'Participação Legal e Resultados', false),
(6, 'Plano Legal de Resultados', false),
(7, '6 horas', false),
(7, '8 horas', true),
(7, '10 horas', false),
(7, '12 horas', false)
ON CONFLICT DO NOTHING;

-- Usuários de exemplo
INSERT INTO usuarios (nome, email) VALUES
('João Silva', 'joao@email.com'),
('Maria Santos', 'maria@email.com'),
('Pedro Oliveira', 'pedro@email.com')
ON CONFLICT DO NOTHING;

-- Resultados de exemplo
INSERT INTO resultados_quiz (usuario_id, pontuacao, total_perguntas) VALUES
(1, 8, 10),
(2, 6, 10),
(3, 9, 10),
(1, 7, 8),
(2, 5, 8)
ON CONFLICT DO NOTHING;

-- Comentários sobre as tabelas
COMMENT ON TABLE categorias IS 'Tabela para armazenar categorias de perguntas do quiz';
COMMENT ON TABLE perguntas IS 'Tabela para armazenar as perguntas do quiz';
COMMENT ON TABLE respostas IS 'Tabela para armazenar as respostas das perguntas';
COMMENT ON TABLE usuarios IS 'Tabela para armazenar os usuários do sistema';
COMMENT ON TABLE resultados_quiz IS 'Tabela para armazenar os resultados dos quizzes realizados';

-- Verificar se as tabelas foram criadas corretamente
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('categorias', 'perguntas', 'respostas', 'usuarios', 'resultados_quiz')
ORDER BY table_name, ordinal_position; 