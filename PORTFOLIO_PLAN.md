# Portfólio Júlia Fialho — Plano Definitivo (v1)

## Decisões Fechadas

## Posicionamento
- Frase-base (PT): **“Publicidade criativa focada em branding, social e narrativas que geram conexão.”**
- Objetivo principal: **vagas CLT**
- Público prioritário: **diretores criativos/agências + gestores in-house**
- Público secundário: **pequenos negócios**

## Direção Criativa
- Mood: **light editorial**
- Tipografia: **display expressiva nos títulos + fonte neutra no corpo**
- Home: **abertura cinematográfica**
- Navegação: **side nav experimental**
- Ordem dos projetos: **best work first (estratégico)**

## Conteúdo
- Internacionalização: **rotas separadas `/pt` e `/en`**
- Fonte de conteúdo: **Markdown no repositório**
- Presença pessoal: **foto de retrato**
- Prova social: **não incluir logos/depoimentos/métricas por enquanto**

## Motion & Performance
- Stack de animação: **GSAP + Framer Motion**
- Ajuste acordado:
  - motion forte em home e cases destaque
  - motion moderado nas demais telas
  - suporte a `prefers-reduced-motion`

---

## Arquitetura de Informação (IA)

## Rotas principais
- `/pt` — home em português
- `/en` — home em inglês
- `/pt/projetos` e `/en/projects` — listagem de cases
- `/pt/projetos/[slug]` e `/en/projects/[slug]` — detalhe do case
- `/pt/sobre` e `/en/about` — perfil profissional
- `/pt/contato` e `/en/contact` — contato (CTA principal Instagram)

## Estrutura de página (Home)
1. Hero cinematográfico (manifesto curto + transição visual)
2. Featured cases (3–5 projetos mais fortes)
3. Grid de todos os projetos (rápido escaneamento)
4. Bloco “Sobre” resumido
5. CTA final para Instagram

---

## Modelo de Profundidade dos Cases

- **Tier A (hero):** 5 cases com narrativa completa
  - contexto
  - desafio
  - estratégia
  - execução
  - resultados / impacto percebido
  - aprendizados
- **Tier B:** restante com versão média (objetiva + visual forte)

Casos inicialmente candidatos a Tier A:
- Sanchez (voluntário / identidade)
- The Body Shop
- Cinemark
- Vital Fresh
- Paraisópolis ou APP Brasil

---

## Organização de Conteúdo (repo)

### Conteúdo editorial
- `web/content/profile/profile.pt.md`
- `web/content/profile/profile.en.md`
- `web/content/cases/*.pt.md`
- `web/content/cases/*.en.md`

### Mídia
- Originais ficam fora do app para preservação
- Entrega web principal via Cloudinary (URLs em frontmatter)
- Fallback/local dev via rota `/media/[slug]/...` quando necessário

---

## Stack Técnica

- Next.js (App Router, TypeScript)
- Tailwind CSS
- shadcn/ui
- Framer Motion (microinterações e transições de componentes)
- GSAP (timelines cinematográficas/scroll avançado)

---

## Regras de Qualidade

- Responsivo real (mobile-first + desktop refinado)
- Texto legível sempre acima de efeitos
- Motion com propósito narrativo (não decorativo)
- Acessibilidade mínima:
  - contraste adequado
  - foco visível
  - navegação teclado
  - redução de movimento respeitada

---

## Fases de Implementação

## Fase 1 — Foundation
1. Scaffold Next.js + Tailwind + shadcn
2. Estrutura de rotas i18n (`/pt`, `/en`)
3. Tema visual base (cores, tipografia, spacing)
4. Side nav experimental (versão 1)

## Fase 2 — Conteúdo e Cases
1. Definir schema markdown dos cases
2. Implementar listagem de projetos
3. Implementar template de página de case (Tier A / Tier B)
4. Inserir conteúdos iniciais (sem precisar subir tudo de uma vez)

## Fase 3 — Motion System
1. Hero cinematográfico (GSAP timeline)
2. Transições entre seções/pages (Framer)
3. Scroll-driven reveals e parallax pontual
4. Fallback de motion reduzido

## Fase 4 — Refino e Deploy
1. Revisão de copy PT/EN
2. Otimização de mídia
3. QA responsivo + acessibilidade
4. Deploy (Vercel)

---

## Backlog de Melhorias (no-regret, antes do redesign)

1. **Qualidade de conteúdo (prioridade máxima)**
   - Preencher narrativa real dos 5 Tier A primeiro
   - Padronizar profundidade mínima por case (contexto, desafio, estratégia, execução, resultado)
2. **SEO técnico**
   - Metadata por rota/case (title, description, canonical)
   - Open Graph consistente para home + cases
   - `sitemap.xml` e `robots.txt`
3. **Medição de produto**
   - Vercel Analytics + eventos-chave (view case, clique Instagram, troca de idioma)
4. **Acessibilidade baseline**
   - Alt text por mídia
   - Hierarquia semântica, foco visível, contraste validado
5. **Confiabilidade de mídia**
   - Zerar links quebrados (`/media/...` residuais ou URLs inacessíveis)
   - Estratégia para arquivos pesados (compressão/conversão por lote)

---

## Preparação Dev para Escalar Conteúdo + Interatividade Futura

### 1) Contrato de conteúdo (anti-caos)
- Criar schema validado para frontmatter (ex: Zod)
- Campos obrigatórios por tipo de case (Tier A vs Tier B)
- Falhar build quando markdown estiver inválido

### 2) Pipeline de conteúdo previsível
- Comando único de sync (`npm run content:sync`) para:
  - validar markdown
  - checar links de mídia
  - gerar artefatos derivados (índice, stats, slugs)
- Script de lint de conteúdo no CI

### 3) Modelo de mídia pronto para crescimento
- Adicionar `mediaManifest` opcional por case (ordem, tipo, legenda, créditos)
- Separar “asset bruto” de “asset de apresentação”
- Definir presets de transformação (thumb, full, vídeo teaser)

### 4) Arquitetura para experiências interativas
- Criar “blocks” de case orientados a composição (`text`, `gallery`, `video`, `quote`, `timeline`, `interactive`)
- Evitar lógica hardcoded por slug
- Cada bloco com fallback estático (SSR-friendly)

### 5) Camada de animação desacoplada
- Centralizar tokens de motion (duração, easing, intensidade)
- Separar animação de entrada vs narrativa de scroll
- Feature flag para desligar experiências pesadas por página/dispositivo

### 6) Performance budget desde agora
- Definir orçamento por rota (JS, imagens, vídeo)
- Lazy loading agressivo para mídia não crítica
- Estratégia de poster/preview para vídeos

### 7) Observabilidade e qualidade de release
- CI com: lint, build, validação de conteúdo, link check
- Preview deploy obrigatório por PR
- Checklist de publicação de case novo

### 8) Flexibilidade para futuro CMS (se quiser)
- Manter adaptador de dados (hoje markdown, amanhã CMS)
- Interface única `getCases/getCaseBySlug` sem acoplar UI à origem dos dados

---

## Próximo passo recomendado (dev-first)

Implementar em ordem:
1. Validador de frontmatter + fail build
2. Script de verificação de mídia quebrada
3. Estrutura de blocos de case (`blocks`) com renderer simples

Com isso, o redesign futuro muda “pele”, não fundação.
