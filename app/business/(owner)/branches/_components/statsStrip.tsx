import {Calendar, CircleCheck, LucideIcon, Star, Users} from "lucide-react";
import {Card, CardContent} from "@/_components/shadcn/card";
import {OwnerTotals} from "@/features/ownerBranch/ownerBranchList";

export default function StatsStrip({totals}: { totals: OwnerTotals }) {
    const tiles: { icon: LucideIcon; value: string; label: string }[] = [
        {icon: Calendar, value: String(totals.bookingsToday), label: "Bookings today"},
        {icon: CircleCheck, value: String(totals.completedToday), label: "Completed"},
        {icon: Users, value: `${totals.employeesOnDutyToday} / ${totals.employeesTotal}`, label: "Staff on duty"},
        {icon: Star, value: totals.averageRating === null ? "—" : totals.averageRating.toFixed(1), label: "Avg rating"},
    ];

    return (
        <Card>
            <CardContent className="grid grid-cols-2 gap-4 p-4 md:grid-cols-4 md:gap-6 md:p-6">
                {tiles.map(({icon: Icon, value, label}) => (
                    <div key={label} className="flex items-center gap-3">
                        <Icon className="h-6 w-6 text-muted-foreground"/>
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold tabular-nums">{value}</span>
                            <span className="text-sm text-muted-foreground">{label}</span>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
