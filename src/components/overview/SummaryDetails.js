import React from 'react';
import { makeStyles } from '@material-ui/styles';
import ExpenseRow from '../ExpenseRow';
import { CircularProgress } from '@material-ui/core';
import { css } from 'emotion';

const containerCss = css`
    display: flex;
    justify-content: center;
`;

export default function Details({ expenses, refetch }) {
    return expenses ? (
        <table style={{ width: '100%' }}>
            {expenses.map((expense) => (
                <ExpenseRow
                    key={expense.id}
                    expense={expense}
                    exclude={{ date: 1 }}
                    editable
                    refetch={refetch}
                />
            ))}
        </table>
    ) : (
        <div className={containerCss}>
            <CircularProgress />
        </div>
    );
}
