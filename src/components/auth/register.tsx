import React, { useEffect, useContext, useCallback } from 'react';
import './register.css';
import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import { useHistory } from 'react-router-dom';

import bgImage from '../../assets/images/layered-peaks-haikei.svg';

import { useToast } from '../toast/ToastProvider';
import { clsx } from '../../utils/clsx';
import { axiosInstance } from '../../utils/axios';
import { UserContext } from '../../contexts/userContext';
import { Redirect } from 'react-router';

interface InputComponentProps {
    id: number;
    setData: (value: string) => void;
    isActive: boolean;
    textData: {
        question: string;
        label: string;
        placeholder?: string; // text input
        textInputType?: 'input' | 'textArea'; // text input
        options?: {
            name: string;
            available: boolean;
            code: string;
            img?: string;
        }[]; // select input
        buttonText?: string;
    };
}

const departments = [
    { name: 'Select your department', available: false, code: '' },
    { code: 'AR', name: 'Architecture', available: true },
    { code: 'CA', name: 'Computer Applications', available: true },
    { code: 'CE', name: 'Chemical Engineering', available: true },
    { code: 'CL', name: 'Civil Engineering', available: true },
    { code: 'CSE', name: 'Computer Science & Engineering', available: true },
    {
        code: 'ECE',
        name: 'Electrical & Communication Engineering',
        available: true
    },
    {
        code: 'EEE',
        name: 'Electrical & Electronics Engineering',
        available: true
    },
    {
        code: 'ICE',
        name: 'Instrumentation & Communication Engineering',
        available: true
    },
    { code: 'ME', name: 'Mechanical Engineering', available: true },
    {
        code: 'MME',
        name: 'Metallurgical & Materials Engineering',
        available: true
    },
    { code: 'PR', name: 'Production Engineering', available: true }
];

const formData: {
    question: string;
    userData:
        | 'start'
        | 'username'
        | 'department'
        | 'spriteType'
        | 'description'
        | 'gender'
        | 'submit';
    label: string;
    placeholder?: string;
    textInputType?: 'input' | 'textArea';
    buttonText?: string;
    type: 'text' | 'select' | 'button';
    options?: {
        name: string;
        available: boolean;
        code: string;
        img?: string;
    }[];
}[] = [
    {
        question: 'We need some more details before starting ',
        userData: 'start',
        label: 'Answer these following questions',
        buttonText: "Let's Start !",
        type: 'button'
    },
    {
        question: "What's your name",
        userData: 'username',
        textInputType: 'input',
        label: 'What do you wanna be known as in Utopia',
        placeholder: 'Enter your name here...',
        type: 'text'
    },
    {
        question: 'How do u want to look like in Utopia ?',
        userData: 'spriteType',
        label: 'How do u wanna look in UTOPIA',
        options: [
            {
                name: 'Select how you want to look like',
                available: false,
                code: 'nth',
                img: '/favicon.ico'
            },
            {
                name: 'male',
                available: true,
                code: 'male',
                img: '/favicon.ico'
            },
            {
                name: 'female',
                available: true,
                code: 'female',
                img: '/favicon.ico'
            }
        ],
        type: 'select'
    },
    {
        question: 'Which department are you from',
        userData: 'department',
        label: 'Tell us your department',
        options: departments,
        type: 'select'
    },
    {
        question: 'Tell us something about yourself',
        userData: 'description',
        label: 'Dont tell me your fav color',
        placeholder: 'Tell me something you want everyone to know about you',
        textInputType: 'textArea',
        type: 'text'
    },
    {
        question: 'What is your gender',
        userData: 'gender',
        label: 'Tell us your gender ',
        options: [
            {
                name: 'Gender plis',
                available: false,
                code: 'nth'
            },
            {
                name: 'male',
                available: true,
                code: 'male'
            },
            {
                name: 'female',
                available: true,
                code: 'female'
            }
        ],
        type: 'select'
    },
    {
        question: 'Everything is done. Ready to enter Utopia ? ',
        userData: 'submit',
        label: 'Please read our terms and conditions before entering the site.',
        buttonText: 'LESGOO!!!',
        type: 'button'
    }
];

