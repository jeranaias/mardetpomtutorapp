export const languages = [
  {
    code: 'ara',
    name: 'Arabic',
    nativeName: 'العربية',
    flag: '🇸🇦',
    category: 'Middle East',
    difficulty: 'Category IV',
    description: 'Modern Standard Arabic (MSA) with focus on military and intelligence applications',
    resources: {
      vocab: true,
      grammar: true,
      listening: true,
      reading: true,
      speaking: true
    },
    tutorCount: 8
  },
  {
    code: 'rus',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    category: 'Eastern Europe',
    difficulty: 'Category III',
    description: 'Modern Russian with emphasis on military terminology and geopolitical contexts',
    resources: {
      vocab: true,
      grammar: true,
      listening: true,
      reading: true,
      speaking: true
    },
    tutorCount: 6
  },
  {
    code: 'cmn',
    name: 'Chinese (Mandarin)',
    nativeName: '中文',
    flag: '🇨🇳',
    category: 'East Asia',
    difficulty: 'Category IV',
    description: 'Mandarin Chinese with simplified characters for intelligence and diplomatic use',
    resources: {
      vocab: true,
      grammar: true,
      listening: true,
      reading: true,
      speaking: true
    },
    tutorCount: 7
  },
  {
    code: 'kor',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    category: 'East Asia',
    difficulty: 'Category IV',
    description: 'Modern Korean for military and intelligence operations',
    resources: {
      vocab: true,
      grammar: true,
      listening: true,
      reading: true,
      speaking: true
    },
    tutorCount: 5
  },
  {
    code: 'fas',
    name: 'Farsi (Persian)',
    nativeName: 'فارسی',
    flag: '🇮🇷',
    category: 'Middle East',
    difficulty: 'Category III',
    description: 'Modern Persian with military and diplomatic applications',
    resources: {
      vocab: true,
      grammar: true,
      listening: true,
      reading: true,
      speaking: true
    },
    tutorCount: 4
  },
  {
    code: 'spa',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    category: 'Romance',
    difficulty: 'Category I',
    description: 'Latin American Spanish for regional operations and intelligence',
    resources: {
      vocab: true,
      grammar: true,
      listening: true,
      reading: true,
      speaking: true
    },
    tutorCount: 3
  },
  {
    code: 'fra',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    category: 'Romance',
    difficulty: 'Category I',
    description: 'Modern French for international operations and NATO contexts',
    resources: {
      vocab: true,
      grammar: true,
      listening: true,
      reading: true,
      speaking: true
    },
    tutorCount: 2
  },
  {
    code: 'ind',
    name: 'Indonesian',
    nativeName: 'Bahasa Indonesia',
    flag: '🇮🇩',
    category: 'Southeast Asia',
    difficulty: 'Category III',
    description: 'Modern Indonesian for regional military and intelligence operations',
    resources: {
      vocab: true,
      grammar: true,
      listening: true,
      reading: true,
      speaking: true
    },
    tutorCount: 2
  },
  {
    code: 'jpn',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    category: 'East Asia',
    difficulty: 'Category IV',
    description: 'Modern Japanese for defense cooperation and intelligence',
    resources: {
      vocab: true,
      grammar: true,
      listening: true,
      reading: true,
      speaking: true
    },
    tutorCount: 4
  }
]

export const difficultyLevels = {
  'Category I': {
    weeks: 26,
    hours: 600,
    description: 'Languages closely related to English'
  },
  'Category III': {
    weeks: 44,
    hours: 1100,
    description: 'Languages with linguistic/cultural differences from English'
  },
  'Category IV': {
    weeks: 64,
    hours: 1600,
    description: 'Languages exceptionally difficult for English speakers'
  }
}

export const categories = {
  'Middle East': ['ara', 'fas'],
  'Eastern Europe': ['rus'],
  'East Asia': ['cmn', 'kor', 'jpn'],
  'Southeast Asia': ['ind'],
  'Romance': ['spa', 'fra']
}
