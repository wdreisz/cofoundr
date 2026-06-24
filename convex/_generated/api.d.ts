/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as deck from "../deck.js";
import type * as lib_matching from "../lib/matching.js";
import type * as matches from "../matches.js";
import type * as messages from "../messages.js";
import type * as profiles from "../profiles.js";
import type * as saved from "../saved.js";
import type * as seed from "../seed.js";
import type * as seedData from "../seedData.js";
import type * as swipes from "../swipes.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  deck: typeof deck;
  "lib/matching": typeof lib_matching;
  matches: typeof matches;
  messages: typeof messages;
  profiles: typeof profiles;
  saved: typeof saved;
  seed: typeof seed;
  seedData: typeof seedData;
  swipes: typeof swipes;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
