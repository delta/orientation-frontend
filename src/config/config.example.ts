export const config = {
    backendOrigin: 'http://localhost:8000',
    assetUrl: 'http://localhost:3000',
    websocketUrl: 'ws://localhost:8000/api/ws',
    livekitUrl: 'ws://localhost:7880',
    minigamesUrl: 'http://localhost:3000',
    tickRate: 2,
    isDev: true,
    dauth: {
        clientId: '',
        redirectURI: 'http://localhost:3000/auth-callback.html'
    }
};
