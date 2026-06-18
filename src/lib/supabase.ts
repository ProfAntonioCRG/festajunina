import { createClient } from '@supabase/supabase-js';

// SUPABASE: Cliente para comunicação com o banco de dados
// O Supabase fornece um cliente JS que conecta frontend com o backend/banco
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Tipos para as tabelas do banco de dados
export type Database = {
  public: {
    Tables: {
      barracas: {
        Row: { id: string; nome: string; descricao: string; responsavel: string; imagem: string | null; created_at: string };
        Insert: Omit<Database['public']['Tables']['barracas']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['barracas']['Insert']>;
      };
      produtos: {
        Row: { id: string; nome: string; preco: number; barraca_id: string; created_at: string };
        Insert: Omit<Database['public']['Tables']['produtos']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['produtos']['Insert']>;
      };
      apresentacoes: {
        Row: { id: string; titulo: string; horario: string; local: string; categoria: string; created_at: string };
        Insert: Omit<Database['public']['Tables']['apresentacoes']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['apresentacoes']['Insert']>;
      };
      voluntarios: {
        Row: { id: string; nome: string; telefone: string; funcao: string; created_at: string };
        Insert: Omit<Database['public']['Tables']['voluntarios']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['voluntarios']['Insert']>;
      };
      quadrilhas: {
        Row: { id: string; nome: string; telefone: string; quadrilha: string; participantes: string; aprovada: boolean; created_at: string };
        Insert: Omit<Database['public']['Tables']['quadrilhas']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['quadrilhas']['Insert']>;
      };
      configuracoes: {
        Row: { id: string; chave: string; valor: string; created_at: string };
        Insert: Omit<Database['public']['Tables']['configuracoes']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['configuracoes']['Insert']>;
      };
    };
  };
};
