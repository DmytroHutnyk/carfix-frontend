"use client"

import {useCallback, useEffect, useState} from "react";

export function useInViewport(bottomInset: number) {
    const [node, setNode] = useState<HTMLElement | null>(null);
    const [inViewport, setInViewport] = useState(false);

    useEffect(() => {
        if (!node) {
            setInViewport(false);
            return;
        }
        const observer = new IntersectionObserver(
            ([entry]) => setInViewport(entry.isIntersecting),
            {rootMargin: `0px 0px -${bottomInset}px 0px`}
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, [node, bottomInset]);

    const ref = useCallback((next: HTMLElement | null) => setNode(next), []);

    return {ref, inViewport};
}
