import { useContext, useState } from 'react';
import clockTower from '../../assets/images/AdminBlock_no_bg.png';
import deltaLogo from '../../assets/images/deltaLogoWhite.png';
import styles from './login.module.css';
import { config } from '../../config/config';
import { UserContext } from '../../contexts/userContext';
import { Redirect, useHistory } from 'react-router-dom';

const DAuthLogin = () => {
    const history = useHistory();
    const [rollNo, setRollNo] = useState('');
    const { loading, isLoggedIn, saveUser } = useContext(UserContext) || {};
    const dummyLogin = async (r: string) => {
        console.log(r);
        const res = await fetch(`${config.backendOrigin}/api/auth/dummyLogin`, {
            method: 'POST',
            mode: 'cors',
            body: JSON.stringify({ roll: r }),
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const json = await res.json();
        console.log(json);
        saveUser &&
            saveUser({
                department: '',
                email: '',
                gender: '',
                isNewUser: true,
                id: r as any,
                name: '',
                description: '',
                username: ''
            });
        history.push('/auth/register');
    };

    if (loading) return <></>;

    if (isLoggedIn) return <Redirect to="/game" />;

    return (
        <div className="min-w-screen min-h-screen flex items-center justify-center px-5 py-5">
            <div className="bg-base text-gray-500 rounded shadow-2xl py-5 px-5 w-3/4 h-3/4">
                <div className="flex items-center relative">
                    <div
                        className="pl-10 h-4/5 py-10 w-1/2 flipInX"
                        // style={{ border: "1px solid white" }}
                    >
                        <h1 className=" text-text text-4xl font-bold">
                            Login To
                            <div
                                className={
                                    styles.slidingVertical +
                                    ' inline text-accent1'
                                }
                            >
                                <span>Utopia.</span>
                                {config.isDev ? <span>D-Auth.</span> : <></>}
                            </div>
                        </h1>

                        <p className=" text-text my-14 text-lg">
                            DAuth is a one stop auth portal for Delta. Once you
                            create an account on Dauth, you can use it to Login
                            to every App made by Delta.
                        </p>
                        {config.isDev && (
                            <>
                                <input
                                    type="number"
                                    onChange={(e) => setRollNo(e.target.value)}
                                />
                                <br />
                                <button
                                    className="flex justify-between items-center bg-accent1 p-4 w-48 rounded-lg text-lg font-bold text-white mt-2 hover:bg-accent2"
                                    onClick={() => {
                                        dummyLogin(rollNo);
                                    }}
                                >
                                    Submit
                                </button>
                            </>
                        )}
                        {!config.isDev && (
                            <div className={styles.slidingVertical + ' h-20'}>
                                <span>
                                    <a href="/auth/callback">
                                        <button className="flex justify-between items-center bg-accent1 p-4 rounded-lg text-lg font-bold text-white mt-2 hover:bg-accent2">
                                            Start The Journey
                                        </button>
                                    </a>
                                </span>
                                <span>
                                    <a href="/auth/callback">
                                        <button className="flex justify-between items-center bg-accent1 p-4 w-48 rounded-lg text-lg font-bold text-white mt-2 hover:bg-accent2">
                                            Login With
                                            <img
                                                src={deltaLogo}
                                                alt="your mom"
                                                className="w-7"
                                            />
                                        </button>
                                    </a>
                                </span>
                            </div>
                        )}
                    </div>
                    <div
                        className="h-4/6 w-1/2 justify-center justify-items-center"
                        // style={{ border: "transform: translate(-10px, 0px);" }}
                    >
                        <img
                            src={clockTower}
                            alt=""
                            className={'h-full ' + styles.clockTower}
                        />
                        <p className="text-xl text-center font-bold text-accent2">
                            Clock Tower
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export { DAuthLogin };
