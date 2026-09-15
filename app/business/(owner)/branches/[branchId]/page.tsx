import BranchOverviewContent from "@/business/(owner)/branches/[branchId]/_components/branchOverviewContent";
import BranchBookingsContent from "@/business/(owner)/branches/[branchId]/_components/branchBookingsContent";
import BranchEmployeesContent from "@/business/(owner)/branches/[branchId]/_components/branchEmployeesContent";
import BranchReviewsContent from "@/business/(owner)/branches/[branchId]/_components/branchReviewsContent";
import BranchEquipmentContent from "@/business/(owner)/branches/[branchId]/_components/branchEquipmentContent";
import BranchServiceBaysContent from "@/business/(owner)/branches/[branchId]/_components/branchServiceBaysContent";
import BranchServicesContent from "@/business/(owner)/branches/[branchId]/_components/branchServicesContent";

export default async function Page({params, searchParams}: {
    params: Promise<{ branchId: string }>;
    searchParams: Promise<{ tab?: string }>;
}) {
    const {branchId} = await params;
    const {tab} = await searchParams;

    if (tab === "bookings") return <BranchBookingsContent branchId={branchId}/>;
    if (tab === "employees") return <BranchEmployeesContent branchId={branchId}/>;
    if (tab === "reviews") return <BranchReviewsContent branchId={branchId}/>;
    if (tab === "equipment") return <BranchEquipmentContent branchId={branchId}/>;
    if (tab === "carBays") return <BranchServiceBaysContent branchId={branchId}/>;
    if (tab === "services") return <BranchServicesContent branchId={branchId}/>;
    return <BranchOverviewContent branchId={branchId}/>;
}
