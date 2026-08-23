import WorkshopPageContent from "./_components/workshopPageContent";

function single(value: string | string[] | undefined): string | null {
    return typeof value === "string" && value !== "" ? value : null;
}

export default async function Page({params, searchParams}: {
    params: Promise<{ branchId: string }>;
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
    const {branchId} = await params;
    const query = await searchParams;
    const from = single(query.from);
    const to = single(query.to);
    return (
        <WorkshopPageContent
            branchId={branchId}
            initialServiceName={single(query.service)}
            initialRange={from && to ? {from, to} : null}
        />
    );
}
