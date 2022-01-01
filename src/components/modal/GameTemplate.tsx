import { Disclosure, Tab } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/solid';

import { HighScoreTable } from './Highscore';
import { clsx } from '../../utils/clsx';
import { axiosInstance } from '../../utils/axios';
import { useEffect, useState } from 'react';
import { CONSTANTS } from '../../config/constants';
interface GameTemplateProps {
    gameProps: {
        name: string;
        width: number;
        height: number;
        description: string;
        madeBy: string;
        liscense: string;
        repo: string;
    };
}

export const GameTemplate = (props: GameTemplateProps) => {
    const [leaderBoardData, setLeaderBoardData] = useState<
        {
            username: string;
            name: string;
            spriteName: string;
            dept: string;
            score: number;
        }[]
    >([]);

    const { name, width, height, description } = props.gameProps;

    const getLeaderboard = async (minigame: string) => {
        try {
            const leaderBoardResp = await axiosInstance.get(
                `/api/leaderboard/${minigame}`
            );
            // we are fetching user data again, w
            // as the data in localstorage might not be up to date
            // console.log('got leaderboard data : ', leaderBoardResp);
            const userMapData = await axiosInstance.get('/api/user/map');
            // console.log('usermap data : ', userMapData);

            if (leaderBoardResp.status === 200 && userMapData.status === 200) {
                // console.log('parsing user data');
                const userMap = {};
                userMapData.data.userMap.forEach((user: any) => {
                    //@ts-ignore
                    userMap[user.userId] = user;
                });

                const allLeaderBoardData: any[] =
                    leaderBoardResp.data.leaderboard.map((l: any) => {
                        return {
                            name: l.name,
                            username: l.username,
                            spriteName: (userMap as any)[l.id].spriteType,
                            dept: l.department,
                            score: l.score
                        };
                    });

                setLeaderBoardData(allLeaderBoardData);
            }
        } catch (err) {}
    };

    useEffect(() => {
        getLeaderboard(name);
    }, []);

    return (
        <div>
            <Tab.Group>
                <Tab.List className="flex p-1 space-x-1 bg-blue-900/20 rounded-xl">
                    <Tab
                        key="game"
                        className={({ selected }) =>
                            clsx(
                                'w-full py-2.5 text-sm leading-5 font-medium rounded-lg ',
                                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
                                selected
                                    ? 'bg-accent1 shadow  text-white'
                                    : ' text-black hover:text-white bg-gray-300 hover:bg-accent2'
                            )
                        }
                    >
                        Game
                    </Tab>
                    <Tab
                        key="highscore"
                        className={({ selected }) =>
                            clsx(
                                'w-full py-2.5 text-sm leading-5 font-medium rounded-lg ',
                                'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
                                selected
                                    ? ' shadow bg-accent1 text-white'
                                    : ' text-black hover:text-white bg-gray-300 hover:bg-accent2'
                            )
                        }
                    >
                        HighScore
                    </Tab>
                </Tab.List>
                <Tab.Panels className="mt-2">
                    <Tab.Panel
                        key="game"
                        className={clsx(
                            'bg-white rounded-xl p-3',
                            'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60'
                        )}
                    >
                        <iframe
                            width={width}
                            height={height}
                            src={`minigames/${name}/index.html`}
                            title={`minigames/${name}`}
                        ></iframe>
                        <Disclosure>
                            {({ open }) => (
                                <>
                                    <Disclosure.Button
                                        className={clsx(
                                            'flex justify-between w-full px-4 py-2 text-sm mt-5',
                                            ' font-medium text-left text-black bg-green-100 ',
                                            'rounded-lg hover:bg-green-200 focus:outline-none focus-visible:ring',
                                            'focus-visible:ring-purple-500 focus-visible:ring-opacity-75'
                                        )}
                                    >
                                        <span>How to play?</span>
                                        <ChevronUpIcon
                                            className={`${
                                                open
                                                    ? 'transform rotate-180'
                                                    : ''
                                            } w-5 h-5 text-black`}
                                        />
                                    </Disclosure.Button>
                                    <Disclosure.Panel
                                        className="px-4 pt-4 pb-2 text-sm text-gray-500"
                                        style={{ width: '500px' }}
                                    >
                                        {description}
                                    </Disclosure.Panel>
                                </>
                            )}
                        </Disclosure>
                        <Disclosure>
                            {({ open }) => (
                                <>
                                    <Disclosure.Button
                                        className={clsx(
                                            'flex justify-between w-full px-4 py-2 text-sm mt-2',
                                            ' font-medium text-left text-black bg-green-100 ',
                                            'rounded-lg hover:bg-green-200 focus:outline-none focus-visible:ring',
                                            'focus-visible:ring-purple-500 focus-visible:ring-opacity-75'
                                        )}
                                    >
                                        <span>Credits</span>
                                        <ChevronUpIcon
                                            className={`${
                                                open
                                                    ? 'transform rotate-180'
                                                    : ''
                                            } w-5 h-5 text-black`}
                                        />
                                    </Disclosure.Button>
                                    <Disclosure.Panel
                                        className="px-4 pt-4 pb-2 text-sm text-gray-500"
                                        style={{ width: '500px' }}
                                    >
                                        <table className=" border-collapse">
                                            <tr>
                                                <td className="underline pr-8">
                                                    {' '}
                                                    MADE BY
                                                </td>
                                                <td className="">
                                                    : {props.gameProps.madeBy}
                                                </td>
                                            </tr>
                                            <tr className="pt-5">
                                                <td className="underline pr-8">
                                                    {' '}
                                                    CHECK THEM OUT
                                                </td>
                                                <td>
                                                    :{'    '}
                                                    <a
                                                        href={
                                                            props.gameProps.repo
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 underline"
                                                    >
                                                        Link
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </Disclosure.Panel>
                                </>
                            )}
                        </Disclosure>
                    </Tab.Panel>
                    <Tab.Panel
                        key="highscore"
                        className={clsx(
                            'bg-white rounded-xl p-3',
                            'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60'
                        )}
                    >
                        <div
                            style={{
                                width: 45 * 16 + 'px',
                                minHeight: '500px'
                            }}
                        >
                            <HighScoreTable userData={leaderBoardData} />
                        </div>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
};
