
import { BMICategory } from './types';

export const CATEGORIES: Record<BMICategory, { color: string; tip: string; shadow: string }> = {
  Underweight: {
    color: 'text-blue-400',
    shadow: 'shadow-blue-500/50',
    tip: 'Focus on a nutrient-rich diet with healthy fats and proteins to reach a balanced weight.'
  },
  Normal: {
    color: 'text-green-400',
    shadow: 'shadow-green-500/50',
    tip: 'Great job! Maintain your current lifestyle with balanced meals and regular activity.'
  },
  Overweight: {
    color: 'text-yellow-400',
    shadow: 'shadow-yellow-500/50',
    tip: 'Incorporate more physical activity and monitor calorie intake for a healthier balance.'
  },
  Obese: {
    color: 'text-red-500',
    shadow: 'shadow-red-500/50',
    tip: 'Consider consulting a healthcare professional for a tailored nutrition and exercise plan.'
  }
};
