# Festa Junina Escolar

Aplicação web completa para gerenciamento da Festa Junina Escolar. Projeto didático demonstrando a integração entre **Frontend**, **Backend** e **Banco de Dados** para alunos do curso de **Desenvolvimento de Sistemas**.

---

## Tecnologias Utilizadas

| Camada | Tecnologia |
|--------|-----------|
| **Frontend** | React 18 + TypeScript + Tailwind CSS |
| **Backend** | Supabase Edge Functions (Deno/Node.js) |
| **Banco de Dados** | PostgreSQL (Supabase) |
| **Autenticação** | Supabase Auth (email/senha) |
| **Build** | Vite |

---

## Estrutura de Pastas

```
├── src/
│   ├── components/        # Componentes reutilizáveis (Countdown, Navbar, Footer)
│   ├── pages/           # Páginas da aplicação (Home, Programação, Barracas, Admin, Login)
│   ├── layouts/         # Layouts principais (MainLayout com Navbar + Footer)
│   ├── context/         # Contexto de autenticação (AuthContext)
│   ├── lib/             # Configuração do Supabase Client
│   ├── index.css        # Estilos globais com Tailwind
│   └── main.tsx         # Entry point da aplicação React
├── supabase/
│   └── functions/api/   # Edge Function REST API (backend serverless)
└── public/              # Assets estáticos
```

---

## Como Conectar ao Supabase

As credenciais do Supabase já estão pre-configuradas no arquivo `.env`:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SEU-ANON-KEY
```

**No frontend**, o cliente Supabase é criado em `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

**No backend** (Edge Function), a `SERVICE ROLE KEY` já está disponível como variável de ambiente.

---

## Banco de Dados - Tabelas

| Tabela | Descrição |
|--------|-----------|
| `barracas` | Barracas da festa (nome, descrição, responsável, imagem) |
| `produtos` | Produtos vendidos em cada barraca (nome, preço, barraca_id) |
| `apresentacoes` | Programação de apresentações (título, horário, local, categoria) |
| `voluntarios` | Cadastro de voluntários (nome, telefone, função) |
| `quadrilhas` | Equipes de quadrilha (nome, telefone, quadrilha, participantes, aprovada) |
| `configuracoes` | Configurações do evento (chave, valor) |

---

## API REST - Exemplos de Requisições

A Edge Function `api` expõe endpoints RESTful para todas as tabelas:

### GET - Listar todos os registros
```bash
curl -X GET \
  https://SEU-PROJETO.supabase.co/functions/v1/api/barracas \
  -H "Authorization: Bearer ANON_KEY"
```

### GET - Buscar um registro
```bash
curl -X GET \
  https://SEU-PROJETO.supabase.co/functions/v1/api/barracas/UUID \
  -H "Authorization: Bearer ANON_KEY"
```

### POST - Criar novo registro
```bash
curl -X POST \
  https://SEU-PROJETO.supabase.co/functions/v1/api/barracas \
  -H "Authorization: Bearer ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Barraca Nova","descricao":"Doces","responsavel":"Maria"}'
```

### PUT - Atualizar registro
```bash
curl -X PUT \
  https://SEU-PROJETO.supabase.co/functions/v1/api/barracas/UUID \
  -H "Authorization: Bearer ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Barraca Atualizada"}'
```

### DELETE - Remover registro
```bash
curl -X DELETE \
  https://SEU-PROJETO.supabase.co/functions/v1/api/barracas/UUID \
  -H "Authorization: Bearer ANON_KEY"
```

---

## Funcionalidades

### Frontend (Site Público)
- **Página Inicial**: Banner animado, contador regressivo, programação, barracas, galeria, formulário de inscrição de quadrilhas
- **Programação**: Lista de apresentações com filtros por categoria
- **Barracas**: Lista com produtos e preços
- **Inscrição de Quadrilha**: Formulário público (1 responsável + 11 participantes)

### Painel Administrativo (Protegido por Login)
- **Dashboard**: Contadores de barracas, produtos, apresentações, voluntários, quadrilhas
- **CRUD Completo**: Barracas, Produtos, Apresentações, Voluntários, Quadrilhas, Configurações
- **Aprovação de Quadrilhas**: Aprovar/reprovar inscrições de equipes

---

## Autenticação

O sistema usa **Supabase Auth** com email e senha. O usuário pode:
- **Cadastrar** nova conta (sign up)
- **Fazer login** (sign in)
- **Sair** (sign out)

Apenas usuários autenticados acessam o **Painel Admin**. Os dados do painel são protegidos por **Row Level Security (RLS)** no banco de dados.

---

## Arquitetura da Aplicação

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                            │
│  React + TypeScript + Tailwind CSS + React Router           │
│  ┌─────────┐ ┌─────────────┐ ┌─────────┐ ┌─────────────┐  │
│  │  Home   │ │ Programação │ │ Barracas│ │  Admin      │  │
│  └─────────┘ └─────────────┘ └─────────┘ └─────────────┘  │
│                          │                                  │
│                   ┌──────┴──────┐                           │
│                   │ AuthContext │                           │
│                   └─────────────┘                           │
│                          │                                  │
│                   ┌──────┴──────┐                           │
│                   │ Supabase JS │                           │
│                   └─────────────┘                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ HTTP
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND                             │
│  Supabase Edge Functions (Deno) - Serverless                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  /functions/v1/api/{tabela}  GET/POST/PUT/DELETE    │    │
│  └─────────────────────────────────────────────────────┘    │
│                         │                                   │
│                   ┌─────┴─────┐                             │
│                   │ Supabase  │                             │
│                   │ Client    │                             │
│                   └───────────┘                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ SQL
┌─────────────────────────────────────────────────────────────┐
│                      BANCO DE DADOS                         │
│  PostgreSQL (Supabase)                                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────────┐ ┌─────────────┐  │
│  │ barracas│ │produtos │ │apresentacoes│ │ voluntarios │  │
│  └─────────┘ └─────────┘ └─────────────┘ └─────────────┘  │
│  ┌─────────┐ ┌─────────────┐ ┌─────────────────────────┐  │
│  │quadrilhas│ │configuracoes│ │ auth.users (Supabase)   │  │
│  └─────────┘ └─────────────┘ └─────────────────────────┘  │
│                                                             │
│  RLS (Row Level Security) - protege os dados por usuário   │
└─────────────────────────────────────────────────────────────┘
```

---

## Executando o Projeto

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
```

O servidor de desenvolvimento roda em `http://localhost:3000`.

---

## Projeto Educacional

Este projeto foi desenvolvido para fins didáticos, demonstrando:
- Separação de responsabilidades entre **Frontend**, **Backend** e **Banco de Dados**
- Uso de **APIs REST** com métodos HTTP (GET, POST, PUT, DELETE)
- **Autenticação** e proteção de rotas
- **CRUD** completo em todas as camadas
- **Componentização** no frontend
- Estilização moderna com **Tailwind CSS**
- **Responsividade** para mobile, tablet e desktop
- Animações e micro-interações para melhor UX

---

## Licença

MIT License - Projeto Educacional
