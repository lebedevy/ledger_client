import React from 'react';
import { TextField } from '@material-ui/core';
import { css } from 'emotion';

const inputCss = css`
    background-color: #ffffff;
    border-radius: 4px;
`;

export const EmailInput: React.FC<{ value: string; update: (v: string) => void }> = ({
    value,
    update,
}) => {
    return (
        <React.Fragment>
            <TextField
                className={inputCss}
                value={value}
                onChange={(e) => update(e.target.value)}
                placeholder="Email"
                type="email"
                required
                margin="dense"
                variant="outlined"
            />
        </React.Fragment>
    );
};

export const PasswordInput: React.FC<{ value: string; update: (v: string) => void }> = ({
    value,
    update,
}) => {
    return (
        <TextField
            className={inputCss}
            value={value}
            onChange={(e) => update(e.target.value)}
            placeholder="Password"
            type="password"
            required
            margin="dense"
            variant="outlined"
        />
    );
};
