
import React, { createContext, useContext, useState } from 'react';

export type Language = 'pt';

interface LanguageContextType {
  language: Language;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translations for the app
const translations: Record<Language, Record<string, string>> = {
  pt: {
    // Navbar
    'inicio': 'Início',
    'mapa': 'Mapa Ecológico',
    'blog': 'Blog',
    'sobre': 'Sobre Nós',
    'entrar': 'Entrar',
    'cadastrar': 'Cadastrar',
    'sair': 'Sair',
    'ola': 'Olá',
    'admin': 'Admin',
    'painel-admin': 'Painel Admin',
    
    // Hero section
    'hero-title': 'Ecologia em Presidente Prudente',
    'hero-subtitle': 'Acompanhe dados ecológicos e iniciativas ambientais da nossa cidade',
    'hero-cta': 'Explore os Dados',
    
    // Environment monitoring
    'monitoring-title': 'Iniciativas Ecológicas',
    'monitoring-subtitle-info': 'Acompanhe os dados ecológicos de Presidente Prudente.',
    
    // Stats
    'stats-title': 'Impacto Ambiental',
    'stats-subtitle': 'Dados coletados de fontes oficiais sobre a situação ambiental da região.',
    'hectares-monitored': 'Hectares de Vegetação',
    'risk-areas': 'Áreas de Risco Identificadas',
    'seedling-distribution': 'Mudas Distribuídas',
    'air-quality': 'Índice de Qualidade do Ar',
    
    // Chart labels
    'deforested-area': 'Área Verde (hectares)',
    'reforested-area': 'Área Reflorestada (hectares)',
    'air-quality-index': 'Qualidade do Ar (índice)',
    
    // Months
    'jan': 'Jan',
    'feb': 'Fev',
    'mar': 'Mar',
    'apr': 'Abr',
    'may': 'Mai',
    'jun': 'Jun',
    'jul': 'Jul',
    'aug': 'Ago',
    'sep': 'Set',
    'oct': 'Out',
    'nov': 'Nov',
    'dec': 'Dez',
    
    // Theme
    'dark-mode': 'Modo Escuro',
    'light-mode': 'Modo Claro',
    
    // Interactive Section
    'monitoring-systems': 'Informações Ecológicas',
    'monitoring-subtitle': 'Conheça os dados e informações sobre a ecologia em Presidente Prudente',
    'monitoring-system': 'Sistema de Informação',
    'view-realtime-data': 'Visualizar dados',
    
    // Environmental themes
    'deforestation': 'Áreas Verdes',
    'urban-pollution': 'Poluição Urbana',
    'water-resources': 'Recursos Hídricos',
    'renewable-energy': 'Energia Renovável',
    'deforestation-description': 'As áreas verdes são essenciais para o equilíbrio ambiental da nossa região. Através do nosso mapa ecológico, identificamos áreas importantes e promovemos iniciativas de reflorestamento.',
    'pollution-description': 'A poluição urbana afeta a qualidade de vida na cidade. Nosso blog traz informações sobre como reduzir a emissão de poluentes e melhorar o ambiente urbano.',
    'water-description': 'A preservação dos recursos hídricos é fundamental para o equilíbrio ecológico. Mapeamos os principais corpos d\'água da região e seu estado de conservação.',
    'energy-description': 'Promovemos o uso de energias renováveis como alternativa sustentável para o desenvolvimento urbano e rural da região.',
    'green-areas-monitoring': 'Acompanhamento de áreas verdes por imagens de satélite e verificações locais.',
    'pollution-monitoring': 'Análise de dados de qualidade do ar e identificação de fontes de poluição urbana.',
    'water-monitoring': 'Avaliação da qualidade e quantidade de recursos hídricos na região.',
    'energy-monitoring': 'Monitoramento da adoção de fontes renováveis de energia e seu impacto ambiental positivo.',
    
    // Last updated
    'last-updated': 'Última atualização',
    'data-source': 'Fonte de dados',
    
    // Error messages 
    'error-loading-data': 'Erro ao carregar dados',

    // Map points
    'recycling-point': 'Ponto de Coleta Reciclável',
    'recycling-center': 'Local de Reciclagem',
    'seedling-distribution': 'Distribuição de Mudas',
    'recycling-description': 'Locais onde você pode descartar materiais recicláveis',
    'recycling-center-description': 'Centros de processamento e reciclagem de materiais',
    'seedling-description': 'Locais que distribuem mudas para plantio',
    
    // About page
    'about-title': 'Sobre a Green Earth Connect',
    'about-subtitle': 'Uma plataforma comunitária dedicada a promover a conscientização ambiental e práticas sustentáveis através de mapeamento interativo e recursos educacionais.',
    'our-mission': 'Nossa Missão',
    'mission-description': 'A Green Earth Connect foi fundada com um propósito claro: preencher a lacuna entre a conscientização ambiental e a ação comunitária. Acreditamos que ao tornar as informações ecológicas acessíveis e interativas, podemos inspirar mais pessoas a participar de esforços de sustentabilidade.',
    'map-purpose': 'Nosso mapa ecológico interativo serve como a pedra angular desta missão, fornecendo uma representação visual de iniciativas ambientais em comunidades ao redor do mundo. Ao destacar centros de reciclagem, projetos de plantio de árvores, zonas de limpeza e outros pontos ecológicos, nosso objetivo é:',
    'map-goal-1': 'Aumentar a conscientização sobre iniciativas ambientais locais',
    'map-goal-2': 'Facilitar a participação da comunidade em esforços de sustentabilidade',
    'map-goal-3': 'Acompanhar e celebrar o impacto ambiental coletivo',
    'map-goal-4': 'Conectar pessoas com oportunidades para fazer a diferença',
    'vision-statement': 'Declaração de Visão',
    'vision-description': 'Vislumbramos um mundo onde cada comunidade esteja capacitada com o conhecimento, ferramentas e conexões necessárias para criar ambientes locais sustentáveis que contribuam para a saúde ecológica global.',
    'core-values': 'Valores Fundamentais',
    'environmental-stewardship': 'Gestão Ambiental',
    'community-collaboration': 'Colaboração Comunitária',
    'education-awareness': 'Educação e Conscientização',
    'data-transparency': 'Transparência de Dados',
    'how-data-collected': 'Como Nossos Dados do Mapa São Coletados',
    'research-partnerships': 'Pesquisa e Parcerias',
    'partnerships-description': 'Colaboramos com organizações ambientais, governos locais e instituições de pesquisa para coletar dados verificados sobre iniciativas ecológicas em todo o mundo.',
    'community-contributions': 'Contribuições da Comunidade',
    'contributions-description': 'Nossos membros da comunidade enviam informações sobre pontos ecológicos locais, que nossa equipe verifica antes de adicionar ao mapa.',
    'regular-updates': 'Atualizações Regulares',
    'updates-description': 'Atualizamos continuamente nossos dados ecológicos para garantir precisão e relevância, incluindo estatísticas de impacto e novas iniciativas.',
    'explore-map': 'Explorar o Mapa',
    'our-journey': 'Nossa Jornada',
    'project-launch': '2022 - Lançamento do Projeto',
    'launch-description': 'A Green Earth Connect foi estabelecida com a visão de criar um mapa ecológico interativo para promover a conscientização ambiental.',
    'launch-milestone': 'Marco: Desenvolvimento inicial do mapa com 50 pontos ecológicos',
    'community-expansion': '2023 - Expansão da Comunidade',
    'expansion-description': 'Expandimos nossa plataforma para incluir contribuições da comunidade e lançamos parcerias com organizações ambientais locais.',
    'expansion-milestone': 'Marco: Alcançamos mais de 150 pontos ecológicos e mais de 1.000 membros da comunidade',
    'data-driven': '2024 - Impacto Baseado em Dados',
    'data-description': 'Implementamos rastreamento de impacto para medir a contribuição ambiental coletiva das iniciativas mapeadas.',
    'data-milestone': 'Marco: Recursos avançados de filtragem e pesquisa adicionados ao mapa ecológico',
    'get-involved': 'Participe',
    'involvement-description': 'Recebemos contribuições de indivíduos e organizações apaixonadas pela sustentabilidade ambiental. Entre em contato para:',
    'submit-points': 'Enviar novos pontos ecológicos para o mapa',
    'partner-initiatives': 'Fazer parceria conosco em iniciativas ambientais',
    'provide-feedback': 'Fornecer feedback sobre a plataforma',
    'volunteer-events': 'Voluntariar-se para eventos comunitários',
    'contact-us': 'Entre em Contato',
    'faq': 'Perguntas Frequentes',
    'faq-add-point': 'Como posso adicionar um ponto ao mapa?',
    'faq-add-answer': 'Entre em contato conosco com detalhes sobre a iniciativa ecológica, incluindo localização, tipo e dados de impacto, se disponíveis.',
    'faq-verified': 'Os dados no mapa são verificados?',
    'faq-verified-answer': 'Sim, nossa equipe verifica todos os pontos ecológicos antes de adicioná-los para garantir precisão e confiabilidade.',
    'faq-updates': 'Com que frequência o mapa é atualizado?',
    'faq-updates-answer': 'Atualizamos o mapa regularmente com novos pontos e atualizamos os dados existentes trimestralmente para manter a precisão.',
    
    // Blog
    'back-home': 'Voltar para Início',
    'blog-title': 'Blog Ecológico',
    'blog-subtitle': 'Artigos e notícias sobre sustentabilidade, conservação e iniciativas locais',
    'featured-articles': 'Artigos em Destaque',
    'all': 'Todos',
    'recycling': 'Reciclagem',
    'reforestation': 'Reflorestamento',
    'recent-articles': 'Artigos Recentes',
    'newsletter': 'Inscreva-se em nossa Newsletter',
    'newsletter-description': 'Receba artigos novos, dicas de sustentabilidade e atualizações sobre iniciativas ecológicas em Presidente Prudente diretamente em seu email.',
    'your-email': 'Seu email',
    'subscribe': 'Inscrever-se',
    'min-read': 'min de leitura',
    'read-more': 'Ler mais',
  }
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language] = useState<Language>('pt');

  const translate = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, t: translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
