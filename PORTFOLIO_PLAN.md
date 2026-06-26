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
- `site/content/profile/profile.pt.md`
- `site/content/profile/profile.en.md`
- `site/content/cases/*.pt.md`
- `site/content/cases/*.en.md`

### Mídia
- Originais ficam fora do app para preservação
- Seleção para web em `site/public/media/...`
- Convenção por projeto: `site/public/media/<slug-do-projeto>/...`

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

## Próximo passo imediato

Scaffold técnico + criação de templates markdown bilíngues para começar a preencher cases.