const SelectComponent = ({
    id,
    setData,
    textData: data,
    isActive
}: InputComponentProps) => {
    const [selected, setSelected] = useState(
        data.options
            ? data.options[0]
            : { available: false, code: '', name: '' }
    );

    const toast = useToast();

    const validateInputAndMoveNext = useCallback(() => {
        // the selected value should be available

        // sometimes setState is still running when this function is called
        // To make sure the setData is working properly, we are calling it as
        // in the next event loop
        //
        // giving 0, shd work. But giving 500 coz im a pussy
        setTimeout(() => {
            if (!selected.available)
                return toast?.pushError('Select a valid option');

            return setData(selected.code);
        }, 500);
    }, [selected, setData, toast]);

    const listenForEnterKeyPress = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                validateInputAndMoveNext();
            }
        },
        [validateInputAndMoveNext]
    );

    useEffect(() => {
        if (isActive) {
            // console.log("adding event listener for select");
            window.addEventListener('keypress', listenForEnterKeyPress);
            return () => {
                process.env.NODE_ENV === 'development' &&
                    console.log('removing event listener');
                window.removeEventListener('keypress', listenForEnterKeyPress);
            };
        }
    }, [isActive, listenForEnterKeyPress]);

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
                            <span className="block truncate">
                                {selected.name}
                            </span>
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
                                {data?.options?.map(
                                    (selectOption, selectOptionIndex) => (
                                        <Listbox.Option
                                            key={selectOptionIndex}
                                            className={({ active }) =>
                                                `${
                                                    active
                                                        ? 'text-text bg-base'
                                                        : 'text-text'
                                                }  ${
                                                    selectOption.available
                                                        ? ''
                                                        : 'opacity-50'
                                                } text-lg  cursor-pointer select-none relative py-2 pl-10 pr-4 m-2 bg-background border-2 border-text hover:bg-gray-700`
                                            }
                                            value={selectOption}
                                            disabled={!selectOption.available}
                                        >
                                            {({ selected, active }) => (
                                                <>
                                                    <span
                                                        className={
                                                            `${
                                                                selected
                                                                    ? 'font-medium'
                                                                    : 'font-normal'
                                                            } ${
                                                                selectOption.available
                                                                    ? ''
                                                                    : 'opacity-50'
                                                            } block truncate` +
                                                            selectOption.img
                                                                ? 'flex justify-between items-center p-2'
                                                                : ''
                                                        }
                                                    >
                                                        <span>
                                                            {selectOption.name}
                                                        </span>
                                                        {selectOption.img ? (
                                                            <img
                                                                src={
                                                                    selectOption.img
                                                                }
                                                                alt={
                                                                    selectOption.img
                                                                }
                                                                width={30}
                                                                height={30}
                                                            />
                                                        ) : null}
                                                    </span>
                                                    {selected ? (
                                                        <span
                                                            className={`${
                                                                active
                                                                    ? 'text-text'
                                                                    : 'text-text '
                                                            }
				absolute inset-y-0 left-0 flex items-center pl-3 `}
                                                        >
                                                            <CheckIcon
                                                                className="w-5 h-5"
                                                                aria-hidden="true"
                                                            />
                                                        </span>
                                                    ) : null}
                                                </>
                                            )}
                                        </Listbox.Option>
                                    )
                                )}
                            </Listbox.Options>
                        </Transition>
                    </div>
                    {selected.img && selected.available ? (
                        <img
                            src={selected.img}
                            className="absolute"
                            alt={selected.img}
                            width={150}
                            height={150}
                            style={{ right: '-7.5%', top: '30%' }}
                        />
                    ) : null}
                </Listbox>
            </div>
            <br />
            <button
                className="inline-flex bg-accent1 rounded-sm text-text  font-bold tracking-widest text-sm align-top  px-2 py-0.5 mt-5 hover:bg-accent2"
                // make the element non-focusable
                tabIndex={-1}
                onClick={validateInputAndMoveNext}
            >
                <span className="pt-1">OK</span>
                <span
                    className="inline-block pl-1"
                    style={{
                        fontSize: '1.5rem',
                        paddingTop: '2.5px'
                        // width: "fit-content",
                    }}
                >
                    ✓
                </span>
            </button>
            <span className=" inline-block text-text pl-4 mt-3">
                Press{' '}
                <span className="font-bold">
                    Enter
                    <span
                        className="inline-block font-normal  pl-2 z-0"
                        style={{
                            fontSize: '1.5rem',
                            // transform: "translateY(1px)",
                            width: 'fit-content'
                        }}
                    >
                        &crarr;
                    </span>
                </span>
            </span>
        </div>
    );
};

