import React, { useState, useEffect, useCallback } from 'react';
import { getCurrencyFormat } from '../../utility/utility';
import SummaryDetailsButton from './SummaryDetailsButton';
import Details from './SummaryDetails';
import SummaryItem from '../SummaryItem';
import { APIData } from '../../data/util';
import { fetchDayExpenses } from '../../data/api';

export const MaxExpense: React.FC<{ max: { date: string; amount: number } | null }> = ({ max }) => {
    const [expanded, setExpanded] = useState(false);
    const [expenses, setExpenses] = useState<APIData[] | null>(null);

    const fetchExpenseSummary = useCallback(async () => {
        // `/api/users/expenses/summary?start=${max.date}&end=${max.date}&sort=amount&order=desc`
        if (max?.date) {
            setExpenses(await fetchDayExpenses(max.date));
        }
    }, [max?.date]);

    useEffect(() => {
        fetchExpenseSummary();
    }, [fetchExpenseSummary]);

    return (
        <SummaryItem>
            <h2>Max Daily Expense</h2>
            <label>{max ? max.date : 'loading...'}</label>
            <label>{max ? `$${getCurrencyFormat(max.amount)}` : ''}</label>
            <SummaryDetailsButton setExpanded={setExpanded} expanded={expanded} />
            {expanded && <Details expenses={expenses} refetch={fetchExpenseSummary} />}
        </SummaryItem>
    );
};
