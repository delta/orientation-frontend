import React from 'react';
import IMessage from './interfaces/IMessage';
import { getColor } from './utils/colors';

const Message: React.FC<{ message: IMessage }> = ({ message }) => {
    return (
        <div className="py-2 text-lg"
        style={
            {
                wordWrap: 'break-word',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                overflowX: 'hidden',
            }                
        }
        >
            <span className={`${getColor(message.id)} font-semibold pr-2`}>
                <span className="underline capitalize">
                    {message.from.name}
                </span>
                :
            </span>
            {message.text}
        </div>
    );
};

export default Message;
