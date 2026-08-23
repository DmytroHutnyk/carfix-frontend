import {Calendar, LucideIcon, MapPin, Star, Users} from "lucide-react";
import {Card, CardContent} from "@/_components/shadcn/card";

export default function StatsSection() {
    return (
        <section>
            <Card>
                <CardContent className="grid grid-cols-2 gap-8 p-8 md:grid-cols-4">
                    {stats.map(({icon: Icon, value, label}) => (
                        <div key={label} className="flex flex-col items-center gap-2 text-center">
                            <Icon className="h-6 w-6"/>
                            <span className="text-3xl font-bold tabular-nums">{value}</span>
                            <span className="text-sm text-muted-foreground">{label}</span>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </section>
    );
}

const stats: { icon: LucideIcon; value: string; label: string }[] = [
    {icon: Users, value: "2,500+", label: "Partners"},
    {icon: Calendar, value: "120k+", label: "Bookings"},
    {icon: MapPin, value: "40+", label: "Cities"},
    {icon: Star, value: "4.8", label: "Avg Rating"},
];
