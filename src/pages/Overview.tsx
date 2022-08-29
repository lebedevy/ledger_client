import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getCurrencyFormat } from '../utility/utility';
import { SpendingMap } from '../components/overview/SpendingMap';
import { MaxExpense } from '../components/overview/MaxExpense';
import AddExpenseButton from '../components/AddExpenseButton';
import { DaySummary } from '../components/overview/DaySummary';
import SummaryItem from '../components/SummaryItem';
import { css } from 'emotion';
import { flexJustifyCenterCss } from '../components/styling/CommonStyles';
import { filterData, formatDateToString, groupData } from '../data/util';
import { RootState } from '../components/typescript/general_interfaces';
import { DataCell } from '../data/types';

// const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const pageCss = css`
    box-sizing: border-box;
    flex: 1;
    padding: 10px;
    max-width: 1200px;
    overflow: hidden;
    h1 & {
        margin: 10px 0;
        padding: 10px 0;
    }
`;
const errorCss = css`
    color: red;
    font-weight: bold;
    font-size: 1.5em;
    display: block;
    padding: 10px 0;
`;

// Daily Summary
export default function Overview() {
    const { start, end } = useSelector((state: RootState) => state.date.period);
    const [data, setData] = useState<DataCell[]>([]);
    const [step, setStep] = useState(0);
    const [max, setMax] = useState<{ amount: number; date: string } | null>(null);
    const [average, setAverage] = useState({ length: 0, average: 0, total: 0 });
    const [error, setError] = useState<string | null>(null);
    const [day, setDay] = useState<{ date: string } | null>(null);

    useEffect(() => {
        // if selected day out of range, reset the daily summary
        if (day) {
            const date = new Date(day.date);
            if (date < new Date(start) || date > new Date(end)) setDay(null);
        }
        fetchDailySummary();
    }, [start, end]);

    async function fetchDailySummary() {
        // `/api/users/expenses/overview?start=${start}&end=${end}`
        const res = await fetch('/data.json', {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        // generateDummyExpenses(new Date('1-1-2021').getTime(), new Date('1-1-2024').getTime());

        if (res.ok) {
            const data = await res.json();
            if (data.expenses) {
                const resData = filterData(data.expenses, 'date', { min: start, max: end });
                return formatData(groupData(resData, 'date'));
            }
        }
        setError('There was an error fetching your expense data');
    }

    function formatData(data: { date: string; amount: number }[]) {
        // Insert zero days in between
        const [yearS, monthS, dayS] = start.split('-');
        const startDate = new Date(Date.UTC(parseInt(yearS), parseInt(monthS) - 1, parseInt(dayS)));
        const offsetCount = startDate.getUTCDay();
        let range = (new Date(end).getTime() - (startDate.getTime() - 86400000)) / 86400000;

        let result: DataCell[] = [];
        let total = 0;
        let max = { amount: 0, date: start };
        for (let i = 0, j = 0; i < range; i++) {
            const date = new Date(
                startDate.getUTCFullYear(),
                startDate.getUTCMonth(),
                startDate.getUTCDate() + i
            );
            let dateStr = formatDateToString(date);
            if (data[j] && data[j]['date'] === dateStr) {
                result.push({ ...data[j], type: 'data' });
                max = data[j]['amount'] > max.amount ? data[j] : max;
                total += data[j]['amount'];
                j++;
            } else {
                result.push({ date: dateStr, amount: 0, type: 'data' });
            }
        }

        // Add padding cells to the front
        let offset: DataCell[] = [];
        for (let i = 0; i < offsetCount; i++) {
            offset.push({ type: 'padding' });
        }
        result.unshift(...offset);

        // Add padding cells to the back
        const padding = 7 - (result.length % 7);
        if (padding < 7) {
            let backPadding: DataCell[] = [];
            for (let i = 0; i < padding; i++) backPadding.push({ type: 'padding' });
            result.push(...backPadding);
        }

        setAverage({ average: total / range, length: range, total });
        setStep(Math.ceil(max.amount / 4));
        setMax(max);
        setData(result);
    }

    return (
        <div className={flexJustifyCenterCss}>
            <div className={pageCss}>
                <h1>Period Summary</h1>
                <label>{`From ${start} to  ${end}`}</label>
                {error ? <label className={errorCss}>{error}</label> : null}
                <SpendingMap data={data} step={step} setDay={setDay} day={day} />
                <div>
                    <DaySummary day={day} />
                    <MaxExpense max={max} />
                    <SummaryItem>
                        <h2>Daily Average</h2>
                        <label>{`${average.length} days`}</label>
                        <label>{`$${getCurrencyFormat(average.average)}/day`}</label>
                        <label>{`$${getCurrencyFormat(average.total)} total`}</label>
                    </SummaryItem>
                </div>
            </div>
            <AddExpenseButton />
        </div>
    );
}
