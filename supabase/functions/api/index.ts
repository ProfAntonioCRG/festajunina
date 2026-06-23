import { createClient } from "npm:@supabase/supabase-js@2.39.0";

// CORS headers obrigatórios para compatibilidade com Supabase Client
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

// Inicializa cliente Supabase com a SERVICE ROLE KEY (acesso total ao DB)
// As credenciais vem das variáveis de ambiente do Supabase (Deno.env)
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// BACKEND: Edge Function API RESTful
// Esta função serverless atua como backend, expondo endpoints para CRUD
Deno.serve(async (req: Request) => {
  // Responde preflight CORS
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.replace(/^\/api\//, "");
    const segments = path.split("/").filter(Boolean);
    const table = segments[0] ?? "";
    const id = segments[1] ?? null;

    // GET /api/:table — Lista todos os registros de uma tabela
    if (req.method === "GET" && table && !id) {
      const { data, error } = await supabase.from(table).select("*");
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /api/:table/:id — Busca um registro específico
    if (req.method === "GET" && table && id) {
      const { data, error } = await supabase.from(table).select("*").eq("id", id).single();
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST /api/:table — Cria novo registro
    if (req.method === "POST" && table) {
      const body = await req.json();
      const { data, error } = await supabase.from(table).insert(body).select();
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // PUT /api/:table/:id — Atualiza registro existente
    if (req.method === "PUT" && table && id) {
      const body = await req.json();
      const { data, error } = await supabase.from(table).update(body).eq("id", id).select();
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // DELETE /api/:table/:id — Remove registro
    if (req.method === "DELETE" && table && id) {
      const { data, error } = await supabase.from(table).delete().eq("id", id).select();
      if (error) throw error;
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Not Found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
