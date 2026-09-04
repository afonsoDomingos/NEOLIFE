import { Country } from '@/types';

export const countries: Country[] = [
  {
    id: 'mz',
    name: 'Moçambique',
    code: 'MZ',
    available: true,
    flag: '🇲🇿'
  },
  {
    id: 'za',
    name: 'África do Sul',
    code: 'ZA',
    available: true,
    flag: '🇿🇦'
  },
  {
    id: 'ao',
    name: 'Angola',
    code: 'AO',
    available: true,
    flag: '🇦🇴'
  },
  {
    id: 'zw',
    name: 'Zimbabwe',
    code: 'ZW',
    available: true,
    flag: '🇿🇼'
  },
  {
    id: 'mw',
    name: 'Malawi',
    code: 'MW',
    available: false,
    flag: '🇲🇼'
  },
  {
    id: 'zm',
    name: 'Zâmbia',
    code: 'ZM',
    available: false,
    flag: '🇿🇲'
  },
  {
    id: 'tz',
    name: 'Tanzânia',
    code: 'TZ',
    available: false,
    flag: '🇹🇿'
  },
  {
    id: 'ke',
    name: 'Quénia',
    code: 'KE',
    available: false,
    flag: '🇰🇪'
  },
  {
    id: 'ug',
    name: 'Uganda',
    code: 'UG',
    available: false,
    flag: '🇺🇬'
  },
  {
    id: 'ng',
    name: 'Nigéria',
    code: 'NG',
    available: false,
    flag: '🇳🇬'
  },
  {
    id: 'gh',
    name: 'Gana',
    code: 'GH',
    available: false,
    flag: '🇬🇭'
  },
  {
    id: 'bw',
    name: 'Botswana',
    code: 'BW',
    available: false,
    flag: '🇧🇼'
  },
  {
    id: 'na',
    name: 'Namíbia',
    code: 'NA',
    available: false,
    flag: '🇳🇦'
  },
  {
    id: 'et',
    name: 'Etiópia',
    code: 'ET',
    available: false,
    flag: '🇪🇹'
  }
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