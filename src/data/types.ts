export type DataCell = Data | { type: 'padding' };

export type Data = { date: string; amount: number; type: 'data' };
