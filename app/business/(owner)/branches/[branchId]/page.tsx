import BranchOverviewContent from "@/business/(owner)/branches/[branchId]/_components/branchOverviewContent";
import BranchBookingsContent from "@/business/(owner)/branches/[branchId]/_components/branchBookingsContent";

export default async function Page({params, searchParams}: {
    params: Promise<{ branchId: string }>;
    searchParams: Promise<{ tab?: string }>;
}) {
    const {branchId} = await params;
    const {tab} = await searchParams;

    if (tab === "bookings") return <BranchBookingsContent branchId={branchId}/>;
    return <BranchOverviewContent branchId={branchId}/>;
}
