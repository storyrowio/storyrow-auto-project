import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function generateUniqueId(length = 6) {
    return Math.random().toString(36).substring(2, length+2);
}

export function formatCurrencyNumber(val: string) {
    return val?.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

}
