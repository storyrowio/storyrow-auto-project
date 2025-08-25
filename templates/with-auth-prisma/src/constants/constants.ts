export const BasicSort = {
    newest: { name: 'Newest', value: 'createdAt,desc' },
    oldest: { name: 'Oldest', value: 'createdAt,asc' },
};

export const DefaultSort = {
    name: { name: 'Name', value: 'name,asc' },
    ...BasicSort
} as const;

export type SortKey = keyof typeof DefaultSort;

export const CategoryTypes = [
    { name: 'Income', value: 'income' },
    { name: 'Expense', value: 'expense' },
    { name: 'General', value: 'general' },
];
