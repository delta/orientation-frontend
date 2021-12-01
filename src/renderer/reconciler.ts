import Reconciler, { HostConfig } from 'react-reconciler';
import { hostConfigWrapper } from './hostWrapper';

type Type = any;
type Props = any;
type Container = any;
type Instance = any;
type TextInstance = any;
type SuspenseInstance = any;
type HydratableInstance = any;
type PublicInstance = any;
type HostContext = any;
type UpdatePayload = any;
type _ChildSet = any;
type TimeoutHandle = any;
type NoTimeout = any;

const hostConfig: HostConfig<
    Type,
    Props,
    Container,
    Instance,
    TextInstance,
    SuspenseInstance,
    HydratableInstance,
    PublicInstance,
    HostContext,
    UpdatePayload,
    _ChildSet,
    TimeoutHandle,
    NoTimeout
> = {
    now: Date.now,
    getRootHostContext: (...args) => {
        console.log('hostConfig wrapper');
    },
    prepareForCommit: (...args) => {
        return null;
    },
    resetAfterCommit: (...args) => {},
    getChildHostContext: (...args) => {},
    shouldSetTextContent: (...args) => {
        return false;
    },
    createInstance: (...args) => {},
    createTextInstance: (...args) => {},
    appendInitialChild: (...args) => {},
    finalizeInitialChildren: (...args) => {
        return false;
    },
    supportsMutation: true,
    supportsPersistence: false,
    prepareUpdate: (...args) => {},
    getPublicInstance: (...args) => {},
    preparePortalMount: (...args) => {},
    scheduleTimeout: (...args) => {},
    cancelTimeout: (...args) => {},
    noTimeout: -1,
    isPrimaryRenderer: false,
    supportsHydration: false
};

// const reconcilerInstance = Reconciler(hostConfigWrapper(hostConfig));
const reconcilerInstance = Reconciler(hostConfig);

export type hostConfigType = typeof hostConfig;

export { reconcilerInstance };
