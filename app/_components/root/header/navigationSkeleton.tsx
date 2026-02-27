import {Skeleton} from "@/_components/shadcn/skeleton";

export default function NavigationSkeleton() {
    return (
        <div className="flex items-center gap-3">
            {/* stands for the language / car selector dropdown */}
            <Skeleton className="h-9 w-20 rounded-md"/>

            {/* stands for  the primary action button (Login/SignUp and My Account) */}
            <Skeleton className="h-9 w-28 rounded-md"/>

            {/* stands for  secondary button (For Business) */}
            <Skeleton className="h-9 w-28 rounded-md"/>
        </div>
    );
}

