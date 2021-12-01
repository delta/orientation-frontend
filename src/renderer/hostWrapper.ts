import { hostConfigType } from './reconciler';
/**
 * A Wrapper around host config to track the hostConfig methods being called
 */
const hostConfigWrapper = (hostConfig: hostConfigType) => {
    let traceWrappedHostConfig = {};
    traceWrappedHostConfig = Object.keys(hostConfig).map((key) => {
        // @ts-ignore
        const func = hostConfig[key];
        // @ts-ignore
        return (...args) => {
            process.env.NODE_ENV === 'development' &&
                console.log('$', key, { ...args });
            return func(...args);
        };
    });
    return traceWrappedHostConfig as hostConfigType;
};

export { hostConfigWrapper };
