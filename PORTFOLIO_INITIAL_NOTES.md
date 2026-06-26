# Portfólio Júlia Fialho — Ideia Inicial + Diagnóstico de Materiais

## Objetivo
Construir um portfólio online criativo para Júlia Fialho (Publicidade), com foco em:
- branding
- social media
- comunicação estratégica
- produção visual/audiovisual

Stack inicial sugerida:
- Next.js
- Tailwind CSS
- shadcn/ui
- animações/interações com biblioteca dedicada

---

## Direção Criativa (hipótese inicial)
- Site com estética autoral, editorial e dinâmica (não “template genérico”).
- Interações intencionais para reforçar narrativa de cada case.
- Movimento como linguagem (microinterações + transições entre seções/cases).
- Priorizar legibilidade e performance: criativo sem comprometer UX.

---

## Inventário Rápido dos Arquivos Locais (sem leitura de imagens/vídeos)

### Estrutura base
- `CV - JÚLIA FIALHO-3.pdf`
- `Portfólio - Julia Fialho/` com projetos acadêmicos, estágio, eventos, pessoal, voluntário e freelancer

### Volume detectado
- 342 arquivos
- 47 diretórios

### Tipos de arquivo
- `.png`: 255
- `.pdf`: 21
- `.JPG`: 29
- `.jpg`: 10
- `.docx`: 3
- `.mov`: 3

### Arquivos-chave textuais mapeados
- `CV - JÚLIA FIALHO-3.pdf`
- `Portfólio - Julia Fialho/Portfólio de Júlia Fialho - Sumário.docx`
- (também há `.docx` de análise de marca em projetos específicos)

---

## Sinais Fortes do CV
- Nome: **Júlia Fialho da Silva**
- Formação: Publicidade e Propaganda (PUC-SP, 2023–2026)
- Experiência: estágio em atendimento/planejamento/criação (Agência PUC), projetos freelancer
- Atuação: branding, social media, conteúdo audiovisual, planejamento de comunicação, eventos
- Hard skills recorrentes: Photoshop, Illustrator, Canva, CapCut, Meta Business, análise de métricas
- Idiomas: inglês avançado, espanhol básico

---

## Sinais Fortes do Sumário de Portfólio
- ~15 projetos em frentes: acadêmico, estágio/agência, pessoal, voluntário, freelancer, eventos
- Temas recorrentes:
  - autenticidade
  - sustentabilidade
  - impacto social/inclusão
  - narrativa emocional
  - campanhas 360°
  - identidade visual/branding

Projetos com potencial de destaque (hipótese inicial):
- Sanchez (voluntário / rebranding)
- The Body Shop (análise + campanha)
- Cinemark (análise + storytelling)
- Vital Fresh (branding + 360°)
- Paraisópolis / APP Brasil (impacto social + estágio)

---

## Organização Sugerida dos Materiais (pré-produção)
Criar estrutura de trabalho interna para facilitar build do site:

1. `assets/raw/` (originais)
2. `assets/selected/` (curadoria para site)
3. `assets/web/` (otimizados para web)
4. `content/cases/` (um markdown/json por case)
5. `content/profile/` (bio, resumo, contatos)

Cada case deve ter:
- contexto
- problema
- estratégia
- execução
- resultados
- ferramentas usadas
- aprendizados

---

## Direção Técnica Inicial (rascunho)
- Next.js (App Router)
- Tailwind + shadcn/ui para base visual consistente
- Conteúdo orientado a dados (JSON/MD) para facilitar manutenção
- Biblioteca de animação/interação (avaliar Framer Motion / GSAP)
- Foco em performance (otimização de mídia, lazy loading, motion progressivo)

---

## Próxima Etapa (antes de planejar)
Sessão de perguntas críticas para fechar decisões de:
- posicionamento profissional principal
- público-alvo do portfólio
- tom visual/narrativo
- profundidade de cada case
- nível de experimentação nas animações
