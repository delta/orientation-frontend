import { clsx } from './clsx';

// literally https://github.com/zertosh/invariant but less shitty
/**
 * A fancy function which throws error if the **condition** fails. It has over the top
 * unnecessary feats like %s in printf in GoLang or C
 * @param condition if the condition fails, invariant will throw an error
 * @param format Error message, and '**%s**; places where you want the arguments to be
 * @param args arguments which go in the place of '**%s**'
 * @returns throws an error if the **condition** fails, else return nothing (void)
 */
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
