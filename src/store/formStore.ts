import { create } from 'zustand';
import { FormSubmission } from '../types';

const COUNTRIES = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Argentina',
  'Australia',
  'Austria',
  'Belgium',
  'Brazil',
  'Canada',
  'Chile',
  'China',
  'Colombia',
  'Croatia',
  'Czech Republic',
  'Denmark',
  'Egypt',
  'Finland',
  'France',
  'Germany',
  'Greece',
  'Hungary',
  'India',
  'Indonesia',
  'Iran',
  'Ireland',
  'Israel',
  'Italy',
  'Japan',
  'Jordan',
  'Kenya',
  'Malaysia',
  'Mexico',
  'Morocco',
  'Netherlands',
  'New Zealand',
  'Nigeria',
  'Norway',
  'Pakistan',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Romania',
  'Russia',
  'Saudi Arabia',
  'South Africa',
  'South Korea',
  'Spain',
  'Sweden',
  'Switzerland',
  'Thailand',
  'Turkey',
  'Ukraine',
  'United Kingdom',
  'United States',
  'Vietnam',
];

interface FormState {
  submissions: FormSubmission[];
  countries: string[];
  addSubmission: (
    data: Omit<FormSubmission, 'id' | 'submittedAt'>
  ) => void;
}

export const useFormStore = create<FormState>((set) => ({
  submissions: [],
  countries: COUNTRIES,
  addSubmission: (data) =>
    set((state) => ({
      submissions: [
        ...state.submissions,
        { ...data, id: crypto.randomUUID(), submittedAt: Date.now() },
      ],
    })),
}));
