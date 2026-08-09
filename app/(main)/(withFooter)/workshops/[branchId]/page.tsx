import Link from "next/link";
import {Store} from "lucide-react";
import {Button} from "@/_components/shadcn/button";

/* V1 stub: search result cards need a destination; the real workshop page is a later milestone. */
export default async function Page({params}: { params: Promise<{ branchId: string }> }) {
    const {branchId} = await params;
    return (
        <div className="mx-auto flex min-h-[50vh] w-full max-w-[1475px] flex-col items-center justify-center gap-4 px-6 py-16 text-center">
            <Store className="h-12 w-12 text-muted-foreground"/>
            <h1 className="text-3xl font-bold tracking-tight">Workshop page</h1>
            <p className="text-muted-foreground">
                Workshop <span className="font-mono">{branchId}</span> — full page coming soon.
            </p>
            <Button asChild>
                <Link href="/search">Back to search</Link>
            </Button>
        </div>
    );
}
