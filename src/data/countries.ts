import { Country } from '@/types';

export const countries: Country[] = [

  // ── AMÉRICA ───────────────────────────────────────────────────────────────
  {
    id: 'us-en',
    name: 'United States (English)',
    code: 'US',
    available: false,
    flag: '🇺🇸',
    dialCode: '+1',
    region: 'América',
    language: 'en',
  },
  {
    id: 'us-es',
    name: 'United States (Español)',
    code: 'US',
    available: false,
    flag: '��',
    dialCode: '+1',
    region: 'América',
    language: 'es',
  },
  {
    id: 'ca-en',
    name: 'Canada (English)',
    code: 'CA',
    available: false,
    flag: '�🇦',
    dialCode: '+1',
    region: 'América',
    language: 'en',
  },
  {
    id: 'ca-fr',
    name: 'Canada (Français)',
    code: 'CA',
    available: false,
    flag: '🇨🇦',
    dialCode: '+1',
    region: 'América',
    language: 'fr',
  },
  {
    id: 'la',
    name: 'Latino Americano',
    code: 'LA',
    available: false,
    flag: '�',
    dialCode: undefined,
    region: 'América',
    language: 'es',
  },

  // ── ÁFRICA — Southern Africa ──────────────────────────────────────────────
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
    name: 'Lesotho',
    code: 'LS',
    available: false,
    flag: '🇱🇸',
    dialCode: '+266',
    region: 'África',
  },
  {
    id: 'mz-en',
    name: 'Mozambique (English)',
    code: 'MZ',
    available: true,
    flag: '🇲🇿',
    dialCode: '+258',
    region: 'África',
    language: 'en',
  },
  {
    id: 'mz-pt',
    name: 'Moçambique (Português)',
    code: 'MZ',
    available: true,
    flag: '🇲🇿',
    dialCode: '+258',
    region: 'África',
    language: 'pt',
  },
  {
    id: 'na',
    name: 'Namibia',
    code: 'NA',
    available: false,
    flag: '🇳🇦',
    dialCode: '+264',
    region: 'África',
  },
  {
    id: 'za',
    name: 'South Africa',
    code: 'ZA',
    available: true,
    flag: '🇿🇦',
    dialCode: '+27',
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
    name: 'Kenya',
    code: 'KE',
    available: false,
    flag: '🇰🇪',
    dialCode: '+254',
    region: 'África',
  },
  {
    id: 'tz',
    name: 'Tanzania',
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
    id: 'bj-en',
    name: 'Benin (English)',
    code: 'BJ',
    available: false,
    flag: '🇧🇯',
    dialCode: '+229',
    region: 'África',
    language: 'en',
  },
  {
    id: 'bj-fr',
    name: 'Bénin (Français)',
    code: 'BJ',
    available: false,
    flag: '��',
    dialCode: '+229',
    region: 'África',
    language: 'fr',
  },
  {
    id: 'cm-en',
    name: 'Cameroon (English)',
    code: 'CM',
    available: false,
    flag: '��',
    dialCode: '+237',
    region: 'África',
    language: 'en',
  },
  {
    id: 'cm-fr',
    name: 'Cameroun (Français)',
    code: 'CM',
    available: false,
    flag: '🇨�',
    dialCode: '+237',
    region: 'África',
    language: 'fr',
  },
  {
    id: 'gh',
    name: 'Ghana',
    code: 'GH',
    available: false,
    flag: '🇭',
    dialCode: '+233',
    region: 'África',
  },
  {
    id: 'ci-fr',
    name: 'Côte d\'Ivoire (Français)',
    code: 'CI',
    available: false,
    flag: '��',
    dialCode: '+225',
    region: 'África',
    language: 'fr',
  },
  {
    id: 'ng',
    name: 'Nigeria',
    code: 'NG',
    available: false,
    flag: '��',
    dialCode: '+234',
    region: 'África',
  },
  {
    id: 'tg-en',
    name: 'Togo (English)',
    code: 'TG',
    available: false,
    flag: '��',
    dialCode: '+228',
    region: 'África',
    language: 'en',
  },
  {
    id: 'tg-fr',
    name: 'Togo (Français)',
    code: 'TG',
    available: false,
    flag: '🇹🇬',
    dialCode: '+228',
    region: 'África',
    language: 'fr',
  },

  // ── ÁSIA & SOUTH PACIFIC ───────────────────────────────────────────────────
  // South-East Asia
  {
    id: 'ph',
    name: 'Philippines',
    code: 'PH',
    available: false,
    flag: '🇵🇭',
    dialCode: '+63',
    region: 'Ásia & Pacífico',
  },
  {
    id: 'sg',
    name: 'Singapore',
    code: 'SG',
    available: false,
    flag: '🇸🇬',
    dialCode: '+65',
    region: 'Ásia & Pacífico',
  },
  // North-East Asia
  {
    id: 'jp',
    name: 'Japan (日本)',
    code: 'JP',
    available: false,
    flag: '🇯🇵',
    dialCode: '+81',
    region: 'Ásia & Pacífico',
  },
  // South Pacific
  {
    id: 'au',
    name: 'Australia',
    code: 'AU',
    available: false,
    flag: '🇦🇺',
    dialCode: '+61',
    region: 'Ásia & Pacífico',
  },
  {
    id: 'nz',
    name: 'New Zealand',
    code: 'NZ',
    available: false,
    flag: '🇳🇿',
    dialCode: '+64',
    region: 'Ásia & Pacífico',
  },

  // ── EUROPA — Northern Europe ───────────────────────────────────────────────
  {
    id: 'ee',
    name: 'Estonia',
    code: 'EE',
    available: false,
    flag: '��',
    dialCode: '+372',
    region: 'Europa',
  },
  {
    id: 'gb',
    name: 'United Kingdom',
    code: 'GB',
    available: false,
    flag: '��',
    dialCode: '+44',
    region: 'Europa',
  },
  {
    id: 'dk',
    name: 'Denmark',
    code: 'DK',
    available: false,
    flag: '🇩🇰',
    dialCode: '+45',
    region: 'Europa',
  },
  {
    id: 'fi',
    name: 'Finland',
    code: 'FI',
    available: false,
    flag: '🇫🇮',
    dialCode: '+358',
    region: 'Europa',
  },
  {
    id: 'is',
    name: 'Iceland',
    code: 'IS',
    available: false,
    flag: '🇮🇸',
    dialCode: '+354',
    region: 'Europa',
  },
  {
    id: 'ie',
    name: 'Ireland',
    code: 'IE',
    available: false,
    flag: '🇮🇪',
    dialCode: '+353',
    region: 'Europa',
  },
  {
    id: 'lv',
    name: 'Latvia',
    code: 'LV',
    available: false,
    flag: '🇱🇻',
    dialCode: '+371',
    region: 'Europa',
  },
  {
    id: 'lt',
    name: 'Lithuania',
    code: 'LT',
    available: false,
    flag: '🇱🇹',
    dialCode: '+370',
    region: 'Europa',
  },
  {
    id: 'no',
    name: 'Norway',
    code: 'NO',
    available: false,
    flag: '🇳🇴',
    dialCode: '+47',
    region: 'Europa',
  },
  {
    id: 'pl',
    name: 'Poland',
    code: 'PL',
    available: false,
    flag: '🇵🇱',
    dialCode: '+48',
    region: 'Europa',
  },
  {
    id: 'se',
    name: 'Sweden',
    code: 'SE',
    available: false,
    flag: '🇸🇪',
    dialCode: '+46',
    region: 'Europa',
  },

  // ── EUROPA — Southern Europe ───────────────────────────────────────────────
  {
    id: 'ba',
    name: 'Bosnia Herzegovina',
    code: 'BA',
    available: false,
    flag: '🇧🇦',
    dialCode: '+387',
    region: 'Europa',
  },
  {
    id: 'hr',
    name: 'Croatia',
    code: 'HR',
    available: false,
    flag: '🇭🇷',
    dialCode: '+385',
    region: 'Europa',
  },
  {
    id: 'hu',
    name: 'Hungary',
    code: 'HU',
    available: false,
    flag: '🇭🇺',
    dialCode: '+36',
    region: 'Europa',
  },
  {
    id: 'it',
    name: 'Italia',
    code: 'IT',
    available: false,
    flag: '🇮🇹',
    dialCode: '+39',
    region: 'Europa',
  },
  {
    id: 'ro',
    name: 'Romania',
    code: 'RO',
    available: false,
    flag: '🇷🇴',
    dialCode: '+40',
    region: 'Europa',
  },
  {
    id: 'si',
    name: 'Slovenia',
    code: 'SI',
    available: false,
    flag: '🇸🇮',
    dialCode: '+386',
    region: 'Europa',
  },

  // ── EUROPA — Other European Countries ─────────────────────────────────────
  {
    id: 'at',
    name: 'Austria',
    code: 'AT',
    available: false,
    flag: '🇦🇹',
    dialCode: '+43',
    region: 'Europa',
  },
  {
    id: 'cy',
    name: 'Cyprus',
    code: 'CY',
    available: false,
    flag: '🇨🇾',
    dialCode: '+357',
    region: 'Europa',
  },
  {
    id: 'fr',
    name: 'France',
    code: 'FR',
    available: false,
    flag: '🇫🇷',
    dialCode: '+33',
    region: 'Europa',
  },
  {
    id: 'de',
    name: 'Germany',
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
    name: 'Netherlands',
    code: 'NL',
    available: false,
    flag: '🇳🇱',
    dialCode: '+31',
    region: 'Europa',
  },
  {
    id: 'es',
    name: 'Spain',
    code: 'ES',
    available: false,
    flag: '🇪🇸',
    dialCode: '+34',
    region: 'Europa',
  },
  {
    id: 'ch',
    name: 'Switzerland',
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
export const REGION_ORDER = ['América', 'África', 'Ásia & Pacífico', 'Europa'];