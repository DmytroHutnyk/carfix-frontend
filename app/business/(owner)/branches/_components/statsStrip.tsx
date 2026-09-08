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
            <CardContent className="grid grid-cols-2 gap-3 p-3 md:grid-cols-4 md:gap-6 md:p-6 lg:p-6">
                {tiles.map(({icon: Icon, value, label}) => (
                    <div key={label} className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-muted-foreground lg:h-6 lg:w-6"/>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold tabular-nums lg:text-2xl">{value}</span>
                            <span className="text-xs text-muted-foreground lg:text-sm">{label}</span>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
