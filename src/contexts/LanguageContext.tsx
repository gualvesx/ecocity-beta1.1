
import React, { createContext, useContext, useState } from 'react';

export type Language = 'pt' | 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
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
    'monitoring-subtitle-info': 'Acompanhe os dados atualizados sobre desmatamento, reflorestamento e qualidade do ar em Presidente Prudente.',
    
    // Stats
    'stats-title': 'Impacto Ambiental',
    'stats-subtitle': 'Dados coletados de fontes oficiais sobre a situação ambiental da região.',
    'hectares-monitored': 'Hectares de Vegetação',
    'risk-areas': 'Áreas de Risco Identificadas',
    'deforestation-alerts': 'Alertas de Desmatamento',
    'air-quality': 'Índice de Qualidade do Ar',
    
    // Chart labels
    'deforested-area': 'Área Desmatada (hectares)',
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
    
    // Language
    'language': 'Idioma',
    'portuguese': 'Português',
    'english': 'Inglês',
    'chinese': 'Chinês',
    
    // Interactive Section
    'monitoring-systems': 'Informações Ecológicas',
    'monitoring-subtitle': 'Conheça os dados e informações sobre a ecologia em Presidente Prudente',
    'monitoring-system': 'Sistema de Informação',
    'view-realtime-data': 'Visualizar dados',
    
    // Environmental themes
    'deforestation': 'Desmatamento',
    'urban-pollution': 'Poluição Urbana',
    'water-resources': 'Recursos Hídricos',
    'renewable-energy': 'Energia Renovável',
    'deforestation-description': 'O desmatamento é um dos maiores desafios ambientais da nossa região. Através do nosso mapa ecológico, identificamos áreas críticas e promovemos iniciativas de reflorestamento.',
    'pollution-description': 'A poluição urbana afeta a qualidade de vida na cidade. Nosso blog traz informações sobre como reduzir a emissão de poluentes e melhorar o ambiente urbano.',
    'water-description': 'A preservação dos recursos hídricos é fundamental para o equilíbrio ecológico. Mapeamos os principais corpos d\'água da região e seu estado de conservação.',
    'energy-description': 'Promovemos o uso de energias renováveis como alternativa sustentável para o desenvolvimento urbano e rural da região.',
    'deforestation-monitoring': 'Acompanhamento de áreas verdes e desmatamento por imagens de satélite e verificações locais.',
    'pollution-monitoring': 'Análise de dados de qualidade do ar e identificação de fontes de poluição urbana.',
    'water-monitoring': 'Avaliação da qualidade e quantidade de recursos hídricos na região.',
    'energy-monitoring': 'Monitoramento da adoção de fontes renováveis de energia e seu impacto ambiental positivo.',
    
    // Last updated
    'last-updated': 'Última atualização',
    'data-source': 'Fonte de dados',
    
    // Error messages 
    'error-loading-data': 'Erro ao carregar dados',
  },
  en: {
    // Navbar
    'inicio': 'Home',
    'mapa': 'Ecological Map',
    'blog': 'Blog',
    'sobre': 'About Us',
    'entrar': 'Login',
    'cadastrar': 'Register',
    'sair': 'Logout',
    'ola': 'Hello',
    'admin': 'Admin',
    'painel-admin': 'Admin Panel',
    
    // Hero section
    'hero-title': 'Ecology in Presidente Prudente',
    'hero-subtitle': 'Follow ecological data and environmental initiatives in our city',
    'hero-cta': 'Explore Data',
    
    // Environment monitoring
    'monitoring-title': 'Ecological Initiatives',
    'monitoring-subtitle-info': 'Track updated data on deforestation, reforestation, and air quality in Presidente Prudente.',
    
    // Stats
    'stats-title': 'Environmental Impact',
    'stats-subtitle': 'Data collected from official sources about the environmental situation in the region.',
    'hectares-monitored': 'Vegetation Hectares',
    'risk-areas': 'Risk Areas Identified',
    'deforestation-alerts': 'Deforestation Alerts',
    'air-quality': 'Air Quality Index',
    
    // Chart labels
    'deforested-area': 'Deforested Area (hectares)',
    'reforested-area': 'Reforested Area (hectares)',
    'air-quality-index': 'Air Quality (index)',
    
    // Months
    'jan': 'Jan',
    'feb': 'Feb',
    'mar': 'Mar',
    'apr': 'Apr',
    'may': 'May',
    'jun': 'Jun',
    'jul': 'Jul',
    'aug': 'Aug',
    'sep': 'Sep',
    'oct': 'Oct',
    'nov': 'Nov',
    'dec': 'Dec',
    
    // Theme
    'dark-mode': 'Dark Mode',
    'light-mode': 'Light Mode',
    
    // Language
    'language': 'Language',
    'portuguese': 'Portuguese',
    'english': 'English',
    'chinese': 'Chinese',
    
    // Interactive Section
    'monitoring-systems': 'Ecological Information',
    'monitoring-subtitle': 'Learn about ecological data and information in Presidente Prudente',
    'monitoring-system': 'Information System',
    'view-realtime-data': 'View data',
    
    // Environmental themes
    'deforestation': 'Deforestation',
    'urban-pollution': 'Urban Pollution',
    'water-resources': 'Water Resources',
    'renewable-energy': 'Renewable Energy',
    'deforestation-description': 'Deforestation is one of the biggest environmental challenges in our region. Through our ecological map, we identify critical areas and promote reforestation initiatives.',
    'pollution-description': 'Urban pollution affects quality of life in the city. Our blog provides information on how to reduce pollutant emissions and improve the urban environment.',
    'water-description': 'The preservation of water resources is fundamental for ecological balance. We map the main water bodies in the region and their conservation status.',
    'energy-description': 'We promote the use of renewable energy as a sustainable alternative for urban and rural development in the region.',
    'deforestation-monitoring': 'Monitoring of green areas and deforestation through satellite images and local verifications.',
    'pollution-monitoring': 'Analysis of air quality data and identification of urban pollution sources.',
    'water-monitoring': 'Assessment of water quality and quantity in the region.',
    'energy-monitoring': 'Monitoring the adoption of renewable energy sources and their positive environmental impact.',
    
    // Last updated
    'last-updated': 'Last updated',
    'data-source': 'Data source',
    
    // Error messages
    'error-loading-data': 'Error loading data',
  },
  zh: {
    // Navbar
    'inicio': '首页',
    'mapa': '生态地图',
    'blog': '博客',
    'sobre': '关于我们',
    'entrar': '登录',
    'cadastrar': '注册',
    'sair': '登出',
    'ola': '你好',
    'admin': '管理员',
    'painel-admin': '管理面板',
    
    // Hero section
    'hero-title': '普雷西登特普鲁登特的生态环境',
    'hero-subtitle': '关注我们城市的生态数据和环保举措',
    'hero-cta': '探索数据',
    
    // Environment monitoring
    'monitoring-title': '生态倡议',
    'monitoring-subtitle-info': '跟踪普雷西登特普鲁登特市的森林砍伐、再造林和空气质量的最新数据。',
    
    // Stats
    'stats-title': '环境影响',
    'stats-subtitle': '从官方来源收集的有关该地区环境状况的数据。',
    'hectares-monitored': '植被公顷数',
    'risk-areas': '已识别风险区域',
    'deforestation-alerts': '森林砍伐警报',
    'air-quality': '空气质量指数',
    
    // Chart labels
    'deforested-area': '森林砍伐区域（公顷）',
    'reforested-area': '再造林区域（公顷）',
    'air-quality-index': '空气质量（指数）',
    
    // Months
    'jan': '一月',
    'feb': '二月',
    'mar': '三月',
    'apr': '四月',
    'may': '五月',
    'jun': '六月',
    'jul': '七月',
    'aug': '八月',
    'sep': '九月',
    'oct': '十月',
    'nov': '十一月',
    'dec': '十二月',
    
    // Theme
    'dark-mode': '夜间模式',
    'light-mode': '日间模式',
    
    // Language
    'language': '语言',
    'portuguese': '葡萄牙语',
    'english': '英语',
    'chinese': '中文',
    
    // Interactive Section
    'monitoring-systems': '生态信息',
    'monitoring-subtitle': '了解普雷西登特普鲁登特的生态数据和信息',
    'monitoring-system': '信息系统',
    'view-realtime-data': '查看数据',
    
    // Environmental themes
    'deforestation': '森林砍伐',
    'urban-pollution': '城市污染',
    'water-resources': '水资源',
    'renewable-energy': '可再生能源',
    'deforestation-description': '森林砍伐是我们地区最大的环境挑战之一。通过我们的生态地图，我们确定关键区域并促进再造林计划。',
    'pollution-description': '城市污染影响城市的生活质量。我们的博客提供有关如何减少污染物排放和改善城市环境的信息。',
    'water-description': '水资源的保护对生态平衡至关重要。我们绘制该地区主要水体及其保护状况的地图。',
    'energy-description': '我们促进使用可再生能源作为该地区城乡发展的可持续替代方案。',
    'deforestation-monitoring': '通过卫星图像和当地验证监测绿地和森林砍伐。',
    'pollution-monitoring': '分析空气质量数据并识别城市污染源。',
    'water-monitoring': '评估该地区的水质和水量。',
    'energy-monitoring': '监测可再生能源的采用及其积极的环境影响。',
    
    // Last updated
    'last-updated': '最近更新',
    'data-source': '数据来源',
    
    // Error messages
    'error-loading-data': '加载数据时出错',
  }
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language');
    return (savedLanguage as Language) || 'pt';
  });

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const translate = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t: translate }}>
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
