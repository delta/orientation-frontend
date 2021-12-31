import IChatUser from './IChatUser';

export default interface IMessage {
    id: number;
    from: IChatUser;
    room: string;
    text: string;
}
