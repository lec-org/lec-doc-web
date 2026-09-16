import { atom, PrimitiveAtom } from "jotai";
import { Socket } from "socket.io-client";

// With strictNullChecks disabled, Jotai can select its read-only atom overload for
// a generic nullable value. The runtime call is still the primitive atom overload.
export const socketAtom = atom(null) as PrimitiveAtom<Socket | null>;
