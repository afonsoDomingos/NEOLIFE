import { Country } from '@/types';

export const countries: Country[] = [
  {
    id: 'mz',
    name: 'Moçambique',
    code: 'MZ',
    available: true,
    flag: '🇲🇿',
    dialCode: '+258',
  },
  {
    id: 'za',
    name: 'África do Sul',
    code: 'ZA',
    available: true,
    flag: '🇿🇦',
    dialCode: '+27',
  },
  {
    id: 'ao',
    name: 'Angola',
    code: 'AO',
    available: true,
    flag: '🇦🇴',
    dialCode: '+244',
  },
  {
    id: 'zw',
    name: 'Zimbabwe',
    code: 'ZW',
    available: true,
    flag: '🇿🇼',
    dialCode: '+263',
  },
  {
    id: 'mw',
    name: 'Malawi',
    code: 'MW',
    available: false,
    flag: '🇲🇼',
    dialCode: '+265',
  },
  {
    id: 'zm',
    name: 'Zâmbia',
    code: 'ZM',
    available: false,
    flag: '🇿🇲',
    dialCode: '+260',
  },
  {
    id: 'tz',
    name: 'Tanzânia',
    code: 'TZ',
    available: false,
    flag: '🇹🇿',
    dialCode: '+255',
  },
  {
    id: 'ke',
    name: 'Quénia',
    code: 'KE',
    available: false,
    flag: '🇰🇪',
    dialCode: '+254',
  },
  {
    id: 'ug',
    name: 'Uganda',
    code: 'UG',
    available: false,
    flag: '🇺🇬',
    dialCode: '+256',
  },
  {
    id: 'ng',
    name: 'Nigéria',
    code: 'NG',
    available: false,
    flag: '🇳🇬',
    dialCode: '+234',
  },
  {
    id: 'gh',
    name: 'Gana',
    code: 'GH',
    available: false,
    flag: '🇬🇭',
    dialCode: '+233',
  },
  {
    id: 'bw',
    name: 'Botswana',
    code: 'BW',
    available: false,
    flag: '🇧🇼',
    dialCode: '+267',
  },
  {
    id: 'na',
    name: 'Namíbia',
    code: 'NA',
    available: false,
    flag: '🇳🇦',
    dialCode: '+264',
  },
  {
    id: 'et',
    name: 'Etiópia',
    code: 'ET',
    available: false,
    flag: '🇪🇹',
    dialCode: '+251',
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