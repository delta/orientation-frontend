import React, { useEffect, useMemo, useRef } from "react";
import "./register.css";
import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

interface InputComponentProps {
	id: number;
	setData: (value: string) => void;
	isActive: boolean;
	textData: {
		question: string;
		label: string;
		placeholder?: string; // text input
		options?: { name: string; available: boolean; code: string }[]; // select input
	};
}

const departments = [
	{ name: "Select your department", available: false, code: "YOUR MOM" },
	{ name: "Computer Science Engineering", available: true, code: "YOUR MOM" },
	{ name: "Metallurgy", available: true, code: "YOUR MOM" },
];

const formData: {
	question: string;
	userData: "username" | "department" | "aboutMe" | "gender";
	label: string;
	placeholder?: string;
	type: "text" | "select";
	options?: { name: string; available: boolean; code: string }[];
}[] = [
	{
		question: "What's your name",
		userData: "username",
		label: "What should we call you",
		placeholder: "Enter your name here...",
		type: "text",
	},
	{
		question: "Which department are you from",
		userData: "department",
		label: "Tell us your department",
		options: departments,
		type: "select",
	},
];

const SelectComponent = ({
	id,
	setData,
	textData: data,
}: InputComponentProps) => {
	const [selected, setSelected] = useState(departments[0]);

	return (
		<div className="element p-4">
			<h1 className="relative text-text text-2xl my-5">
				<span className="absolute text-lg pr-2 font-bold -left-12 top-0.5">
					{id} &rarr;
				</span>
				<span>{data.question}</span>
			</h1>
			<div>
				<Listbox value={selected} onChange={setSelected}>
					<div className="relative mt-4">
						<Listbox.Label className="text-text text-lg py-4 pb-8 mb-4">
							{data.label}
						</Listbox.Label>
						<Listbox.Button className="headless-select relative w-4/5 py-2 mt-12 pl-3 pr-10 text-left bg-background text-text text-xl rounded-lg shadow-md cursor-default focus:outline-none ">
							<span className="block truncate">{selected.name}</span>
							<span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
								<SelectorIcon
									className="w-5 h-5 text-text"
									aria-hidden="true"
								/>
							</span>
						</Listbox.Button>
						<Transition
							as={Fragment}
							leave="transition ease-in duration-100"
							leaveFrom="opacity-100 z-0"
							leaveTo="opacity-0 z-100"
						>
							<Listbox.Options className="select-box absolute w-4/5 py-1 mt-1 overflow-auto bg-background rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 ">
								{data?.options?.map((dept, deptIdx) => (
									<Listbox.Option
										key={deptIdx}
										className={({ active }) =>
											`${active ? "text-text bg-base" : "text-text"}  ${
												dept.available ? "" : "opacity-50"
											} text-lg  cursor-pointer select-none relative py-2 pl-10 pr-4 m-2 bg-background border-2 border-text hover:bg-gray-700`
										}
										value={dept}
										disabled={!dept.available}
									>
										{({ selected, active }) => (
											<>
												<span
													className={`${
														selected ? "font-medium" : "font-normal"
													} ${
														dept.available ? "" : "opacity-50"
													} block truncate`}
												>
													{dept.name}
												</span>
												{selected ? (
													<span
														className={`${active ? "text-text" : "text-text "}
				absolute inset-y-0 left-0 flex items-center pl-3 `}
													>
														<CheckIcon className="w-5 h-5" aria-hidden="true" />
													</span>
												) : null}
											</>
										)}
									</Listbox.Option>
								))}
							</Listbox.Options>
						</Transition>
					</div>
				</Listbox>
			</div>
			<br />
			<button
				className="inline-flex bg-accent1 rounded-sm text-text  font-bold tracking-widest text-sm align-top  px-2 py-0.5 mt-5 hover:bg-accent2"
				// make the element non-focusable
				tabIndex={-1}
				onClick={() => {
					setData(selected.name);
				}}
			>
				<span className="pt-1">OK</span>
				<span
					className="inline-block pl-1"
					style={{
						fontSize: "1.5rem",
						paddingTop: "2.5px",
						// width: "fit-content",
					}}
				>
					✓
				</span>
			</button>
			<span className=" inline-block text-text pl-4 mt-3">
				Press{" "}
				<span className="font-bold">
					Enter
					<span
						className="inline-block font-normal  pl-2 z-0"
						style={{
							fontSize: "1.5rem",
							// transform: "translateY(1px)",
							width: "fit-content",
						}}
					>
						&crarr;
					</span>
				</span>
			</span>
		</div>
	);
};

const TextComponent = ({ id, isActive }: InputComponentProps) => {
	useEffect(() => {
		if (isActive) {
			window.addEventListener("keypress", listenForEnterKeyPress);
			return () => {
				window.removeEventListener("keypress", listenForEnterKeyPress);
			};
		}
	}, [isActive]);

	const [inputValue, setInputValue] = useState("");

	const listenForEnterKeyPress = (e: KeyboardEvent) => {
		if (e.key === "Enter") {
		}
	};

	return (
		<div className="element p-4">
			<h1 className="relative text-text text-2xl my-5">
				<span className="absolute text-lg pr-2 font-bold -left-12 top-0.5">
					{id} &rarr;
				</span>
				<span>What is your username ?</span>
			</h1>
			<label
				htmlFor="username"
				className="block text-text text-lg my-3 opacity-75 mb-8"
			>
				What do you want to be known as in Utopia ?
			</label>
			<input
				type="text"
				id="username"
				placeholder="Enter your name here..."
				className="bg-transparent truncate text-text border-b-2 p-2 duration-150  border-opacity-25 text-3xl w-4/5 outline-none focus:border-opacity-100 focus:border-b-2 focus:bg-base focus:text-text"
			/>
			<br />
			<button
				className="bg-accent1 text-text rounded-sm font-bold tracking-widest text-sm align-top  px-2 py-0.5 mt-5 hover:bg-accent2"
				// make the element non-focusable
				tabIndex={-1}
			>
				OK
				<span
					className="inline-block pl-1"
					style={{
						fontSize: "1.5rem",
						transform: "translateY(3px)",
						// width: "fit-content",
					}}
				>
					✓
				</span>
			</button>
			<span className=" inline-block pl-4 mt-3 text-text">
				Press{" "}
				<span className="font-bold">
					Enter
					<span
						className="inline-block font-normal  pl-2"
						style={{
							fontSize: "1.5rem",
							transform: "translateY(1px)",
							width: "fit-content",
						}}
					>
						&crarr;
					</span>
				</span>
			</span>
		</div>
	);
};

