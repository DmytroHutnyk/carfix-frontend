import NotImplemented from "@/business/(owner)/_components/notImplemented";

export default async function Page({params}: { params: Promise<{ branchId: string }> }) {
    const {branchId} = await params;
    return <NotImplemented title={`Service point ${branchId}`}/>;
}
