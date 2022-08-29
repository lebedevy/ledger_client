type APIData = { date: string; amount: number; store: string };

const stores = ["Dick's Sporting Goods", 'Hudson Bay Company', 'JCPenney', '7/11', 'Kmart'];

export const generateDummyExpenses = (start: number, end: number) => {
    const expenses: APIData[] = [];

    const length = getRandomInt(1000, 1000);

    for (let i = 0; i < length; i++) {
        expenses.push({
            date: formatDateToString(new Date(getRandomInt(start, end))),
            amount: getRandomInt(0, 450),
            store: stores[getRandomInt(0, stores.length - 1)],
        });
    }

    expenses.sort((a, b) => a.date.localeCompare(b.date));

    console.log(JSON.stringify({ data: expenses }));

    return expenses;
};

export const filterData = (
    data: APIData[],
    field: 'date',
    { min, max, equals }: { min?: string; max?: string; equals?: string }
) => {
    if (min && max) {
        return data.filter(
            (d) => d[field].localeCompare(min) >= 0 && d[field].localeCompare(max) <= 1
        );
    }

    return data;
};

export const groupData = (data: APIData[], field: 'date'): { date: string; amount: number }[] => {
    const result = data.reduce<{
        [key: string]: {
            [field]: APIData[typeof field];
            amount: number;
        };
        // {
        //     [key: typeof data[0][typeof field]]: typeof data[0][typeof field];
        //     amount: number;
        // };
    }>((prev, cur) => {
        const key = cur[field];

        if (prev[key]) {
            prev[key].amount += cur.amount;
        } else {
            prev[key] = { amount: cur.amount, [field]: key };
        }

        return prev;
    }, {});

    const res = Object.values(result);
    res.sort((a, b) => a[field].localeCompare(b[field]));
    return res;
    // .sort((a, b) => {
    //     if (typeof a[field] === 'string') {
    //         return (a[field] as string).localeCompare(b[field] as string);
    //     } else {
    //         return (a[field] as number) - (b[field] as number);
    //     }
    // });
};

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const formatDateToString = (date: Date) =>
    `${date.getUTCFullYear()}-${(date.getUTCMonth() < 9 ? '0' : '') + (date.getUTCMonth() + 1)}-${
        (date.getUTCDate() < 10 ? '0' : '') + date.getUTCDate()
    }`;
