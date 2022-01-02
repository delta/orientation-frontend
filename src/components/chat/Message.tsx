import React from 'react';
import IMessage from './interfaces/IMessage';
import { getColor } from './utils/colors';

const Message: React.FC<{ message: IMessage }> = ({ message }) => {
    return (
        <div className="py-2 text-lg">
            <span className={`${getColor(message.id)} font-semibold pr-2`}>
                <span className="underline capitalize">{message.from}</span>:
            </span>
            {message.text}
        </div>
    );
};

export default Message;
