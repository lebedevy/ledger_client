import React, { useEffect } from 'react';
import { EditableRow } from '../ExpenseRow';
import { CircularProgress } from '@material-ui/core';
import { css } from 'emotion';
import { flexJustifyCenterCss } from '../styling/CommonStyles';

export default function Details({ expenses, refetch }) {
    useEffect(() => {
        if (!expenses) {
            refetch();
        }
    }, [expenses, refetch]);

    return expenses ? (
        <table style={{ width: '100%' }}>
            {expenses.map((expense) => (
                <EditableRow
                    key={expense.id}
                    expense={expense}
                    exclude={{ date: 1 }}
                    refetch={refetch}
                />
            ))}
        </table>
    ) : (
        <div className={flexJustifyCenterCss}>
            <CircularProgress />
        </div>
    );
}
