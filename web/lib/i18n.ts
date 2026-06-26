export const locales = ["pt", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "pt";

export const hasLocale = (value: string): value is Locale => locales.includes(value as Locale);

export const copy = {
  pt: {
    nav: {
      home: "Início",
      projects: "Projetos",
      about: "Sobre",
      contact: "Contato",
    },
    paths: {
      projects: "/projetos",
      about: "/sobre",
      contact: "/contato",
    },
    home: {
      kicker: "Publicidade criativa",
      title: "Branding, social e narrativas que geram conexão.",
      subtitle:
        "Portfólio de Júlia Fialho com foco em estratégia criativa, direção visual e campanhas autorais.",
      cta: "Ver projetos",
      featured: "Projetos em destaque",
    },
    about: {
      title: "Sobre",
      body: "Perfil em construção com base no currículo e portfólio selecionado.",
    },
    contact: {
      title: "Contato",
      body: "Canal prioritário: Instagram.",
      cta: "Abrir Instagram",
    },
    projects: {
      title: "Projetos",
      tierA: "Case completo",
      tierB: "Case médio",
      view: "Ver case",
    },
  },
  en: {
    nav: {
      home: "Home",
      projects: "Projects",
      about: "About",
      contact: "Contact",
    },
    paths: {
      projects: "/projects",
      about: "/about",
      contact: "/contact",
    },
    home: {
      kicker: "Creative advertising",
      title: "Branding, social, and storytelling that build connection.",
      subtitle:
        "Julia Fialho portfolio focused on creative strategy, visual direction, and authored campaigns.",
      cta: "View projects",
      featured: "Featured projects",
    },
    about: {
      title: "About",
      body: "Profile page in progress based on curriculum and selected portfolio material.",
    },
    contact: {
      title: "Contact",
      body: "Priority channel: Instagram.",
      cta: "Open Instagram",
    },
    projects: {
      title: "Projects",
      tierA: "Full case",
      tierB: "Medium case",
      view: "View case",
    },
  },
} as const;
