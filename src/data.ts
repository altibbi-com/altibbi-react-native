import type {
  BloodType,
  BoolString,
  GenderType,
  MaritalStatus,
  MediumType,
} from './types';

export const materialStatusArray: MaritalStatus[] = [
  'single',
  'married',
  'divorced',
  'widow',
];
export const bloodTypeArray: BloodType[] = [
  'A+',
  'B+',
  'AB+',
  'O+',
  'A-',
  'B-',
  'AB-',
  'O-',
];
export const boolStringArray: BoolString[] = ['yes', 'no'];
export const genderTypeArray: GenderType[] = ['male', 'female'];
export const MediumArray: MediumType[] = ['chat', 'gsm', 'voip', 'video'];

export const relationTypeArray: string[] = [
  'personal',
  'father',
  'mother',
  'sister',
  'brother',
  'child',
  'husband',
  'wife',
  'other',
];
