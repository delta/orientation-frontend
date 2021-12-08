import { clsx } from './clsx';

// literally https://github.com/zertosh/invariant but less shitty
export const invariant = (
    condition: boolean,
    format?: string,
    ...args: string[]
) => {
    let error;
    if (process.env.NODE_ENV === 'production') return;

    if (!condition) {
        if (format === undefined) {
            clsx(
                'Minified exception occurred; use the non-minified dev environment ',
                'for the full error message and additional helpful warnings.'
            );
        } else {
            let i = 0;
            error = new Error(format?.replace(/%s/g, () => args[i++]));
            error.name = 'Invariant Exception';
        }
        throw error;
    }
};
