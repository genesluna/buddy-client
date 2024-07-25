import { SearchParams } from '@/app/_types/props';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateAgeFromBirthDate(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const monthDifference = today.getMonth() - birth.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birth.getDate())
  ) {
    age--;
  }

  return age;
}

export function birthDateToHumanReadableAge(birthDate: string): string {
  const age = calculateAgeFromBirthDate(birthDate);
  return `${age} ano${age > 1 ? 's' : ''} de idade`;
}

export function buildSearchParamsPath(
  path: string,
  searchParams: SearchParams
) {
  const urlSearchParams = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value) {
      urlSearchParams.append(key, value);
    }
  });

  if (urlSearchParams.toString() === '') {
    return path + '?';
  }

  return path + '?' + urlSearchParams.toString();
}
