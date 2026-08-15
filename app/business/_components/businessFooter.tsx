import Link from "next/link";
import {Button} from "@/_components/shadcn/button";

export default function BusinessFooter() {
    return (
        <footer className="w-full bg-background shadow-[0px_-2px_4px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-center py-2">
                <Button variant="link" className="font-normal text-muted-foreground" asChild>
                    <Link href="/business/terms-of-use">Terms of Use</Link>
                </Button>
            </div>
        </footer>
    );
}
