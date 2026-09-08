import {useState} from "react";

// A draft expires when its URL-owned base changes, including navigation and filter resets.
export function useUrlDraft<T>(urlValue: T): [T, (next: T) => void] {
    const [draft, setDraft] = useState<{ value: T } | null>(null);
    const [seen, setSeen] = useState(urlValue);

    // Compare with the current value so an old draft cannot revive when a URL value returns.
    if (!Object.is(seen, urlValue)) {
        setSeen(urlValue);
        setDraft(null);
    }

    return [draft ? draft.value : urlValue, (next: T) => setDraft({value: next})];
}
