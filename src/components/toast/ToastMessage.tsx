import React, { useEffect } from "react";
import { Toast } from "./ToastProvider";
// import {  IconWrapper } from "@fortawesome/react-fontawesome";
import { clsx } from "../../utils/clsx";
import { ExclamationCircleIcon } from "@heroicons/react/solid";
import {
	XIcon,
	CheckIcon,
	InformationCircleIcon,
} from "@heroicons/react/outline";

const VARIANTS = {
	Info: {
		base: "bg-base border-blue-500",
		iconstyle: "text-blue-500 ",
		icon: InformationCircleIcon,
		name: "Info",
	},

	Error: {
		base: "bg-base border-red-500 ",
		iconstyle: "text-red-500 ",
		icon: ExclamationCircleIcon,
		name: "Error",
	},

	Warning: {
		base: "bg-base border-yellow-500",
		iconstyle: "text-yellow-500 ",
		icon: ExclamationCircleIcon,
		name: "Warning",
	},

	Success: {
		base: "bg-base border-green-500",
		iconstyle: "text-green-500 ",
		icon: CheckIcon,
		name: "Success",
	},
};

export type Truncate =
	| "truncate-1-lines"
	| "truncate-2-lines"
	| "truncate-3-lines";

export type ToastMessage = {
	id: string;
	lifetime?: number;
	variant?: keyof typeof VARIANTS | undefined;
	onRemove?: (id: string) => void;
	truncate?: Truncate;
} & Toast;

const IconWrapper = ({
	icon: Icon,
	className,
}: {
	icon: typeof CheckIcon;
	className: string;
}) => {
	return <Icon className={className} />;
};

export default function ToastMessage({
	id,
	header,
	message,
	lifetime,
	onRemove,
	truncate = "truncate-1-lines",
	icon,
	type,
}: ToastMessage) {
	const Var = type
		? VARIANTS[type]
		: {
				base: "bg-white border-text ",
				iconstyle: "",
				icon: icon,
				name: header,
		  };

	useEffect(() => {
		if (lifetime && onRemove) {
			setTimeout(() => {
				onRemove(id);
			}, lifetime);
		}
	}, [lifetime]);

	return (
		<div
			className={clsx(
				"flex w-full visible flex-row shadow-lg",
				"border-l-4 rounded-md duration-100 cursor-pointer",
				"transform transition-all hover:scale-102",
				Var.base,
				type && "max-h-40"
			)}
		>
			<div className="flex flex-row p-2 flex-no-wrap w-full">
				{Var.icon && (
					<div
						className={clsx(
							"flex items-center h-12 w-12",
							"mx-auto text-xl select-none"
						)}
					>
						<IconWrapper
							className={clsx("mx-auto", Var.iconstyle)}
							icon={Var.icon as any}
						/>
					</div>
				)}

				<div className="flex flex-col flex-no-wrap px-1 w-full">
					<div className="flex my-auto text-text  font-bold select-none">
						{Var.name}
					</div>
					<p
						className={clsx(
							"-mt-0.5 my-auto break-all flex",
							"text-text text-sm",
							typeof message === "string" && truncate
						)}
					>
						{message}
					</p>
				</div>
				<div
					onClick={() => onRemove && onRemove(id)}
					className={clsx(
						"w-10 h-12 mr-2 items-center mx-auto",
						"text-center leading-none text-lg"
					)}
				>
					<IconWrapper
						className={clsx(
							"mx-auto my-auto h-5 text-center text-text",
							"cursor-pointer hover:scale-105 mt-2.5"
						)}
						icon={XIcon}
					/>
				</div>
			</div>
		</div>
	);
}
