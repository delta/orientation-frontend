import React from 'react';
import { clsx } from '../../utils/clsx';

export const DuplicateWSConnectionError = () => {
    return (
        <div
            className={clsx('text-lg py-6')}
            style={{
                maxWidth: '500px'
            }}
        >
            You can only use Utopia from one tab. To use it here, close the the
            other{'  '}
            tab and reload this page.
        </div>
    );
};
