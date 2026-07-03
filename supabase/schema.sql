-- Run this once in the Supabase SQL editor after creating your project.
-- Requires the pgvector extension (Supabase has it built in).

create extension if not exists vector;

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  content text not null,
  embedding vector(768) not null,
  source text not null,
  project text not null,
  created_at timestamptz default now()
);

create index if not exists documents_embedding_idx
  on documents using ivfflat (embedding vector_cosine_ops) with (lists = 10);
