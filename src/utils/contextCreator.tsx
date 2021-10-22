import { createContext, useContext } from "react";

/**
 * creates a context with value initialized as value passed to it / null
 */
export function createGameContext<T>(data: T | null = null) {
	//
	// Writing ES6 generic function is weird, and fucked up
	// going with plain old func
	// https://basarat.gitbook.io/typescript/type-system/generics#design-pattern-convenience-generic

	return createContext<T | null>(data);
}
