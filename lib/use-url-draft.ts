import {useState} from "react";

/**
 * A local edit that is abandoned the moment the URL value it was based on changes.
 *
 * Controls on /search are edited locally (typing, dragging a slider) but the URL owns the
 * truth. Storing only the draft makes the control ignore navigation — that is why the
 * radius slider kept showing "2 km" after Clear filters, and why the search field kept
 * stale text after a suggestion was picked. Storing the base the draft was made against
 * lets the draft expire on its own, with no effect and no stale-state window.
 */
export function useUrlDraft<T>(urlValue: T): [T, (next: T) => void] {
    const [draft, setDraft] = useState<{ value: T } | null>(null);
    const [seen, setSeen] = useState(urlValue);

    /* Comparing against the base instead would only make the draft dormant: a URL value that
       changes and later comes back — clearing the city returns the location field to "" —
       would revive an edit the user made before ever leaving that value. */
    if (!Object.is(seen, urlValue)) {
        setSeen(urlValue);
        setDraft(null);
    }

    return [draft ? draft.value : urlValue, (next: T) => setDraft({value: next})];
}
