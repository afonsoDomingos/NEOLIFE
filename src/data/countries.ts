import { Country } from '@/types';

export const countries: Country[] = [

  // ── ÁFRICA — Southern Africa ──────────────────────────────────────────────
  {
    id: 'mz',
    name: 'Moçambique',
    code: 'MZ',
    available: true,
    flag: '🇲🇿',
    dialCode: '+258',
    region: 'África',
  },
  {
    id: 'za',
    name: 'África do Sul',
    code: 'ZA',
    available: true,
    flag: '🇿🇦',
    dialCode: '+27',
    region: 'África',
  },
  {
    id: 'ao',
    name: 'Angola',
    code: 'AO',
    available: true,
    flag: '🇦🇴',
    dialCode: '+244',
    region: 'África',
  },
  {
    id: 'zw',
    name: 'Zimbabwe',
    code: 'ZW',
    available: true,
    flag: '🇿🇼',
    dialCode: '+263',
    region: 'África',
  },
  {
    id: 'bw',
    name: 'Botswana',
    code: 'BW',
    available: false,
    flag: '🇧🇼',
    dialCode: '+267',
    region: 'África',
  },
  {
    id: 'ls',
    name: 'Lesoto',
    code: 'LS',
    available: false,
    flag: '🇱🇸',
    dialCode: '+266',
    region: 'África',
  },
  {
    id: 'na',
    name: 'Namíbia',
    code: 'NA',
    available: false,
    flag: '🇳🇦',
    dialCode: '+264',
    region: 'África',
  },
  {
    id: 'sz',
    name: 'Eswatini',
    code: 'SZ',
    available: false,
    flag: '🇸🇿',
    dialCode: '+268',
    region: 'África',
  },

  // ── ÁFRICA — East Africa ──────────────────────────────────────────────────
  {
    id: 'ke',
    name: 'Quénia',
    code: 'KE',
    available: false,
    flag: '🇰🇪',
    dialCode: '+254',
    region: 'África',
  },
  {
    id: 'tz',
    name: 'Tanzânia',
    code: 'TZ',
    available: false,
    flag: '🇹🇿',
    dialCode: '+255',
    region: 'África',
  },
  {
    id: 'ug',
    name: 'Uganda',
    code: 'UG',
    available: false,
    flag: '🇺🇬',
    dialCode: '+256',
    region: 'África',
  },

  // ── ÁFRICA — West Africa ──────────────────────────────────────────────────
  {
    id: 'bj',
    name: 'Benin',
    code: 'BJ',
    available: false,
    flag: '🇧🇯',
    dialCode: '+229',
    region: 'África',
  },
  {
    id: 'cm',
    name: 'Camarões',
    code: 'CM',
    available: false,
    flag: '🇨🇲',
    dialCode: '+237',
    region: 'África',
  },
  {
    id: 'gh',
    name: 'Gana',
    code: 'GH',
    available: false,
    flag: '🇬🇭',
    dialCode: '+233',
    region: 'África',
  },
  {
    id: 'ci',
    name: 'Costa do Marfim',
    code: 'CI',
    available: false,
    flag: '🇨🇮',
    dialCode: '+225',
    region: 'África',
  },
  {
    id: 'ng',
    name: 'Nigéria',
    code: 'NG',
    available: false,
    flag: '🇳🇬',
    dialCode: '+234',
    region: 'África',
  },
  {
    id: 'tg',
    name: 'Togo',
    code: 'TG',
    available: false,
    flag: '🇹🇬',
    dialCode: '+228',
    region: 'África',
  },

  // ── AMÉRICAS ──────────────────────────────────────────────────────────────
  {
    id: 'us',
    name: 'Estados Unidos',
    code: 'US',
    available: false,
    flag: '🇺🇸',
    dialCode: '+1',
    region: 'Américas',
  },
  {
    id: 'ca',
    name: 'Canadá',
    code: 'CA',
    available: false,
    flag: '🇨🇦',
    dialCode: '+1',
    region: 'Américas',
  },
  {
    id: 'la',
    name: 'América Latina',
    code: 'LA',
    available: false,
    flag: '🌎',
    dialCode: undefined,
    region: 'Américas',
  },

  // ── ÁSIA & PACÍFICO ───────────────────────────────────────────────────────
  {
    id: 'ph',
    name: 'Filipinas',
    code: 'PH',
    available: false,
    flag: '🇵🇭',
    dialCode: '+63',
    region: 'Ásia & Pacífico',
  },
  {
    id: 'sg',
    name: 'Singapura',
    code: 'SG',
    available: false,
    flag: '🇸🇬',
    dialCode: '+65',
    region: 'Ásia & Pacífico',
  },
  {
    id: 'jp',
    name: 'Japão',
    code: 'JP',
    available: false,
    flag: '🇯🇵',
    dialCode: '+81',
    region: 'Ásia & Pacífico',
  },
  {
    id: 'au',
    name: 'Austrália',
    code: 'AU',
    available: false,
    flag: '🇦🇺',
    dialCode: '+61',
    region: 'Ásia & Pacífico',
  },
  {
    id: 'nz',
    name: 'Nova Zelândia',
    code: 'NZ',
    available: false,
    flag: '🇳🇿',
    dialCode: '+64',
    region: 'Ásia & Pacífico',
  },

  // ── EUROPA — Norte ────────────────────────────────────────────────────────
  {
    id: 'gb',
    name: 'Reino Unido',
    code: 'GB',
    available: false,
    flag: '🇬🇧',
    dialCode: '+44',
    region: 'Europa',
  },
  {
    id: 'ee',
    name: 'Estónia',
    code: 'EE',
    available: false,
    flag: '🇪🇪',
    dialCode: '+372',
    region: 'Europa',
  },
  {
    id: 'dk',
    name: 'Dinamarca',
    code: 'DK',
    available: false,
    flag: '🇩🇰',
    dialCode: '+45',
    region: 'Europa',
  },
  {
    id: 'fi',
    name: 'Finlândia',
    code: 'FI',
    available: false,
    flag: '🇫🇮',
    dialCode: '+358',
    region: 'Europa',
  },
  {
    id: 'is',
    name: 'Islândia',
    code: 'IS',
    available: false,
    flag: '🇮🇸',
    dialCode: '+354',
    region: 'Europa',
  },
  {
    id: 'ie',
    name: 'Irlanda',
    code: 'IE',
    available: false,
    flag: '🇮🇪',
    dialCode: '+353',
    region: 'Europa',
  },
  {
    id: 'lv',
    name: 'Letónia',
    code: 'LV',
    available: false,
    flag: '🇱🇻',
    dialCode: '+371',
    region: 'Europa',
  },
  {
    id: 'lt',
    name: 'Lituânia',
    code: 'LT',
    available: false,
    flag: '🇱🇹',
    dialCode: '+370',
    region: 'Europa',
  },
  {
    id: 'no',
    name: 'Noruega',
    code: 'NO',
    available: false,
    flag: '🇳🇴',
    dialCode: '+47',
    region: 'Europa',
  },
  {
    id: 'pl',
    name: 'Polónia',
    code: 'PL',
    available: false,
    flag: '🇵🇱',
    dialCode: '+48',
    region: 'Europa',
  },
  {
    id: 'se',
    name: 'Suécia',
    code: 'SE',
    available: false,
    flag: '🇸🇪',
    dialCode: '+46',
    region: 'Europa',
  },

  // ── EUROPA — Sul ──────────────────────────────────────────────────────────
  {
    id: 'ba',
    name: 'Bósnia-Herzegovina',
    code: 'BA',
    available: false,
    flag: '🇧🇦',
    dialCode: '+387',
    region: 'Europa',
  },
  {
    id: 'hr',
    name: 'Croácia',
    code: 'HR',
    available: false,
    flag: '🇭🇷',
    dialCode: '+385',
    region: 'Europa',
  },
  {
    id: 'hu',
    name: 'Hungria',
    code: 'HU',
    available: false,
    flag: '🇭🇺',
    dialCode: '+36',
    region: 'Europa',
  },
  {
    id: 'it',
    name: 'Itália',
    code: 'IT',
    available: false,
    flag: '🇮🇹',
    dialCode: '+39',
    region: 'Europa',
  },
  {
    id: 'ro',
    name: 'Roménia',
    code: 'RO',
    available: false,
    flag: '🇷🇴',
    dialCode: '+40',
    region: 'Europa',
  },
  {
    id: 'si',
    name: 'Eslovénia',
    code: 'SI',
    available: false,
    flag: '🇸🇮',
    dialCode: '+386',
    region: 'Europa',
  },

  // ── EUROPA — Outros ───────────────────────────────────────────────────────
  {
    id: 'at',
    name: 'Áustria',
    code: 'AT',
    available: false,
    flag: '🇦🇹',
    dialCode: '+43',
    region: 'Europa',
  },
  {
    id: 'cy',
    name: 'Chipre',
    code: 'CY',
    available: false,
    flag: '🇨🇾',
    dialCode: '+357',
    region: 'Europa',
  },
  {
    id: 'fr',
    name: 'França',
    code: 'FR',
    available: false,
    flag: '🇫🇷',
    dialCode: '+33',
    region: 'Europa',
  },
  {
    id: 'de',
    name: 'Alemanha',
    code: 'DE',
    available: false,
    flag: '🇩🇪',
    dialCode: '+49',
    region: 'Europa',
  },
  {
    id: 'mt',
    name: 'Malta',
    code: 'MT',
    available: false,
    flag: '🇲🇹',
    dialCode: '+356',
    region: 'Europa',
  },
  {
    id: 'nl',
    name: 'Países Baixos',
    code: 'NL',
    available: false,
    flag: '🇳🇱',
    dialCode: '+31',
    region: 'Europa',
  },
  {
    id: 'es',
    name: 'Espanha',
    code: 'ES',
    available: false,
    flag: '🇪🇸',
    dialCode: '+34',
    region: 'Europa',
  },
  {
    id: 'ch',
    name: 'Suíça',
    code: 'CH',
    available: false,
    flag: '🇨🇭',
    dialCode: '+41',
    region: 'Europa',
  },
];


export const getAvailableCountries = (): Country[] => {
  return countries.filter(country => country.available);
};

export const getCountryById = (id: string): Country | undefined => {
  return countries.find(country => country.id === id);
};

export const getCountryByCode = (code: string): Country | undefined => {
  return countries.find(country => country.code === code);
};

/**
 * Returns the allowed dial codes for phone number validation.
 * Only countries with available: true are included.
 */
export const getAllowedDialCodes = (): string[] => {
  return countries
    .filter(c => c.available && c.dialCode)
    .map(c => c.dialCode as string);
};

/**
 * Returns countries grouped by region.
 * Example: { 'África': [...], 'Europa': [...], 'Américas': [...] }
 */
export const getCountriesByRegion = (): Record<string, Country[]> => {
  return countries.reduce((acc, country) => {
    const region = country.region || 'Outros';
    if (!acc[region]) acc[region] = [];
    acc[region].push(country);
    return acc;
  }, {} as Record<string, Country[]>);
};

/** Order in which regions should appear in dropdowns */
export const REGION_ORDER = ['África', 'Américas', 'Ásia & Pacífico', 'Europa'];