export const Register = () => {
	const ref = useRef<any>(null);

	const getAllElements = () => {
		console.log("getting all elements");
		const x = window.document.querySelectorAll(".element");
		console.log(x);
		return Array.from(x);
	};

	// This won't work, need to setAllElements manually inside useEffect : )
	const [allElements, setAllElements] = useState<Element[]>(getAllElements);
	const [currentActiveElement, setCurrentActiveElement] = useState(-1);
	// const [isNextButtonDisabled]

	// Set allElements after the DOM Loads
	useEffect(() => {
		// setAllElements(getAllElements)

		// need to call the setAllElements in a effect as, when the state is initialized
		// the getAllElements function runs before the DOM is painted, and will return
		// a empty nodeList

		// const allElems = getAllElements();
		setAllElements(getAllElements());
	}, []);

	// Set the active element to the most active element
	useEffect(() => {
		// TODO: instead of initializing the element to the first form item,
		//Have a start element filling form button
		// console.log(allElements);
		// console.log(allElements[0]?.className);
		if (!allElements) return;
		allElements[0]?.classList.add("active");
		setCurrentActiveElement(0);

		for (let i = 1; i < allElements.length; i++) {
			allElements[i].classList.add("not-visited");
		}
	}, [allElements]);

	// Moves to the next element
	const nextElement = () => {
		if (currentActiveElement + 1 === allElements.length) return;

		allElements[currentActiveElement].classList.remove("active");
		allElements[currentActiveElement + 1].classList.add("active");
		allElements[currentActiveElement + 1].classList.remove("not-visited");
		setCurrentActiveElement((prev) => prev + 1);
	};

	// Moves to previous element
	const prevElement = () => {
		if (currentActiveElement === 0) return;

		allElements[currentActiveElement].classList.remove("active");
		allElements[currentActiveElement].classList.add("not-visited");
		allElements[currentActiveElement - 1].classList.add("active");
		setCurrentActiveElement((prev) => prev - 1);
	};

	const addEventListenerForKeyPress = (e: KeyboardEvent) => {
		// if the user presses Tab or Down Arrow, we move to the next element
		// !!! The element is not validated, only moved
		if (e.keyCode === 9 || e.keyCode === 40) {
			// preventing Tab key's default action
			e.preventDefault();
			nextElement();
		}

		if (e.keyCode === 38) prevElement();
	};

	useEffect(() => {
		window.addEventListener("keydown", addEventListenerForKeyPress);
		return () => {
			window.removeEventListener("keydown", addEventListenerForKeyPress);
		};
	});

	const [userData, setUserData] = useState<{
		username: string;
		department: string;
		aboutMe: string;
		gender: string;
	}>({
		username: "",
		department: "",
		aboutMe: "",
		gender: "",
	});

	const addDataAndProceed = (key: keyof typeof userData) => {
		return (value: string) => {
			console.log("the data is : ", value);
			setUserData((prevData) => {
				prevData[key] = value;
				return prevData;
			});
		};
	};

	return (
		<div className="flex justify-center items-center min-h-screen ">
			<form
				className="relative w-3/5 bg-base overflow-hidden rounded"
				style={{ minHeight: "75vh" }}
				onSubmit={(e) => {
					e.preventDefault();
					console.log("Hello world");
				}}
			>
				{formData.map((singleFormData, index) => {
					if (singleFormData.type === "text") {
						return (
							<TextComponent
								id={index + 1}
								key={index}
								setData={addDataAndProceed(singleFormData.userData)}
								isActive={index === currentActiveElement}
								textData={singleFormData}
							/>
						);
					} else {
						return (
							<SelectComponent
								id={index + 1}
								key={index}
								setData={addDataAndProceed(singleFormData.userData)}
								isActive={index === currentActiveElement}
								textData={singleFormData}
							/>
						);
					}
				})}

				<button type="submit" hidden>
					Submit
				</button>

				{/* PREVIOUS ELEMENT */}
				<div className="absolute right-20 bottom-10 font-thin">
					<button
						className="rounded-tl-md rounded-bl-sm bg-accent1 border-r-2 border-black hover:bg-accent2"
						onClick={prevElement}
						disabled={currentActiveElement === 0}
						type="button"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M5 15l7-7 7 7"
							/>
						</svg>
					</button>
					{/* END OF PREVIOUS ELEMENT */}

					{/* NEXT BUTTON  */}
					<button
						className=" rounded-br-md rounded-tr-sm bg-accent1 hover:bg-accent2"
						onClick={nextElement}
						type="button"
						disabled={currentActiveElement + 1 === allElements.length}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M19 9l-7 7-7-7"
							/>
						</svg>
					</button>
					{/* END OF NEXT BUTTON  */}
				</div>
			</form>
		</div>
	);
};
