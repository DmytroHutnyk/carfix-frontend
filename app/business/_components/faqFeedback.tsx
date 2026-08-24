"use client"

import {useState} from "react";
import {ThumbsDown, ThumbsUp} from "lucide-react";
import {Button} from "@/_components/shadcn/button";

type Vote = "yes" | "no";

export default function FaqFeedback() {
    const [vote, setVote] = useState<Vote | null>(null);

    if (vote) return <p className="text-xs text-muted-foreground lg:text-sm">Thanks for your feedback!</p>;

    return (
        <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs text-muted-foreground lg:text-sm">Did this help?</span>
            <Button variant="outline" size="sm" onClick={() => setVote("yes")}>
                <ThumbsUp/> Yes
            </Button>
            <Button variant="outline" size="sm" onClick={() => setVote("no")}>
                <ThumbsDown/> No
            </Button>
        </div>
    );
}
