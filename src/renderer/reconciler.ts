import Reconciler, { HostConfig } from 'react-reconciler';
import { Game, GameObjects } from 'phaser';
import { isEqual } from 'lodash';

import { hostConfigWrapper } from './hostWrapper';
import { invariant } from '../utils/invariant';
import { clsx } from '../utils/clsx';
import { GameElements } from '../Phaser/GameObjects/elements/types';
import { updateData } from '../Phaser/GameObjects/elements/updateGameObject';
import { GameObjectComponentType } from '../Phaser/GameObjects/GameObject';

// type ReactElement = Element | Document;
type Type = string; // type This contains the type of fiber i.e, ‘div’, ‘span’, ‘p’, ‘input’ etc.
type Props = GameObjectComponentType | any; // props of the element (usually an object)
type Container = Game;
type Instance = GameElements.FiberGameObject | any;
type TextInstance = any;
type SuspenseInstance = any;
type HydratableInstance = any;
type PublicInstance = any;
type HostContext = Game | string;
type UpdatePayload = any; // return data of prepareUpdate
type _ChildSet = any;
type TimeoutHandle = any;
type NoTimeout = any;

type UpdatePayloadType = { propName: string; old: any; new: any }[];
const updatePayload = (
    oldProps: GameObjectComponentType,
    newProps: GameObjectComponentType
) => {
    const updatePayload: UpdatePayloadType = [];

    if (isEqual(oldProps, newProps)) return null;

    for (const key of Object.keys(oldProps.data)) {
        // if the prop has been removed
        if ((newProps.data as any)[key] === undefined)
            updatePayload.push({
                propName: key,
                old: (oldProps.data as any)[key],
                new: null
            });
        else if (
            !isEqual((oldProps.data as any)[key], (newProps.data as any)[key])
        )
            updatePayload.push({
                propName: key,
                old: (oldProps.data as any)[key],
                new: (newProps.data as any)[key]
            });
    }
    return updatePayload;
};

const commitPayload = (
    type: GameElements.AllowedGameObjectTypes,
    instance: GameObjects.GameObject,
    payload: UpdatePayloadType
) => {
    const updateFunction = updateData[type];
    payload.forEach((p) => {
        const updateInstance = updateFunction(p.propName);
        console.log(updateInstance);
        updateInstance(instance, p.new);
    });
    // console.log(type);
    // // updateFunction.bind(instance);
    // console.log(updateFunction);
    // const update = updateFunction('x');
    // console.log(update);
    // console.log(update(instance));
    // const x = update(instance);
    // // (instance as any).setX(35);
    // console.log(x(45));
};

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
    /**
     *
     * According to the docs, some Some target platforms support setting an instance's text
     * content without manually creating a text node. For example, in the DOM,
     * you can set node.textContent instead of creating a text node and appending it.
     *
     * If the function returns true, the text would be created inside the host element and
     * no new text element would be created separately.
     *
     * If it returns false, getChildHostContext and shouldSetTextContent will be called
     * on the child elements and it will continue till shouldSetTextContent returns true
     * or if the recursion reaches the last tree endpoint which usually is a text node.
     * When it reaches the last leaf text node it will call createTextInstance
     *
     * Since we do not want to create textNodes, we return false
     * @param type contains the type of the fiber
     * @param props props of the element
     * @returns whether we should set text content or not
     */
    shouldSetTextContent: (type, props) => {
        return false;
    },

    /**
     * createInstance is called on all the nodes, except the leaf text nodes.
     * We use the data created here to update the element later on.
     * Here we create the GameObject we need to keep track of. We can also add some event listeners here
     * but currently we are doing it inside the gameObject component's useEffect.
     *
     * @param type type of our object (eg. gameObject, div, p)
     * @param props props of our element
     * @param rootContainer Game
     * @param parentHostContext Data passed from the parent container, using getChildHostContext
     * @param fiberNode this is the fiberNode of the textInstance, this is created by react internally to manage the work in the instance
     * @returns the newly created node
     */
    createInstance: (
        type,
        props,
        rootContainer,
        parentHostContext,
        fiberNode
    ) => {
        if (type === 'gameObject') {
            return {
                instanceType: 'PHASER',
                type: props.type,
                data: props.data,
                instance: props.instance,
                scene: props.scene
            };
        }
        // else its a dom element
    },
    /**
     * Here we specify how we want to handle the rendering of text content.
     *
     * we are not creating a text instance inside a phaser component inside our phaser game
     * so we throw an error when this function is called
     * @param text contains the text which needs to be rendered
     * @param rootContainer the rootContainer instance which is root element where our
     * renderer is intialized, this is (Phaser Game object in our case)
     * @param parentHostContext This the context of the element which is enclosing the text, eg <p>Text</p> here p-> is our host context. We get the
     * parent's hostContext from getChildHostContext
     * @param fiberNode this is the fiberNode of the textInstance, this is created by react internally to manage the work in the instance
     */
    createTextInstance: (text, rootContainer, parentHostContext, fiberNode) => {
        // Creating text components inside of
        parentHostContext === 'PHASER' &&
            invariant(
                false,
                clsx(
                    'Text objects cannot be created inside a Phaser Component.',
                    'Use <Text /> Component instead.'
                )
            );
    },
    appendInitialChild: (...args) => {},

    /**
     * refer react docs, did not find anu use-case for this function
     */
    finalizeInitialChildren: (
        instance,
        type,
        props,
        rootContainer,
        hostContext
    ) => {
        return false;
    },
    /**
     * prepareUpdate is called on the first node with a change
     * and called on all of its child nodes recursively
     *
     * We use this to determine whether a update needs to take place on the component
     * by comparing the previousProps and the new Props.
     * If we want an update, we return an object representing the changes we want
     * and use the commitUpdate methods to do the object, else we return null
     *
     * We do not perform any DOM changes here, we should do them only in the commit
     * phase of the renderer aka commitUpdate
     *
     * commitUpdate will be called if we return a truthy value from prepareUpdate
     *
     * @param instance instance of the DOM element which has changed
     * @param type type of the element (gameObject, div, p)
     * @param oldProps previous Props
     * @param newProps new Props
     * @param rootContainer Game Object
     * @param hostContext context passed down from the parent node
     */
    prepareUpdate: (
        instance,
        type,
        oldProps,
        newProps,
        rootContainer,
        hostContext
    ) => {
        if (type === 'gameObject') {
            const updatedProps = updatePayload(oldProps, newProps);
            return updatedProps;
        }
    },
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

    /**
     * Here we perform all the updates that we queued with the prepareUpdate method
     * The update occurs bottom up approach by building a new updated dom tree
     * This is where we are supposed to do all the updates
     *
     * @param instance current component instance
     * @param updatePayload payload returned from prepareUpdate
     * @param type
     * @param oldProps prev props
     * @param newProps new props
     * @param hostContext the fiber node which manages context for the given component (we are not touching it)
     */
    commitUpdate: (
        instance,
        updatePayload,
        type,
        oldProps,
        newProps,
        hostContext
    ) => {
        if (type === 'gameObject') {
            commitPayload(instance.type, instance.instance, updatePayload);
        }
    },
    appendChildToContainer: (...args) => {},
    removeChildFromContainer: (...args) => {}
};

const reconcilerInstance = Reconciler(hostConfigWrapper(hostConfig));

export type hostConfigType = typeof hostConfig;

export { reconcilerInstance };
