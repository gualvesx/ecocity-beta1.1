
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
    'hero-title': 'Monitoramento Ambiental em Presidente Prudente',
    'hero-subtitle': 'Acompanhe em tempo real os dados ambientais da nossa cidade',
    'hero-cta': 'Explore os Dados',
    
    // Environment monitoring
    'monitoring-title': 'Monitoramento em Tempo Real',
    'monitoring-subtitle': 'Acompanhe os dados atualizados sobre desmatamento, reflorestamento e qualidade do ar em Presidente Prudente.',
    
    // Stats
    'stats-title': 'Estado Atual do Ambiente',
    'stats-subtitle': 'Dados coletados em tempo real de nossas estações de monitoramento ambiental.',
    'hectares-monitored': 'Hectares Monitorados',
    'risk-areas': 'Áreas de Risco Identificadas',
    'deforestation-alerts': 'Alertas de Desmatamento este Mês',
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
    'hero-title': 'Environmental Monitoring in Presidente Prudente',
    'hero-subtitle': 'Follow real-time environmental data of our city',
    'hero-cta': 'Explore Data',
    
    // Environment monitoring
    'monitoring-title': 'Real-Time Monitoring',
    'monitoring-subtitle': 'Track updated data on deforestation, reforestation, and air quality in Presidente Prudente.',
    
    // Stats
    'stats-title': 'Current Environment Status',
    'stats-subtitle': 'Data collected in real-time from our environmental monitoring stations.',
    'hectares-monitored': 'Hectares Monitored',
    'risk-areas': 'Risk Areas Identified',
    'deforestation-alerts': 'Deforestation Alerts This Month',
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
    'hero-title': '普雷西登特普鲁登特的环境监测',
    'hero-subtitle': '实时关注我们城市的环境数据',
    'hero-cta': '探索数据',
    
    // Environment monitoring
    'monitoring-title': '实时监测',
    'monitoring-subtitle': '跟踪普雷西登特普鲁登特市的森林砍伐、再造林和空气质量的最新数据。',
    
    // Stats
    'stats-title': '当前环境状态',
    'stats-subtitle': '从我们的环境监测站实时收集的数据。',
    'hectares-monitored': '监测公顷数',
    'risk-areas': '已识别风险区域',
    'deforestation-alerts': '本月森林砍伐警报',
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
