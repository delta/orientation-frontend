import { config } from '../config/config';

interface position {
    x: number;
    y: number;
    direction: string; // we can use any syntax for this
}

interface WUser {
    Id: string;
    Position: position;
}

interface upsertUser {
    room: string;
    position: position;
}

interface changeRoom {
    from: string;
    to: string;
    position: position;
}

interface chatMessage {
    message: string;
}

// ws request message type
interface requestMessageType {
    messageType: 'change-room' | 'user-move' | 'user-register' | 'chat-message';
    data: changeRoom | upsertUser | chatMessage;
}
// ws response message type
interface responseMessageType {
    MessageType:
        | 'new-user'
        | 'already-connected'
        | 'room-broadcast'
        | 'user-left'
        | 'users'
        | 'chat-message'
        | 'user-action';
    Data: any;
}

const socketNotOpenedError = new Error('websocket connection is not opened');
const socketDisconnectedEvent = new Event('socket-disconnected');

// websocket wrapper, all the request, response will be handled here
export class WebsocketApi {
    readonly wsUrl = config.websocketUrl;
    socket: WebSocket | undefined;
    interval: any;
    isRegistered: Boolean = false; // user registration status, move and change room shoild be done after registration

    //constructor will start the connection
    connect() {
        // connections event
        const connectEvent = new Event('ws-connected');
        const disconnectEvent = new Event('ws-disconnected');
        // response message custom event

        this.socket = new WebSocket(this.wsUrl);

        this.socket.onopen = () => {
            // dispatching 'ws-connected' event after connection is established
            console.log('socket connection opened!');
            document.dispatchEvent(connectEvent);
        };

        this.socket.onclose = () => {
            this.isRegistered = false;
            console.log('disconnected');
            document.dispatchEvent(disconnectEvent);
            console.log('trying to reconnect');
            this.interval = setInterval(this.reconnect.bind(this), 3000);
        };

        this.socket.onerror = () => {
            this.isRegistered = false;
            console.log('socket error');
            document.dispatchEvent(disconnectEvent);
        };

        this.socket.addEventListener('message', (event) => {
            let response = event.data;
            let responseMessage: responseMessageType = JSON.parse(response);

            switch (responseMessage.MessageType) {
                // ws connection will be closed by server after this response
                case 'already-connected':
                    const alreadyConnectedEvent = new CustomEvent<string>(
                        'ws-already-connected',
                        {
                            detail: responseMessage.Data as string
                        }
                    );

                    document.dispatchEvent(alreadyConnectedEvent);
                    break;
                // new user joined the room
                case 'new-user':
                    const newUserEvent = new CustomEvent<WUser>('ws-new-user', {
                        detail: responseMessage.Data as WUser
                    });

                    document.dispatchEvent(newUserEvent);
                    break;

                // all user postion in rendered map/room
                case 'room-broadcast':
                    const roomBroadcastsEvent = new CustomEvent<any>(
                        'ws-room-broadcasts',
                        {
                            detail: responseMessage.Data
                        }
                    );

                    document.dispatchEvent(roomBroadcastsEvent);

                    break;

                case 'user-left':
                    const roomLeftEvent = new CustomEvent<any>('ws-room-left', {
                        detail: JSON.parse(responseMessage.Data)
                    });
                    document.dispatchEvent(roomLeftEvent);
                    break;

                case 'users':
                    console.log('users', responseMessage.Data);

                    const connectedUsersEvent = new CustomEvent<any>(
                        'ws-connected-users',
                        {
                            detail: responseMessage.Data
                        }
                    );
                    document.dispatchEvent(connectedUsersEvent);
                    break;

                case 'chat-message':
                    console.log('chat-message', responseMessage.Data);
                    const chatMessageEvent = new CustomEvent<any>(
                        'ws-chat-message',
                        {
                            detail: responseMessage.Data
                        }
                    );
                    document.dispatchEvent(chatMessageEvent);
                    break;

                case 'user-action':
                    console.log('user-action', responseMessage.Data);
                    const userActionEvent = new CustomEvent<any>(
                        'ws-user-action',
                        {
                            detail: responseMessage.Data
                        }
                    );
                    document.dispatchEvent(userActionEvent);
                    break;

                default:
                    break;
            }
        });
    }

    // method to register user (i.e add user to map)
    registerUser = (req: upsertUser) => {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            let requestMessage: requestMessageType = {
                messageType: 'user-register',
                data: req
            };

            this.socket.send(JSON.stringify(requestMessage));

            this.isRegistered = true;

            return;
        }
        document.dispatchEvent(socketDisconnectedEvent);
    };

    // method to update user postion in map
    moveUser = (req: upsertUser) => {
        if (
            this.socket &&
            this.socket.readyState === WebSocket.OPEN &&
            this.isRegistered
        ) {
            let requestMessage: requestMessageType = {
                messageType: 'user-move',
                data: req
            };

            this.socket.send(JSON.stringify(requestMessage));

            return;
        }

        document.dispatchEvent(socketDisconnectedEvent);
    };

    // method to switch map
    changeRoom = (req: changeRoom) => {
        if (
            this.socket &&
            this.socket.readyState === WebSocket.OPEN &&
            this.isRegistered
        ) {
            let requestMessage: requestMessageType = {
                messageType: 'change-room',
                data: req
            };

            this.socket.send(JSON.stringify(requestMessage));

            return;
        }

        throw socketNotOpenedError;
    };

    sendChatMessage = (req: chatMessage) => {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            let requestMessage: requestMessageType = {
                messageType: 'chat-message',
                data: req
            };

            this.socket.send(JSON.stringify(requestMessage));

            return;
        }

        document.dispatchEvent(socketDisconnectedEvent);
    };

    reconnect = () => {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            console.log('reconnected');
            clearInterval(this.interval);
        } else if (this.socket && this.socket.readyState === WebSocket.CLOSED) {
            // trying to make a new connection
            console.log('connecting');
            this.connect();
        }
    };

    // method to close connection
    close = () => {
        this.socket?.close();
    };
}
