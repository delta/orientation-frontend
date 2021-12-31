import React from 'react';
import { clsx } from '../../utils/clsx';

const MadeWithLove = () => {
    return (
        <footer
            className={clsx(
                'text-center text-text font-medium text-lg',
                'fixed bottom-0 w-full mb-1'
            )}
        >
            Made with &#128154;
            <a
                className="text-accent1 font-semibold"
                href="http://delta.nitt.edu"
                target="_blank"
                rel="noopener noreferrer"
            >
                {' '}
                Delta Force
            </a>
        </footer>
    );
};

export { MadeWithLove };
