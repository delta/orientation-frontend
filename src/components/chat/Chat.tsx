import { useContext, useState } from 'react';
import ChatRoom from './ChatRoom';
import { UserContext } from '../../contexts/userContext';
import { WebsocketApi } from '../../ws/ws';
import { clsx } from '../../utils/clsx';

const Chat: React.FC<{ ws: WebsocketApi | undefined }> = ({ ws }) => {
    const [showChat, changeDisp] = useState('');
    const userContext = useContext(UserContext);

    // TODO: Hacky lines
    if (userContext == null || userContext.user == null) return <></>;
    const toggleVc = (option: string) => {
        if (option === 'open') {
            changeDisp('');
        } else {
            changeDisp('hidden');
        }
    };
    const user = userContext.user;

    const ToggleButton = (data: string) => {
        const style =
            data === 'open'
                ? {
                      transform: 'rotate(270deg)',
                      right: '-1%',
                      top: '10%'
                  }
                : {
                      transform: 'rotate(270deg)',
                      left: '-11%',
                      top: '10%'
                  };
        return (
            <div
                className={clsx(
                    'absolute bg-accent2 px-3 py-2',
                    'text-black cursor-pointer hover:bg-accent1',
                    'font-semibold z-50 rounded-t-lg'
                )}
                style={style}
                onClick={() => {
                    toggleVc(data);
                }}
            >
                {data === 'open' ? 'Show Chat' : 'Hide Chat'}
            </div>
        );
    };

    if (typeof ws === 'undefined') return <></>;

    return showChat === '' ? (
        <div className={'w-1/4 text-text relative' + showChat}>
            {showChat ? ToggleButton('open') : ToggleButton('hidden')}
            <div className={'h-screen flex flex-col' + showChat}>
                <ChatRoom user={user} sendMessage={ws.sendChatMessage} />
            </div>
        </div>
    ) : (
        <div className="">{ToggleButton('open')}</div>
    );
};

export default Chat;
