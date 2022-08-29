import React, { useState, useEffect } from 'react';
import { Button, Link } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { EmailInput, PasswordInput } from '../components/ContainedInput';
import LoadingBackdrop from '../components/landing/LoadingBackdrop';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/actions';

const backgroundImage = '/images/fabian-blank-pElSkGRA2NU-unsplash-min.jpg';

const useStyles = makeStyles({
    container: {
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    background: {
        // background: 'linear-gradient(white, gray)',
        backgroundImage: `url(${backgroundImage})`,
        backgroundPosition: 'bottom center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: -1,
    },
    button: {
        margin: '10px',
    },
    error: {
        color: 'red',
        textAlign: 'center',
    },
});

export default function Login() {
    const history = useHistory();
    const [waitingRes, setWaitingRes] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [email, setEmail] = useState('test@test.com');
    const [password, setPassword] = useState('test');
    const [loginError, setLoginError] = useState<string>();
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => setLoaded(true), []);

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setWaitingRes(true);
        if (email === '' || password === '') {
            setLoginError('Please ensure all fields are filled out');
            return;
        }

        let res = { status: 400 };

        if (email === 'test@test.com' && password === 'test') {
            res = { status: 200 };
            dispatch(setUser({ email: 'test@test.com' }));
        }

        // const res = await fetch('/api/users/login', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ email, password }),
        // });

        switch (res.status) {
            case 200:
                history.push('/users/login');
                break;
            case 400:
                setLoginError('Please ensure your password and email are correct');
                break;
            case 500:
                setLoginError('Server error. Please try again later.');
                setWaitingRes(false);
                break;
        }
    }

    return (
        <form className={classes.container} onSubmit={submit}>
            <LoadingBackdrop waitingRes={waitingRes} />
            {loaded && (
                <div className={classes.background}>
                    <img
                        style={{ display: 'none' }}
                        src={backgroundImage}
                        title="Photo by Fabian Blank on Unsplash"
                        alt="Piggy bank"
                    />
                </div>
            )}
            <h2>Login</h2>
            <EmailInput value={email} update={(value) => setEmail(value)} />
            <PasswordInput value={password} update={(value) => setPassword(value)} />
            {loginError && <label className={classes.error}>{loginError}</label>}
            <Button
                disabled={waitingRes}
                className={classes.button}
                type="submit"
                variant="contained"
                color="primary"
            >
                Login
            </Button>
            <Link href="/users/register">New? Register here</Link>
        </form>
    );
}
