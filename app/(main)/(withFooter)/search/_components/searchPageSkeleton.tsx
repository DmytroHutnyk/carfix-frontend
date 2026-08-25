import {Skeleton} from "@/_components/shadcn/skeleton";
import ResultCardSkeleton from "@/(main)/(withFooter)/search/_components/resultCardSkeleton";

export default function SearchPageSkeleton() {
    return (
        <div className="mx-auto w-full max-w-[1475px] px-4 py-4 lg:px-6 lg:py-6">
            <section className="sticky top-0 z-10 flex flex-col gap-2 bg-background py-2 lg:py-3">
                <Skeleton className="h-5 w-48 lg:h-8 lg:w-72"/>
                <Skeleton className="h-3 w-32 lg:h-5"/>
                <div className="flex items-center justify-end gap-2 lg:hidden">
                    <Skeleton className="h-8 w-24"/>
                    <Skeleton className="h-8 w-24"/>
                </div>
            </section>
            <div className="flex flex-col gap-3 pt-3 lg:gap-4 lg:pt-4">
                {Array.from({length: 4}, (_, i) => <ResultCardSkeleton key={i}/>)}
            </div>
        </div>
    );
}
