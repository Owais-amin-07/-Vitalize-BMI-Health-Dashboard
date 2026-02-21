
export interface BMIRecord {
  id?: number;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  height: number;
  weight: number;
  bmi: number;
  category: string;
  created_at?: string;
}

export type BMICategory = 'Underweight' | 'Normal' | 'Overweight' | 'Obese';

export interface BMIResult {
  value: number;
  category: BMICategory;
  color: string;
  tip: string;
  idealRange: { min: number; max: number };
}
