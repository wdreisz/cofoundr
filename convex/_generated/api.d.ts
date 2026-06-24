/* eslint-disable */
import type { ApiFromModules, FilterApi, FunctionReference } from "convex/server";
import type * as deck from "../deck";
import type * as matches from "../matches";
import type * as messages from "../messages";
import type * as profiles from "../profiles";
import type * as saved from "../saved";
import type * as seed from "../seed";
import type * as swipes from "../swipes";

declare const fullApi: ApiFromModules<{
  deck: typeof deck;
  matches: typeof matches;
  messages: typeof messages;
  profiles: typeof profiles;
  saved: typeof saved;
  seed: typeof seed;
  swipes: typeof swipes;
}>;
export declare const api: FilterApi<typeof fullApi, FunctionReference<any, "public">>;
export declare const internal: FilterApi<typeof fullApi, FunctionReference<any, "internal">>;
