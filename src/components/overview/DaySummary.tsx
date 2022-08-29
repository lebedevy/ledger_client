import React, { useState, useEffect, useMemo, useCallback } from 'react';
import SummaryDetailsButton from './SummaryDetailsButton';
import Details from './SummaryDetails';
import { getCurrencyFormat, getFormatedDate } from '../../utility/utility';
import SummaryItem from '../SummaryItem';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import { RootState } from '../typescript/general_interfaces';
import { fetchDayExpenses } from '../../data/api';
import { APIData } from '../../data/util';

const useStyles = makeStyles({
    emptyList: {
        textAlign: 'center',
    },
    selectOther: {
        fontStyle: 'italic',
        fontSize: '.8em',
    },
});

export const DaySummary: React.FC<{ day: { date: string } | null }> = ({ day }) => {
    const classes = useStyles();
    const today = getFormatedDate(useSelector((state: RootState) => (state.date as any).today));
    const [expanded, setExpanded] = useState(false);
    const [expenses, setExpenses] = useState<APIData[] | null>(null);

    const fetchExpenseSummary = useCallback(async (date: string) => {
        setExpenses(await fetchDayExpenses(date));
    }, []);

    useEffect(() => {
        fetchExpenseSummary(day?.date ?? today);
    }, [day, fetchExpenseSummary, today]);

    const total = useMemo(
        () => expenses?.reduce((total, el) => total + el.amount, 0) ?? 0,
        [expenses]
    );

    return (
        <SummaryItem>
            {day == null ? (
                <>
                    <div>
                        <h2>Today's Expenses</h2>
                        <label className={classes.selectOther}>
                            Select any other day on the graph above to view that day's expenses
                        </label>
                    </div>
                    <label>{today}</label>
                </>
            ) : (
                <>
                    <h2>{`Summary for ${day.date}`}</h2>
                </>
            )}
            <label>{`Expenses: $${getCurrencyFormat(total)}`}</label>
            {expenses && expenses.length > 0 ? (
                <SummaryDetailsButton setExpanded={setExpanded} expanded={expanded} />
            ) : (
                <label className={classes.emptyList}>No expenses for selected date</label>
            )}
            {expanded && <Details expenses={expenses} refetch={fetchExpenseSummary} />}
        </SummaryItem>
    );
};
