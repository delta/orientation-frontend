import React, { useEffect, useMemo, useState } from 'react';
import { clsx } from '../../utils/clsx';

interface singleHighScoreObject {
    spriteName: string;
    username: string;
    score: number;
    dept: string;
    name: string;
}

interface highScoreProps {
    userData: singleHighScoreObject[];
}

const spriteIdMap: Record<string, string> = {
    player: '/favicon.ico',
    male: '/sprites/preview/male.png',
    male2: '/sprites/preview/male2.png',
    female: '/sprites/preview/female.png',
    female2: '/sprites/preview/female2.png'
};

export const HighScoreTable = (props: highScoreProps) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);
    const [activeElements, setActiveElements] = useState<
        singleHighScoreObject[]
    >([]);

    useEffect(() => {
        setCurrentPage(1);
        setTotalPage(Math.ceil(props.userData.length / 10));
    }, [props.userData.length]);

    useEffect(() => {
        let end = currentPage * 10;

        const data = props.userData.slice(end - 10, end);
        setActiveElements(data);
    }, [currentPage, props.userData]);

    const Pages = useMemo(() => {
        let data: JSX.Element[] = [];
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
            if (i <= 0) continue;
            if (i > totalPage) break;
            let temp = (
                <li>
                    <p
                        className={clsx(
                            'bg-white border border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700',
                            'leading-tight py-2 px-3 cursor-pointer',
                            i === currentPage
                                ? 'text-accent1 bg-green-300 bg-opacity-25 cursor-default'
                                : ''
                        )}
                        onClick={() => {
                            if (i === currentPage) return;
                            setCurrentPage(i);
                        }}
                        key={i}
                    >
                        {i}
                    </p>
                </li>
            );
            data.push(temp);
        }
        return data;
    }, [currentPage, totalPage]);

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
                                                Name
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
                                    {activeElements.map(
                                        (singleLeaderBoard, index) => {
                                            index =
                                                index +
                                                1 +
                                                (currentPage - 1) * 10;
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
                                                                                .spriteName
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
                                                                <span className="text-gray-500 font-normal text-xs pl-1">
                                                                    (
                                                                    {
                                                                        singleLeaderBoard.name
                                                                    }
                                                                    )
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-2 whitespace-nowrap">
                                                        <div className="text-left">
                                                            {singleLeaderBoard.dept ||
                                                                '-'}
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
                                    'bg-white border border-gray-300 text-gray-500 hover:bg-gray-100 hover:text-gray-700 cursor-pointer',
                                    'ml-0 rounded-l-lg leading-tight py-2 px-3',
                                    currentPage === 1 ? 'hidden' : ''
                                )}
                                onClick={() =>
                                    setCurrentPage((prevPage) => prevPage - 1)
                                }
                            >
                                Previous
                            </p>
                        </li>
                        {Pages}
                        <li>
                            <p
                                className={clsx(
                                    'bg-white border border-gray-300 text-gray-500 cursor-pointer',
                                    'hover:bg-gray-100 hover:text-gray-700 rounded-r-lg leading-tight py-2 px-3',
                                    currentPage === totalPage ? 'hidden' : ''
                                )}
                                onClick={() =>
                                    setCurrentPage((prevPage) => prevPage + 1)
                                }
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
