import {Suspense} from "react";
import SearchResults from "@/(main)/(withFooter)/search/_components/searchResults";
import SearchPageSkeleton from "@/(main)/(withFooter)/search/_components/searchPageSkeleton";

export default function Page() {
    return (
        <Suspense fallback={<SearchPageSkeleton/>}>
            <SearchResults/>
        </Suspense>
    );
}
