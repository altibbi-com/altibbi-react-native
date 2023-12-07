export type MediumType = 'chat' | 'gsm' | 'voip' | 'video';
export type BloodType = 'A+' | 'B+' | 'AB+' | 'O+' | 'A-' | 'B-' | 'AB-' | 'O-';
export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widow';
export type BoolString = 'yes' | 'no';
export type GenderType = 'male' | 'female';
export interface UserType {
  name?: string;
  phoneNumber?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: GenderType;
  insuranceId?: string;
  policyNumber?: string;
  nationalityNumber?: string;
  height?: string;
  weight?: string;
  bloodType?: BloodType;
  smoker?: BoolString;
  alcoholic?: BoolString;
  maritalStatus?: MaritalStatus;
}

