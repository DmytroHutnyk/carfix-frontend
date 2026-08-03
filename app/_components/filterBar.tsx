import {ReactNode} from "react";
import {Filter} from "lucide-react";

import {Button} from "@/_components/shadcn/button";

export default function FilterBar({onClear, children}: {
    onClear: () => void;
    children: ReactNode;
}) {
    return (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border p-3">
            <p className="flex items-center gap-2 font-semibold">
                <Filter className="h-4 w-4"/> Filters:
            </p>

            {children}

            <Button className="ml-auto" onClick={onClear}>
                Clear filters
            </Button>
        </div>
    )
}
