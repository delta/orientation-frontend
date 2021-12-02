import Reconciler, { HostConfig } from 'react-reconciler';
import { Game } from 'phaser';

import { hostConfigWrapper } from './hostWrapper';

type ReactElement = Element | Document;
type Type = any;
type Props = any;
type Container = Game;
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
    // similar to date.now but react version of it
    now: performance.now,
    // proxying it to setTimeout
    scheduleTimeout: setTimeout,
    // proxy to clear timeout coz they are essentially the same
    cancelTimeout: clearTimeout,
    noTimeout: -1,

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

    // we are only using this renderer for the phaser, we are still
    // using ReactDOM as our primary renderer
    isPrimaryRenderer: false,
    supportsHydration: false,
    clearContainer: (...args) => {}
};

const reconcilerInstance = Reconciler(hostConfigWrapper(hostConfig));

export type hostConfigType = typeof hostConfig;

export { reconcilerInstance };
