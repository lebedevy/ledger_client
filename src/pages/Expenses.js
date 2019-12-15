import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import Summary from '../components/Summary';
import ExpenseSummary from '../components/ExpenseSummary';
import ExpenseFull from '../components/ExpenseFull';
import Header from '../components/Header';

const styles = theme => ({
    container: {
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#00000020',
        overflow: 'hidden',
    },
    expenseList: {
        'overflow-y': 'auto',
        'overflow-x': 'hidden',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        background: '#ffffff',
        borderRadius: '5px',
    },
});

class Expenses extends Component {
    state = { expenses: [], expand: null };

    componentDidMount() {
        this.getExpenses(this.props.start, this.props.end);
    }

    componentDidUpdate(prevProps) {
        if (this.props.start !== prevProps.start || this.props.end !== prevProps.end) {
            this.getExpenses(this.props.start, this.props.end);
        }
    }

    async getExpenses(start, end) {
        const res = await fetch(`/api/users/expenses/summary?start=${start}&end=${end}`);
        if (res.status === 200) {
            const data = await res.json();
            console.log(data.expenses);
            this.setState({ expenses: data.expenses });
        } else {
            console.error('Error fetching results');
        }
    }

    async deleteExpense(id, ind) {
        const { expenses } = this.state;
        // Make sure the correct expense is being deleted
        if (expenses[ind].id === id) {
            // call api to remove
            const res = await fetch(`/api/users/expenses/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });

            if (res.ok) {
                // Remove from array
                let update = expenses.slice();
                update.splice(ind, 1);
                this.setState({ expenses: update });
            } else {
                //    Show error message
                const data = await res.json();
                console.error(data);
            }
        }
    }

    render() {
        const { classes } = this.props;
        const { expenses, expand } = this.state;
        let total = 0;
        return (
            <div className={classes.container}>
                <Header title="Expenses" />
                <div className={classes.expenseList}>
                    {expenses.length === 0 ? <label>No recorded expenses</label> : null}
                    {expenses.map((el, ind) => {
                        total += el.amount;
                        return el.id === expand ? (
                            <ExpenseFull
                                key={el.id}
                                el={el}
                                ind={ind}
                                expand={() => this.setState({ expand: null })}
                                deleteExpense={() => this.deleteExpense(el.id, ind)}
                            />
                        ) : (
                            <ExpenseSummary
                                key={el.id}
                                el={el}
                                ind={ind}
                                expand={() => this.setState({ expand: el.id })}
                            />
                        );
                    })}
                </div>
                <Summary total={total} />
            </div>
        );
    }
}

const mapStateToProps = state => {
    const { date } = state;
    const { start, end } = date.period;
    console.log(start, end);
    return { date, start, end };
};

export default connect(mapStateToProps)(withStyles(styles)(Expenses));
