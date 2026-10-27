export interface RolePreset {
  id: string;
  label: string;
  // Annual salary by currency
  annualSalary: Record<string, number>;
}

export const ROLE_PRESETS: RolePreset[] = [
  {
    id: 'engineer',
    label: 'Engineer',
    annualSalary: {
      INR: 2200000,
      USD: 140000,
      EUR: 75000,
      GBP: 70000,
      AED: 280000,
      SGD: 115000,
    },
  },
  {
    id: 'designer',
    label: 'Product Designer',
    annualSalary: {
      INR: 1600000,
      USD: 115000,
      EUR: 65000,
      GBP: 60000,
      AED: 220000,
      SGD: 95000,
    },
  },
  {
    id: 'pm',
    label: 'Product Manager',
    annualSalary: {
      INR: 2500000,
      USD: 145000,
      EUR: 80000,
      GBP: 75000,
      AED: 310000,
      SGD: 125000,
    },
  },
  {
    id: 'manager',
    label: 'Engineering / Team Manager',
    annualSalary: {
      INR: 3200000,
      USD: 175000,
      EUR: 95000,
      GBP: 90000,
      AED: 380000,
      SGD: 155000,
    },
  },
  {
    id: 'director',
    label: 'Director / VP',
    annualSalary: {
      INR: 5500000,
      USD: 240000,
      EUR: 135000,
      GBP: 130000,
      AED: 550000,
      SGD: 220000,
    },
  },
  {
    id: 'custom',
    label: 'Custom Rate',
    annualSalary: {
      INR: 1800000,
      USD: 110000,
      EUR: 68000,
      GBP: 62000,
      AED: 240000,
      SGD: 96000,
    },
  },
];
