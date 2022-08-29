import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'clsx';
import { useSelector } from 'react-redux';
import Summary from '../components/Summary';
import { EditableRow } from '../components/ExpenseRow';
import Header from '../components/Header';
import { getSort, getSortIndexes } from '../utility/utility';
import LoadingComponent from '../components/LoadingComponent';
import { useLocation, useHistory } from 'react-router-dom';
import { css } from 'emotion';
import { RootState, IExpense } from '../components/typescript/general_interfaces';
import TableWrapper from '../components/expense_select/TableWrapper';
import { APIData, filterData } from '../data/util';

// background: '#00000020',
// width: '100vh',
const containerCss = css`
    margin: 0 auto;
    width: 100vw;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;

const desktopCss = css`
    height: calc(100vh - 130px);
`;

const options = ['Date', 'Amount', 'Store', 'Category'];
const optionsLower = options.map((el) => el.toLowerCase());
const orderDir = ['asc', 'desc'];

function useUrlSearch() {
    const location = useLocation();
    const [sort, order] = useMemo(
        () => getSortIndexes(optionsLower, ...getSort(location.search)),
        [location]
    );
    return [sort, order];
}

export default function Expenses() {
    const location = useLocation();
    const history = useHistory();
    const [sort, order] = useUrlSearch();
    const [expenses, setExpenses] = useState<Array<APIData>>([]);
    const [openSort, setOpenSort] = useState(false);

    const { width, height, start, end, deleteIds } = useSelector((state: RootState) => {
        const { width, height } = state.screen;
        const { start, end } = state.date.period;
        const { deleteIds } = state.editing.deletingMode;
        return { height, width, start, end, deleteIds };
    });

    // Fetch expenses on change
    useEffect(() => {
        fetchExpenses();
    }, [start, end, sort, order]);

    const updateURL = ({ sort, order }: { sort: any; order: any }) => {
        const search = new URLSearchParams();
        search.set('sort', optionsLower[sort].toLowerCase());
        search.set('order', order === 1 ? 'desc' : 'asc');
        let path = location.pathname;
        if (path.slice(-1) === '/') path = history.location.pathname.slice(0, -1);
        history.push(path + '?' + search.toString());
    };

    const updateSort = (sort: number) => {
        updateURL({ sort, order });
    };

    const updateOrder = (order: number) => {
        updateURL({ sort, order });
    };

    const fetchExpenses = async () => {
        console.info('Getting expenses');
        // `/api/users/expenses/summary?start=${start}&end=${end}&sort=${
        //     optionsLower[sort as any]
        // }&order=${orderDir[order as any]}`
        const res = await fetch('/data.json', {
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });
        if (res.status === 200) {
            const data = await res.json();
            const resultData = filterData(data.expenses, 'date', { min: start, max: end });
            setExpenses(resultData);
        } else {
            console.error('Error fetching results');
        }
    };

    const deleteExpenses = async () => {
        const res = await fetch(`/api/users/expenses/delete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(deleteIds),
        });

        if (res.ok) {
            fetchExpenses();
        } else {
            // Show error message
            const data = await res.json();
            console.error(data);
        }
    };

    let total = 0;
    return (
        <div
            className={clsx(width > 600 && desktopCss, containerCss)}
            style={width <= 600 ? { height: `calc(${height}px - 16vh)` } : {}}
        >
            <Header
                deleteAllowed
                deleteExpenses={deleteExpenses}
                open={openSort}
                setOpen={() => setOpenSort(!openSort)}
                title="Expenses"
                dashboard={{
                    setSort: updateSort,
                    setOrder: updateOrder,
                    sort,
                    order,
                    options,
                }}
            />
            <TableWrapper>
                {expenses?.length === 0 && <label>No recorded expenses</label>}
                {expenses &&
                    expenses.map((el: APIData, index) => {
                        total += el.amount;
                        return (
                            <EditableRow key={index} expense={el as any} refetch={fetchExpenses} />
                        );
                    })}
                {!expenses && <LoadingComponent />}
            </TableWrapper>
            <Summary total={total} />
        </div>
    );
}
