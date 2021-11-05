export const clsx = (...arg: any[]) => {
	return arg.reduce((prev, current) => prev + String(current) + " ", "");
};
