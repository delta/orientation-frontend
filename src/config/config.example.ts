export const config = {
    backendOrigin: 'http://localhost:8000',
    assetUrl: 'http://localhost:3000',
    websocketUrl: 'ws://localhost:8000/api/ws',
    tickRate: 2,
    isDev: true,
    dauth: {
        clientId: '',
        redirectURI: 'http://localhost:3000/auth-callback.html'
    }
};
