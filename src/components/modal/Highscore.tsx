import React from 'react';
import { clsx } from '../../utils/clsx';

interface singleHighScoreObject {
    spriteId: string;
    username: string;
    score: number;
    dept: string;
    name: string;
}

interface highScoreProps {
    userData?: singleHighScoreObject[];
    offset?: number;
}

const spriteIdMap: Record<string, string> = {
    1: '/favicon.ico'
};

export const HighScoreTable = (props: highScoreProps) => {
    return (
        <section className="antialiased relative h-4/5 my-5 py-5 bg-gray-100 text-gray-600 px-4">
            <div className="flex flex-col justify-center h-full">
                {/* <!-- Table --> */}
                <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-sm border border-gray-200">
                    <header className="px-5 py-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-800">
                            LeaderBoard
                        </h2>
                    </header>
                    <div className="p-3">
                        <div className="overflow-x-hidden">
                            <table className="table-auto w-full">
                                <thead className="text-xs font-semibold uppercase text-gray-400 bg-gray-50">
                                    <tr>
                                        <th className="p-2 whitespace-nowrap">
                                            <div className="font-semibold text-left">
                                                S. No
                                            </div>
                                        </th>
                                        <th className="p-2 whitespace-nowrap">
                                            <div className="font-semibold text-left">
                                                Username
                                            </div>
                                        </th>
                                        <th className="p-2 whitespace-nowrap">
                                            <div className="font-semibold text-left">
                                                Dept.
                                            </div>
                                        </th>
                                        <th className="p-2 whitespace-nowrap">
                                            <div className="font-semibold text-left">
                                                Score
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm divide-y divide-gray-100">
                                    {props?.userData?.map(
                                        (singleLeaderBoard, index) => {
                                            index =
                                                index +
                                                Number(props?.offset) +
                                                1;
                                            return (
                                                <tr key={index}>
                                                    <td className="p-2 whitespace-nowrap">
                                                        <div
                                                            className={`text-left font-medium ${
                                                                index === 1
                                                                    ? 'text-yellow-300'
                                                                    : index ===
                                                                      2
                                                                    ? 'text-gray-400'
                                                                    : index ===
                                                                      3
                                                                    ? 'text-yellow-800'
                                                                    : 'text-black'
                                                            }`}
                                                        >
                                                            {index}
                                                        </div>
                                                    </td>
                                                    <td className="p-2 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="w-10 h-10 flex-shrink-0 mr-2 sm:mr-3">
                                                                <img
                                                                    className="rounded-full"
                                                                    src={
                                                                        spriteIdMap[
                                                                            singleLeaderBoard
                                                                                .spriteId
                                                                        ]
                                                                    }
                                                                    width="40"
                                                                    height="40"
                                                                    alt={
                                                                        singleLeaderBoard.username
                                                                    }
                                                                />
                                                            </div>
                                                            <div
                                                                className={
                                                                    'font-medium '
                                                                }
                                                            >
                                                                {
                                                                    singleLeaderBoard.username
                                                                }
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-2 whitespace-nowrap">
                                                        <div className="text-left">
                                                            {
                                                                singleLeaderBoard.dept
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="p-2 whitespace-nowrap">
                                                        <div
                                                            className={
                                                                'text-lg text-left ' +
                                                                (index === 1
                                                                    ? 'text-yellow-300'
                                                                    : index ===
                                                                      2
                                                                    ? 'text-gray-400'
                                                                    : index ===
                                                                      3
                                                                    ? 'text-yellow-800'
                                                                    : 'text-black')
                                                            }
                                                        >
                                                            {singleLeaderBoard.score.toLocaleString()}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-center max-w-2xl mx-auto mt-5">
                <nav aria-label="Page navigation example">
                    <ul className="inline-flex -space-x-px">
                        <li>
                            <p
                                className={clsx(
                                    'bg-white border border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700',
                                    'ml-0 rounded-l-lg leading-tight py-2 px-3'
                                )}
                            >
                                Previous
                            </p>
                        </li>
                        <li>
                            <p
                                className={clsx(
                                    'bg-white border border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700',
                                    'leading-tight py-2 px-3'
                                )}
                            >
                                1
                            </p>
                        </li>
                        <li>
                            <p
                                className={clsx(
                                    'bg-white border border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700',
                                    'leading-tight py-2 px-3'
                                )}
                            >
                                2
                            </p>
                        </li>
                        <li>
                            <p
                                aria-current="page"
                                className={clsx(
                                    'bg-blue-50 border border-gray-300 text-blue-600',
                                    'hover:bg-blue-100 hover:text-blue-700',
                                    'py-2 px-3'
                                )}
                            >
                                3
                            </p>
                        </li>
                        <li>
                            <p
                                className={clsx(
                                    'bg-white border border-gray-300 text-gray-500 hover:bg-gray-100',
                                    'hover:text-gray-700 leading-tight py-2 px-3'
                                )}
                            >
                                4
                            </p>
                        </li>
                        <li>
                            <p
                                className={clsx(
                                    'bg-white border border-gray-300 text-gray-500',
                                    'hover:bg-gray-100 hover:text-gray-700 leading-tight py-2 px-3'
                                )}
                            >
                                5
                            </p>
                        </li>
                        <li>
                            <p
                                className={clsx(
                                    'bg-white border border-gray-300 text-gray-500',
                                    'hover:bg-gray-100 hover:text-gray-700 rounded-r-lg leading-tight py-2 px-3'
                                )}
                            >
                                Next
                            </p>
                        </li>
                    </ul>
                </nav>
            </div>
        </section>
    );
};
