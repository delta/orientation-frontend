/**
 * All the contexts needed for the app
 */

import { createGameContext } from "./utils/contextCreator";
import { GameMapType } from "./core/MapObject";

/**
 *
 * Context for the Map Object with size, zoom and src (HTMLImageElement)
 *
 * It contains an array of all the map objects with fetched images
 * When the user uses this context, he is guaranteed to get the Map Image and its size
 */
export const MapContext = createGameContext<GameMapType[]>();