const TextComponent = ({
    id,
    isActive,
    setData,
    textData
}: InputComponentProps) => {
    const [inputValue, setInputValue] = useState('');

    const toast = useToast();

    // Validates user input, and calls setData
    const validateInputAndMoveNext = useCallback(() => {
        // only check in text component is that,
        // it cannot be empty
        // console.log(inputValue);

        setTimeout(() => {
            console.log('inside timeout');
            if (!inputValue)
                return toast?.pushError('Enter a valid response !!');

            return setData(inputValue);
        }, 500);
    }, [toast, setData, inputValue]);

    const listenForEnterKeyPress = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                validateInputAndMoveNext();
            }
        },
        [validateInputAndMoveNext]
    );

    useEffect(() => {
        if (isActive) {
            // console.log("adding event listener for text component");
            window.addEventListener('keypress', listenForEnterKeyPress);
            return () => {
                process.env.NODE_ENV === 'development' &&
                    console.log('removing event listener');
                window.removeEventListener('keypress', listenForEnterKeyPress);
            };
        }
    }, [isActive, listenForEnterKeyPress]);

    return (
        <div className="element p-4">
            <h1 className="relative text-text text-2xl my-5">
                <span className="absolute text-lg pr-2 font-bold -left-12 top-0.5">
                    {id} &rarr;
                </span>
                <span>{textData.question}</span>
            </h1>
            <label
                htmlFor="username"
                className="block text-text text-lg my-3 opacity-75 mb-8"
            >
                {textData.label}
            </label>
            {textData.textInputType === 'input' ? (
                <input
                    type="text"
                    // id="username"
                    placeholder={textData.placeholder}
                    className="bg-transparent truncate text-text border-b-2 p-2 duration-150  border-opacity-25 text-3xl w-4/5 outline-none focus:border-opacity-100 focus:border-b-2 focus:bg-base focus:text-text"
                    onChange={(e) => setInputValue(e.target.value)}
                    autoFocus={isActive}
                />
            ) : (
                <input
                    type="text"
                    // id="username"
                    style={{ overflowWrap: 'break-word' }}
                    placeholder={textData.placeholder}
                    className="bg-transparent truncate text-text border-b-2 p-2 duration-150  border-opacity-25 text-xl w-4/5 outline-none focus:border-opacity-100 focus:border-b-2 focus:bg-base focus:text-text"
                    onChange={(e) => setInputValue(e.target.value)}
                    autoFocus={isActive}
                />
            )}
            <br />
            <button
                className="bg-accent1 text-text rounded-sm font-bold tracking-widest text-sm align-top  px-2 py-0.5 mt-5 hover:bg-accent2"
                // make the element non-focusable
                tabIndex={-1}
                onClick={validateInputAndMoveNext}
            >
                OK
                <span
                    className="inline-block pl-1"
                    style={{
                        fontSize: '1.5rem',
                        transform: 'translateY(3px)'
                        // width: "fit-content",
                    }}
                >
                    ✓
                </span>
            </button>
            <span className=" inline-block pl-4 mt-3 text-text">
                Press{' '}
                <span className="font-bold">
                    Enter
                    <span
                        className="inline-block font-normal  pl-2"
                        style={{
                            fontSize: '1.5rem',
                            transform: 'translateY(1px)',
                            width: 'fit-content'
                        }}
                    >
                        &crarr;
                    </span>
                </span>
            </span>
        </div>
    );
};

const ButtonComponent = ({
    isActive,
    setData,
    textData
}: InputComponentProps) => {
    // Validates user input, and calls setData
    const moveNext = useCallback(() => {
        return setData('');
    }, [setData]);

    const listenForEnterKeyPress = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                moveNext();
            }
        },
        [moveNext]
    );

    useEffect(() => {
        if (isActive) {
            // console.log("adding event listener for text component");
            window.addEventListener('keypress', listenForEnterKeyPress);
            return () => {
                process.env.NODE_ENV === 'development' &&
                    console.log('removing event listener');
                window.removeEventListener('keypress', listenForEnterKeyPress);
            };
        }
    }, [isActive, listenForEnterKeyPress]);

    // console.log("Creating button component");

    return (
        <div className="element p4">
            <div className="">
                <h1 className="relative text-text text-2xl my-14">
                    {/* Everything is done. Ready to enter Utopia ? */}
                    {textData.question}
                </h1>
                <p className="text-text text-base">
                    {/* Please read our terms and conditions before entering the site. */}
                    {textData.label}
                </p>
                <button
                    className="bg-accent1 rounded text-text font-bold text-lg align-top px-5 py-2.5 mt-12 hover:bg-accent2"
                    // make the element non-focusable
                    tabIndex={-1}
                    onClick={moveNext}
                >
                    {textData.buttonText}
                </button>
            </div>
        </div>
    );
};

