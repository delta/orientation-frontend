import { createContext } from 'react';
import { WebsocketApi } from '../ws/ws';

export const WsContext = createContext<WebsocketApi | null | undefined>(null);
