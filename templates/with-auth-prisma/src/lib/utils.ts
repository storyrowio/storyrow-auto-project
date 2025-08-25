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

export function convertQuery(query: any) {
    const { page = "1", limit = "10" } = query;

    const pageNumber = parseInt(page as string, 10);
    const pageSize = parseInt(limit as string, 10);

    const skip = (pageNumber - 1) * pageSize;

    return { skip, limit: pageSize }
}

export function capitalizeFirstLetterOfEachWord(str: string) {
    const words = str.toLowerCase().split(' ');
    const capitalizedWords = words.map(word => {
        if (word.length === 0) {
            return '';
        }
        return word.charAt(0).toUpperCase() + word.slice(1);
    });

    return capitalizedWords.join(' ');
}
