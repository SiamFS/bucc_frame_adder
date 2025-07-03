// Theme Configuration for BUCC Frame Editor
// Easily modify these values to customize the entire application

export const themeConfig = {
  // Primary Brand Colors (BUCC Blue)
  primary: {
    50: '#eff6ff',
    100: '#dbeafe', 
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#1e40af', // BUCC Primary Blue
    600: '#1d4ed8',
    700: '#1e3a8a',
    800: '#1e293b',
    900: '#0f172a',
  },

  // Secondary Brand Colors (BUCC Orange/Red)
  secondary: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca', 
    300: '#fca5a5',
    400: '#f87171',
    500: '#dc2626', // BUCC Secondary Red
    600: '#b91c1c',
    700: '#991b1b',
    800: '#7f1d1d',
    900: '#450a0a',
  },

  // Accent Colors
  accent: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc', 
    400: '#38bdf8',
    500: '#0ea5e9', // Light Blue
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },

  // Neutral Colors
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },

  // Success, Warning, Error Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },

  // Dark Mode Colors
  dark: {
    bg: {
      primary: '#0f172a',
      secondary: '#1e293b',
      tertiary: '#334155',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#e2e8f0',
      tertiary: '#cbd5e1',
    },
    border: {
      primary: '#334155',
      secondary: '#475569',
    }
  },

  // Typography
  typography: {
    fontFamily: {
      primary: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      heading: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      mono: ['JetBrains Mono', 'Monaco', 'Cascadia Code', 'Segoe UI Mono', 'Roboto Mono', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem', 
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
      '7xl': '4.5rem',
    }
  },

  // Animation Settings
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    easing: {
      default: 'cubic-bezier(0.4, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    }
  },

  // Layout
  layout: {
    borderRadius: {
      sm: '0.375rem',
      md: '0.5rem', 
      lg: '0.75rem',
      xl: '1rem',
      '2xl': '1.5rem',
      '3xl': '2rem',
    },
    spacing: {
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '3rem',
      '2xl': '4rem',
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    }
  }
};

// Organization Information
export const organizationConfig = {
  name: 'BRAC University Computer Club',
  shortName: 'BUCC',
  description: 'Empowering the next generation of tech innovators at BRAC University',
  mission: 'To foster technological excellence, innovation, and collaborative learning among students',
  
  // Contact Information
  contact: {
    email: 'info@bracucc.org',
    website: 'https://bracucc.org',
    facebook: 'https://facebook.com/bracucc',
    linkedin: 'https://linkedin.com/company/brac-university-computer-club',
    github: 'https://github.com/bracucc',
  },

  // Club Activities
  activities: [
    'Programming Workshops',
    'Tech Talks & Seminars', 
    'Hackathons & Competitions',
    'Open Source Contributions',
    'Industry Networking Events',
    'Skill Development Programs'
  ],

  // Club Values
  values: [
    'Innovation',
    'Collaboration', 
    'Excellence',
    'Inclusivity',
    'Continuous Learning'
  ],

  // Logo Paths
  logos: {
    icon: '/src/assets/BUCC_Logo_icon.svg',
    full: '/src/assets/BUCC_Logo.svg',
  }
};

// Application Configuration
export const appConfig = {
  name: 'BUCC Frame Editor',
  version: '2.0.0',
  description: 'Professional photo frame overlay tool by BRAC University Computer Club',
  author: 'BRAC University Computer Club',
  
  // Feature Flags
  features: {
    darkMode: true,
    analytics: false,
    notifications: true,
    advancedMode: true,
    multiLanguage: false,
  },

  // Performance Settings
  performance: {
    maxFileSize: 50 * 1024 * 1024, // 50MB
    canvasOptimization: true,
    webWorkers: true,
    lazyLoading: true,
  }
};

export default { themeConfig, organizationConfig, appConfig };