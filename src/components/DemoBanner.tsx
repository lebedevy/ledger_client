import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { css } from 'emotion';
import React, { useState } from 'react';

export const DemoBanner = () => {
    const [show, setShow] = useState(true);

    return show ? (
        <div
            className={css`
                display: flex;
                justify-content: center;
                align-items: center;
                height: 50px;
                position: fixed;
                top: 0;
                right: 0;
                left: 0;
                font-size: 1.5rem;
                font-weight: bold;
                text-align: center;
                color: white;
                background-color: #7871aa;
            `}
        >
            <div
                className={css`
                    flex: 1;
                `}
            >
                Demo version
            </div>
            <IconButton onClick={() => setShow(false)}>
                <CloseIcon />
            </IconButton>
        </div>
    ) : null;
};
