import { hostConfigType } from './reconciler';
/**
 * A Wrapper around host config to track the hostConfig methods being called
 */
const hostConfigWrapper = (hostConfig: hostConfigType) => {
    let traceWrappedHostConfig = {};
    Object.keys(hostConfig).forEach((key) => {
        // @ts-ignore
        const func = hostConfig[key];
        // @ts-ignore
        traceWrappedHostConfig[key] = (...args) => {
            process.env.NODE_ENV === 'development' &&
                console.log('$', key, { ...args });
            return func(...args);
        };
    });
    console.log(traceWrappedHostConfig);
    return traceWrappedHostConfig as hostConfigType;
};

export { hostConfigWrapper };
