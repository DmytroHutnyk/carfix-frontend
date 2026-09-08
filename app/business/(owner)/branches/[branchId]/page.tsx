import BranchOverviewContent from "@/business/(owner)/branches/[branchId]/_components/branchOverviewContent";

export default async function Page({params}: { params: Promise<{ branchId: string }> }) {
    const {branchId} = await params;
    return <BranchOverviewContent branchId={branchId}/>;
}
