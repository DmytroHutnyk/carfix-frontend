import {Skeleton} from "@/_components/shadcn/skeleton";
import ResultCardSkeleton from "@/(main)/(withFooter)/search/_components/resultCardSkeleton";

export default function SearchPageSkeleton() {
    return (
        <div className="mx-auto w-full max-w-[1475px] px-4 py-4 lg:px-6 lg:py-6">
            <section className="sticky top-0 z-10 flex flex-col gap-2 bg-background py-3">
                <Skeleton className="h-8 w-full max-w-72"/>
                <Skeleton className="h-5 w-32"/>
            </section>
            <div className="flex flex-col gap-4 pt-4">
                {Array.from({length: 4}, (_, i) => <ResultCardSkeleton key={i}/>)}
            </div>
        </div>
    );
}
