import WorkshopPageContent from "./_components/workshopPageContent";

export default async function Page({params}: { params: Promise<{ branchId: string }> }) {
    const {branchId} = await params;
    return <WorkshopPageContent branchId={branchId}/>;
}
