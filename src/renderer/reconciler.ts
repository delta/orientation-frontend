import Reconciler, { HostConfig } from 'react-reconciler';

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
    getRootHostContext: (...args) => {},
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

const reconcilerInstance = Reconciler(hostConfig);

const customRenderer = {
    // render(element, renderDom, callback) {
    // 	// element: This is the react element for App component
    // 	// renderDom: This is the host root element to which the rendered app will be attached.
    // 	// callback: if specified will be called after render is done.
    // 	const isAsync = false; // Disables async rendering
    // 	const container = reconcilerInstance.createContainer(renderDom, isAsync); // Creates root fiber node.
    // 	const parentComponent = null; // Since there is no parent (since this is the root fiber). We set parentComponent to null.
    // 	reconcilerInstance.updateContainer(
    // 		element,
    // 		container,
    // 		parentComponent,
    // 		callback
    // 	); // Start reconcilation and render the result
    // },
};

export { reconcilerInstance };
