import { Disclosure, Tab } from '@headlessui/react';
import { ChevronUpIcon } from '@heroicons/react/solid';

import { HighScoreTable } from './Highscore';
import { clsx } from '../../utils/clsx';
import { axiosInstance } from '../../utils/axios';

export const MiniGame2048 = () => {
    const getLeaderboard = async (page: number) => {
        try {
            const resp = await axiosInstance.get('/api/leaderboard/' + page);

            /**
             * Resp format
             * - current page
             * - total pages
             * - leaderBoard {
             *      - username
             *      - spriteId
             *      - score
             *      - dept
             * }
             */
        } catch (err) {}
    };

    const fakeLeaderboardData = [
        {
            username: 'aabce',
            name: 'aabce',
            spriteId: '1',
            dept: 'ABC',
            score: 46201
        },
        {
            username: 'aabce2',
            name: 'aabce',
            spriteId: '1',
            dept: 'ABC',
            score: 46201
        },
        {
            username: 'aabce3',
            name: 'aabce',
            spriteId: '1',
            dept: 'ABC',
            score: 46201
        },
        {
            username: 'aabce4',
            name: 'aabce',
            spriteId: '1',
            dept: 'ABC',
            score: 46201
        }
    ];

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
                            width={45 * 16}
                            height={450}
                            src="minigames/2048"
                            title="minigames/2048"
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
                                        Use your <strong>arrow keys</strong> to
                                        move the tiles. When two tiles with the
                                        same number touch, they{' '}
                                        <strong>merge into one!</strong>
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
                            <HighScoreTable
                                userData={fakeLeaderboardData}
                                offset={0}
                            />
                        </div>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
        </div>
    );
};
