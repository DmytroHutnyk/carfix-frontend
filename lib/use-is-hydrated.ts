import {useEffect, useState} from "react";

/**
 * False on the server and on the first client render, true from the second render on.
 *
 * Zustand's persist middleware reads localStorage after mount, so any component that
 * renders persisted state produces a different tree on the server than on the client —
 * a hydration mismatch, and with it unstable auto-generated ids in Base UI components
 * further down the tree. Gate on this and render a static placeholder until the real
 * client state is known.
 */
export function useIsHydrated(): boolean {
    const [hydrated, setHydrated] = useState(false);
    useEffect(() => setHydrated(true), []);
    return hydrated;
}
