-- Criação do banco de dados e usuário
CREATE DATABASE crm_pharma;
CREATE USER pharma_user WITH ENCRYPTED PASSWORD 'pharma_password';
GRANT ALL PRIVILEGES ON DATABASE crm_pharma TO pharma_user;

-- Extensões úteis para PostgreSQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "unaccent";
