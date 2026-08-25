import {Separator} from "@/_components/shadcn/separator";

export default function NotImplemented({title}: { title: string }) {
    return (
        <div className="py-3">
            <section className="space-y-3 text-center">
                <h1 className="text-lg font-semibold tracking-tight lg:text-3xl lg:font-bold">{title}</h1>
                <p className="text-sm text-muted-foreground lg:text-base">To be implemented soon</p>
            </section>
            <Separator className="my-4 lg:my-6"/>
        </div>
    );
}
