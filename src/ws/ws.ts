import { throws } from 'assert';
import { isEqual } from 'lodash';

import { config } from '../config/config';
import { Queue } from '../utils/queue';

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
        | 'user-action'
        | 'move-response';
    Data: any;
}

const socketNotOpenedError = new Error('websocket connection is not opened');
const socketDisconnectedEvent = new Event('socket-disconnected');

// websocket wrapper, all the request, response will be handled here
export class WebsocketApi {
    readonly wsUrl = config.websocketUrl;
    socket: WebSocket;

    movementQueue = new Queue<upsertUser>();
    isSendingMovementRequest = false;
    room: string = '';

    //constructor will start the connection
    constructor() {
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
            document.dispatchEvent(disconnectEvent);
        };

        this.socket.onerror = () => {
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
                    process.env.NODE_ENV === 'development' &&
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
                    process.env.NODE_ENV === 'development' &&
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
                    process.env.NODE_ENV === 'development' &&
                        console.log('user-action', responseMessage.Data);
                    const userActionEvent = new CustomEvent<any>(
                        'ws-user-action',
                        {
                            detail: responseMessage.Data
                        }
                    );
                    document.dispatchEvent(userActionEvent);
                    break;

                // acknowledgement sent by server for updating user message
                case 'move-response':
                    if (response.status) {
                        // successful
                        // BUG: breaks in change room
                        setTimeout(
                            this.sendNewUserPositionToServerQueuer.bind(this),
                            1000 / config.tickRate
                        );
                    }
                    // if the queue is not empty, we send next position to user
                    break;

                default:
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
            this.isSendingMovementRequest = true;

            this.room = req.room;
            this.socket.send(JSON.stringify(requestMessage));

            const userRegisterEvent = new Event('user-register');
            document.dispatchEvent(userRegisterEvent);

            return;
        }
        document.dispatchEvent(socketDisconnectedEvent);
    };

    sendUserToServer(req: upsertUser) {
        console.log('sending request');
        if (this.socket.readyState === WebSocket.OPEN) {
            let requestMessage: requestMessageType = {
                messageType: 'user-move',
                data: req
            };
            this.isSendingMovementRequest = true;
            this.socket.send(JSON.stringify(requestMessage));

            return;
        }
        document.dispatchEvent(socketDisconnectedEvent);
    }

    // method to update push movement pos to queue
    moveUser = (req: upsertUser) => {
        if (!isEqual(this.movementQueue.tail, req)) {
            this.movementQueue.push(req);
        }
        if (!this.isSendingMovementRequest) {
            // when we are not sending request, we trigger a send
            this.sendNewUserPositionToServerQueuer();
        }
    };

    // pops from queue, and send that data to server
    sendNewUserPositionToServerQueuer = () => {
        let nextPosition: upsertUser | null;
        // do {
        nextPosition = this.movementQueue.pop();
        // } while (nextPosition && nextPosition.room !== this.room);
        if (!nextPosition) {
            this.isSendingMovementRequest = false;
            return;
        }
        this.sendUserToServer(nextPosition);
    };

    // method to switch map
    changeRoom = (req: changeRoom) => {
        if (this.socket.readyState === WebSocket.OPEN) {
            let requestMessage: requestMessageType = {
                messageType: 'change-room',
                data: req
            };

            this.socket.send(JSON.stringify(requestMessage));
            this.isSendingMovementRequest = false;
            this.movementQueue.clear();
            this.room = req.to;

            return;
        }

        throw socketNotOpenedError;
    };

    sendChatMessage = (req: chatMessage) => {
        if (this.socket.readyState === WebSocket.OPEN) {
            let requestMessage: requestMessageType = {
                messageType: 'chat-message',
                data: req
            };

            this.socket.send(JSON.stringify(requestMessage));

            return;
        }

        document.dispatchEvent(socketDisconnectedEvent);
    };

    // method to close connection
    close = () => {
        this.socket.close();
    };
}
