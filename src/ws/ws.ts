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

// ws request message type
interface requestMessageType {
    messageType: 'change-room' | 'user-move' | 'user-register';
    data: changeRoom | upsertUser;
}
// ws response message type
interface responseMessageType {
    MessageType: 'new-user' | 'already-connected' | 'room-broadcast';
    Data: string | WUser;
}

const socketNotOpenedError = new Error('websocket connection is not opened');

// websocket wrapper, all the request, response will be handled here
export class WebsocketApi {
    readonly wsUrl = config.websocketUrl;
    socket: WebSocket;

    //constructor will start the connection
    constructor() {
        // connections event
        const connectEvent = new Event('ws-connected');
        const disconnectEvent = new Event('ws-disconnected');

        // response message custom event

        this.socket = new WebSocket(this.wsUrl);

        this.socket.onopen = () => {
            console.log('socket connection opened!');
            // dispatching 'ws-connected' event after connection is established
            document.dispatchEvent(connectEvent);
        };

        this.socket.onclose = () => {
            console.log('connection closed by server');

            document.dispatchEvent(disconnectEvent);
        };

        this.socket.onerror = () => {
            console.log('socket error, reconnect');

            document.dispatchEvent(disconnectEvent);
        };

        this.socket.addEventListener('message', (event) => {
            let response = event.data;
            let responseMessage: responseMessageType = JSON.parse(response);

            switch (responseMessage.MessageType) {
                // ws connection will be closed by server after this response
                case 'already-connected':
                    console.log('already-connected', responseMessage.Data);
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
                    console.log('new-user', responseMessage.Data);

                    const newUserEvent = new CustomEvent<WUser>('ws-new-user', {
                        detail: responseMessage.Data as WUser
                    });

                    document.dispatchEvent(newUserEvent);
                    break;

                // all user postion in rendered map/room
                case 'room-broadcast':
                    console.log(
                        'room-broadcast',
                        JSON.parse(responseMessage.Data as string)
                    );
                    const roomBroadcastsEvent = new CustomEvent<WUser[]>(
                        'ws-room-broadcasts',
                        {
                            detail: JSON.parse(responseMessage.Data as string)
                        }
                    );

                    document.dispatchEvent(roomBroadcastsEvent);

                    break;

                default:
                    console.log('other response', responseMessage);
                    break;
            }
        });
    }

    // method to register user (i.e add user to map)
    registerUser = (req: upsertUser) => {
        if (this.socket.readyState === WebSocket.OPEN) {
            let requestMessage: requestMessageType = {
                messageType: 'user-register',
                data: req
            };

            console.log('register user');
            this.socket.send(JSON.stringify(requestMessage));

            return;
        }
        throw socketNotOpenedError;
    };

    // method to update user postion in map
    moveUser = (req: upsertUser) => {
        if (this.socket.readyState === WebSocket.OPEN) {
            let requestMessage: requestMessageType = {
                messageType: 'user-move',
                data: req
            };

            console.log('move user');
            this.socket.send(JSON.stringify(requestMessage));

            return;
        }

        throw socketNotOpenedError;
    };

    // method to switch map
    changeRoom = (req: changeRoom) => {
        if (this.socket.readyState === WebSocket.OPEN) {
            let requestMessage: requestMessageType = {
                messageType: 'change-room',
                data: req
            };

            console.log('change room');
            this.socket.send(JSON.stringify(requestMessage));

            return;
        }

        throw socketNotOpenedError;
    };

    // method to close connection
    close = () => {
        console.log('close ws connection');
        this.socket.close();
    };
}
