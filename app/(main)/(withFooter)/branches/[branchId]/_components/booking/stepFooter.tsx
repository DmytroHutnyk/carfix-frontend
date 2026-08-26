import {ReactNode} from "react";
import {cn} from "@/lib/utils";

export default function StepFooter({note, className, children}: {
    note?: ReactNode;
    className?: string;
    children: ReactNode;
}) {
    return (
        <div className={cn("flex flex-wrap items-center justify-between gap-3", className)}>
            {note}
            <div className="ml-auto flex shrink-0 items-center gap-3">{children}</div>
        </div>
    );
}
