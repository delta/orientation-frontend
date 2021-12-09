import Reconciler, { HostConfig } from 'react-reconciler';
import { Game } from 'phaser';

import { hostConfigWrapper } from './hostWrapper';
import { invariant } from '../utils/invariant';
import { clsx } from '../utils/clsx';

// type ReactElement = Element | Document;
type Type = any;
type Props = any;
type Container = Game;
type Instance = any;
type TextInstance = any;
type SuspenseInstance = any;
type HydratableInstance = any;
type PublicInstance = any;
type HostContext = Game | string;
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

    // can nodes(game objects in our case) be added (appended) and removed to the tree => TRUE (in our case)
    supportsMutation: true,
    supportsPersistence: false,

    // we are only using this renderer for the phaser, we are still
    // using ReactDOM as our primary renderer
    isPrimaryRenderer: false,
    supportsHydration: false,

    // this function lets us share the initial host context, (aka the Phaser Game Object)
    // Since we ned the Phaser Game Object down the line, we are passing it down to the component tree
    getRootHostContext: (rootContainer) => {
        return rootContainer;
    },

    // Lets us store some information about the tree (eg react-dom stores data about the current text selection)
    // before the actual re-render takes place (rn, the new tree has been generated in-memory)
    // if we want to restore some state of the game, we return from this function and
    // restore it in this function's counter part resetAfterCommit
    //
    //
    // ?? not able to receive the object returned here inside resetAfterCommit, so need to figure out how to do it
    prepareForCommit: (rootContainer) => {
        return null;
    },
    // this function is called after the in-memory tree has been attached rendered / attached to the actual tree
    // here we can restore some state of the game, returned from prepareForCommit
    // right now we dont any state we have to manage
    //
    resetAfterCommit: (rootInstance) => {
        return;
    },
    // This function provides a way to access context from the parent and also a way to
    // pass some context to the immediate children of the current node.
    // Here we just want to know if the parent is a Phaser object or DOM Element
    //
    getChildHostContext: (parentContext, type, rootContainer) => {
        if (type === 'gameObject') return 'PHASER';
        else return 'DOM';
    },
    // According to the docs, some Some target platforms support setting an instance's text
    // content without manually creating a text node. For example, in the DOM,
    // you can set node.textContent instead of creating a text node and appending it.
    //
    // If the function returns true, the text would be created inside the host element and
    // no new text element would be created separately.
    //
    // If it returns false, getChildHostContext and shouldSetTextContent will be called
    // on the child elements and it will continue till shouldSetTextContent returns true
    // or if the recursion reaches the last tree endpoint which usually is a text node.
    // When it reaches the last leaf text node it will call createTextInstance
    //
    // Since we do not want to create textNodes, we return false
    shouldSetTextContent: (...args) => {
        return false;
    },
    createInstance: (...args) => {},
    // we are not creating a text instance inside a phaser component inside our phaser game
    // so we throw an error when this function is called
    createTextInstance: (text, rootContainer, hostContext, fiberNode) => {
        // Creating text components inside of
        hostContext === 'PHASER' &&
            invariant(
                false,
                clsx(
                    'Text objects cannot be created inside a Phaser Component.',
                    'Use <Text /> Component instead.'
                )
            );
    },
    appendInitialChild: (...args) => {},
    finalizeInitialChildren: (...args) => {
        return false;
    },
    prepareUpdate: (...args) => {},
    getPublicInstance: (...args) => {},
    preparePortalMount: (...args) => {},
    // shdould create the root container, since our container is GameObject,
    // we dont have to do anything
    clearContainer: (container) => {
        return;
    },

    // ++++++++++++++++++++++++++++++++
    // -------MUTATION METHODS---------
    // ++++++++++++++++++++++++++++++++

    appendChildToContainer(...args) {},
    removeChildFromContainer(...args) {}
};

const reconcilerInstance = Reconciler(hostConfigWrapper(hostConfig));

export type hostConfigType = typeof hostConfig;

export { reconcilerInstance };
