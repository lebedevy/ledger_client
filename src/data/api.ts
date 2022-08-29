import { filterData } from './util';

export const fetchDayExpenses = async (date: string) => {
    // `/api/users/expenses/summary?start=${date}&end=${date}&sort=amount&order=desc`
    const res = await fetch('/data.json', {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    });

    console.log(res);

    if (res.status === 200) {
        const data = await res.json();
        if (data.expenses) {
            const resultData = filterData(data.expenses, 'date', { equals: date });
            return resultData;
        }
    }

    return [];
};
