import {Separator} from "@/_components/shadcn/separator";

export default function NotImplemented({title}: { title: string }) {
    return (
        <div className="py-3">
            <section className="space-y-3 text-center">
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
                <p className="text-muted-foreground">To be implemented soon</p>
            </section>
            <Separator className="my-6"/>
        </div>
    );
}
