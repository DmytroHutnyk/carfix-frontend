import {Suspense} from "react";
import SearchResults from "@/(main)/(withFooter)/search/_components/searchResults";

export default function Page() {
    return (
        <Suspense>
            <SearchResults/>
        </Suspense>
    );
}
