export const colors = [
    'text-slate-500',
    'text-gray-500',
    'text-zinc-500',
    'text-neutral-500',
    'text-red-500',
    'text-orange-500',
    'text-amber-500',
    'text-yellow-500',
    'text-lime-500',
    'text-green-500',
    'text-emerald-500',
    'text-teal-500',
    'text-cyan-500',
    'text-sky-500',
    'text-blue-500',
    'text-indigo-500',
    'text-violet-500',
    'text-purple-500',
    'text-fuschia-500',
    'text-pink-500',
    'text-rose-500'
];

export const getColor = (id: number) => {
    console.log(colors[id % colors.length]);
    return colors[id % colors.length];
};