export const Register = () => {
    const getAllElements = () => {
        console.log('getting all elements');
        const x = window.document.querySelectorAll('.element');
        console.log(x);
        return Array.from(x);
    };

    const { isLoggedIn, saveUser } = useContext(UserContext) || {};

    const history = useHistory();

    // This won't work, need to setAllElements manually inside useEffect : )
    const [allElements, setAllElements] = useState<Element[]>(getAllElements);
    const [currentActiveElement, setCurrentActiveElement] = useState(-1);
    // const [isNextButtonDisabled]

    const toast = useToast();

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
        // only happens in dev, and is annoying af
        allElements.forEach((e) => e.classList.remove('active'));
        allElements[0]?.classList.add('active');
        setCurrentActiveElement(0);

        for (let i = 1; i < allElements.length; i++) {
            allElements[i].classList.add('not-visited');
        }
    }, [allElements]);

    // Moves to the next element
    const nextElement = () => {
        if (currentActiveElement + 1 === allElements.length) return;

        allElements[currentActiveElement].classList.remove('active');
        allElements[currentActiveElement + 1].classList.add('active');
        allElements[currentActiveElement + 1].classList.remove('not-visited');
        setCurrentActiveElement((prev) => prev + 1);
    };

    // Moves to previous element
    const prevElement = () => {
        if (currentActiveElement === 0) return;

        allElements[currentActiveElement].classList.remove('active');
        allElements[currentActiveElement].classList.add('not-visited');
        allElements[currentActiveElement - 1].classList.add('active');
        setCurrentActiveElement((prev) => prev - 1);
    };

    const addEventListenerForKeyPress = (e: KeyboardEvent) => {
        // if the user presses Tab or Down Arrow, we move to the next element
        // !!! The element is not validated, only moved

        // Move to next element for => Tab and Down Arrow
        if (e.keyCode === 9 || e.keyCode === 40) {
            // preventing Tab key's default action
            e.preventDefault();
            nextElement();
        }

        // Move to Prev element for => Up Arrow
        if (e.keyCode === 38) prevElement();
    };

    useEffect(() => {
        window.addEventListener('keydown', addEventListenerForKeyPress);
        return () => {
            window.removeEventListener('keydown', addEventListenerForKeyPress);
        };
    });

    const [userData, setUserData] = useState<{
        username: string;
        department: string;
        description: string;
        gender: string;
    }>({
        username: '',
        department: '',
        description: '',
        gender: ''
    });

    const addDataAndProceed = (key: keyof typeof userData) => {
        return (value: string) => {
            console.log('the data is : ', value);
            setUserData((prevData) => {
                prevData[key] = value;
                return prevData;
            });
            nextElement();
        };
    };

    const startForm = () => {
        nextElement();
    };

    const endForm = () => {
        // Submit the form here
        submitForm();
    };

    const moveToElement = (index: number) => {
        allElements.forEach((elem, idx) => {
            if (idx < index) {
                elem.classList.remove('active');
                elem.classList.remove('not-visited');
            } else if (idx === index) {
                elem.classList.add('active');
                elem.classList.remove('not-visited');
            } else {
                elem.classList.remove('active');
                elem.classList.add('not-visited');
            }
        });
        setCurrentActiveElement(index);
    };

    const progress = () => {
        let ans = 0;
        for (const singleUserData in userData) {
            if ((userData as any)[singleUserData]) ans++;
        }

        ans *= 25;
        return `${ans}%`;
    };

    const verifyIfUserHasFilledAllDetails = () => {
        for (const singleFormElement of Object.keys(userData)) {
            if (!(userData as any)[singleFormElement]) {
                // that element has not been filled
                // loop through data array and focus that element
                formData.some((singleFormData, index) => {
                    if (singleFormData.userData === singleFormElement) {
                        moveToElement(index);
                        return true; // loop stops after returning true
                    }
                    return false;
                });
                return false;
            }
        }

        return true;
    };

    const postFormDataToServer = async () => {
        try {
            const resp = await axiosInstance.put('/api/user/signup', {
                user: userData
            });
            saveUser && saveUser(resp.data.user);
            history.push('/game');
        } catch (error) {
            toast?.pushError('Something went wrong try again later');
        }
    };

    const submitForm = async () => {
        if (!verifyIfUserHasFilledAllDetails()) {
            return toast?.pushInfo(
                'Answer all the questions before submitting the form'
            );
        }
        await postFormDataToServer();
    };

    if (!isLoggedIn) return <Redirect to="/auth/login" />;

    return (
        <div
            className="flex justify-center items-center min-h-screen "
            style={{
                backgroundImage: bgImage
            }}
        >
            <form
                className="relative w-3/5 bg-base overflow-hidden rounded"
                style={{ minHeight: '75vh', backgroundImage: bgImage }}
                onSubmit={(e) => {
                    e.preventDefault();
                    console.log('Hello world');
                }}
            >
                <div className="relative pt-0">
                    <div className="overflow-hidden h-2 text-xs flex  bg-base">
                        <div
                            style={{ width: progress() }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-accent1 transition-all"
                        ></div>
                    </div>
                </div>
                {formData.map((singleFormData, index) => {
                    if (singleFormData.type === 'text') {
                        return (
                            <TextComponent
                                id={index}
                                key={index}
                                setData={addDataAndProceed(
                                    singleFormData.userData as any
                                )}
                                isActive={index === currentActiveElement}
                                textData={singleFormData}
                            />
                        );
                    } else if (singleFormData.type === 'select') {
                        return (
                            <SelectComponent
                                id={index}
                                key={index}
                                setData={addDataAndProceed(
                                    singleFormData.userData as any
                                )}
                                isActive={index === currentActiveElement}
                                textData={singleFormData}
                            />
                        );
                    } else {
                        return (
                            <ButtonComponent
                                id={index + 1}
                                key={index}
                                isActive={index === currentActiveElement}
                                textData={singleFormData}
                                setData={(_: string) =>
                                    singleFormData.userData === 'start'
                                        ? startForm()
                                        : endForm()
                                }
                            />
                        );
                    }
                })}

                <button type="submit" hidden>
                    Submit
                </button>

                <div className="movement-dots absolute right-0 h-full w-10 flex flex-col justify-center align-center">
                    {formData.map((_, index) => {
                        if (index > 0 && index < formData.length - 1)
                            return (
                                <div
                                    className={clsx(
                                        'w-2.5 h-2.5 my-5 bg-accent2',
                                        index === currentActiveElement
                                            ? 'active'
                                            : ''
                                    )}
                                    key={index}
                                    onClick={() => moveToElement(index)}
                                ></div>
                            );
                        return <></>;
                    })}
                </div>

                {/* PREVIOUS BUTTON */}
                <div className="absolute right-20 bottom-10 font-thin">
                    <button
                        className={clsx(
                            'rounded-tl-md rounded-bl-sm bg-accent1 border-black hover:bg-accent2 ',
                            'border-r-2',
                            currentActiveElement === 0 ? 'hidden' : ''
                        )}
                        onClick={prevElement}
                        disabled={currentActiveElement === 0}
                        // hidden={currentActiveElement === 0}
                        type="button"
                        style={{
                            visibility:
                                currentActiveElement <= 1 ? 'hidden' : 'visible'
                        }}
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
                    {/* END OF PREVIOUS BUTTON */}

                    {/* NEXT BUTTON  */}
                    <button
                        className={clsx(
                            ' rounded-br-md rounded-tr-sm',
                            'bg-accent1 hover:bg-accent2'
                        )}
                        onClick={nextElement}
                        type="button"
                        disabled={
                            currentActiveElement >= allElements.length - 2 ||
                            currentActiveElement === 0
                        }
                        style={{
                            visibility:
                                currentActiveElement >=
                                    allElements.length - 2 ||
                                currentActiveElement === 0
                                    ? 'hidden'
                                    : 'visible'
                        }}
                        // hidden={currentActiveElement + 1 === allElements.length}
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
