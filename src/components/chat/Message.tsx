import React from 'react';
import IMessage from './interfaces/IMessage';
import { getColor } from './utils/colors';

const Message: React.FC<{ message: IMessage }> = ({ message }) => {
    return (
        <div>
            <span className={`${getColor(message.from.id)} mr-2`}>
                {message.from.name}:
            </span>
            {message.text}
        </div>
    );
};

export default Message;
