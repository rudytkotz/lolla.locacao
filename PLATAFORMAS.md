# Plataformas e Serviços — Lolla Locação & Balões

Documento de referência com todos os serviços utilizados no projeto.

---

## 🌐 Hospedagem do Site — Netlify
- **URL:** https://netlify.com
- **Plano:** Gratuito
- **Repositório conectado:** https://github.com/rudytkotz/lolla.locacao
- **Deploy automático:** Sim — a cada push na branch `main` o site atualiza sozinho
- **O que hospeda:** Site público (`index.html`) e página admin (`admin.html`)

---

## 💾 Repositório de Código — GitHub
- **URL:** https://github.com/rudytkotz/lolla.locacao
- **Usuário:** rudytkotz
- **Branch principal:** `main`
- **O que armazena:** Todo o código-fonte do site (HTML, CSS, JS)

---

## 🗄️ Banco de Dados — Supabase
- **URL do projeto:** https://bgeybgxyiwektzmgkcdk.supabase.co
- **Dashboard:** https://supabase.com/dashboard
- **Plano:** Gratuito (500MB, pausado após 1 semana sem acesso — basta reativar)
- **Tabelas:**
  - `produtos` — itens do catálogo (nome, descrição, preço, foto, estoque, ordem)
  - `categorias` — categorias dos produtos (slug, label, ordem)
- **Chave pública (anon key):** Está no código — é segura para ficar no frontend
- **⚠️ NUNCA compartilhar:** A `service_role` key (encontrada em Settings > API)

---

## 🖼️ Armazenamento de Imagens — Cloudinary
- **URL:** https://cloudinary.com
- **Dashboard:** https://console.cloudinary.com
- **Plano:** Gratuito (25GB armazenamento, 25GB banda/mês)
- **Cloud Name:** `dqbrytjg`
- **Upload Preset:** `lolla_upload` (modo: Unsigned)
- **O que armazena:** Fotos dos produtos enviadas pelo admin
- **⚠️ NUNCA compartilhar:** A API Secret do Cloudinary (encontrada em Dashboard > API Keys)

---

## 🔤 Fontes — Google Fonts
- **URL:** https://fonts.google.com
- **Plano:** Gratuito
- **Fontes usadas:**
  - `Cormorant Garamond` — títulos e preços
  - `Jost` — texto geral

---

## 📱 Contato / Orçamento — WhatsApp
- **Número:** (24) 97405-0674
- **Link direto:** https://wa.me/5524974050674
- **Uso:** Botão de orçamento no carrinho e links de contato

---

## 📸 Redes Sociais — Instagram
- **Perfil:** @lolla.locacao
- **Link:** https://instagram.com/lolla.locacao

---

## 🔐 Senhas e Acessos

| Serviço    | Usuário / Login         | Onde alterar                          |
|------------|-------------------------|---------------------------------------|
| Admin site | Senha: `*********`      | Arquivo `admin.html`, linha `ADMIN_PASSWORD` |
| GitHub     | rudytkotz               | https://github.com/settings           |
| Netlify    | (login com GitHub)      | https://app.netlify.com               |
| Supabase   | Email de cadastro       | https://supabase.com/dashboard        |
| Cloudinary | Email de cadastro       | https://console.cloudinary.com        |

---

## 📁 Estrutura de Arquivos

```
lolla.locacao/
├── index.html       → Site público (catálogo + carrinho)
├── admin.html       → Página de administração (protegida por senha)
├── style.css        → Estilos do site
├── script.js        → Lógica do site público
├── fotos/           → Fotos locais (kit1.jpg e futuras)
├── seed.sql         → SQL para popular o banco na primeira vez
├── PLATAFORMAS.md   → Este documento
└── .gitignore       → Arquivos ignorados pelo Git
```

---

*Atualizado em: Julho 2025*
