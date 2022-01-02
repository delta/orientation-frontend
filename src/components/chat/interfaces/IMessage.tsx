import IChatUser from './IChatUser';

export default interface IMessage {
    id: number;
    from: IChatUser | string;
    room: string;
    text: string;
}
