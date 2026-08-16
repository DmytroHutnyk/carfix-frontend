import Link from "next/link";
import {Building2, Calendar, MapPin, Users} from "lucide-react";
import {Card, CardContent} from "@/_components/shadcn/card";
import {Badge} from "@/_components/shadcn/badge";
import {Progress} from "@/_components/shadcn/progress";
import StarRating from "@/(main)/(withFooter)/search/_components/starRating";
import {cn} from "@/lib/utils";
import {OwnerBranchSummary} from "@/features/ownerBranch/ownerBranchTypes";
import {BRANCH_STATUS_LABELS, formatAddress, personnelPercent} from "@/features/ownerBranch/ownerBranchList";
import LatestReviews from "@/business/(owner)/service-points/_components/latestReviews";

export default function BranchCard({branch}: { branch: OwnerBranchSummary }) {
    const pending = branch.status === "VERIFICATION_PENDING";

    return (
        <Link href={`/business/service-points/${branch.branchId}`} className="block h-full">
            <Card className="relative h-full transition-shadow hover:shadow-md">
                {pending && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-card/60">
                        <span className="text-lg font-semibold">Verification is pending</span>
                    </div>
                )}
                <CardContent className={cn("flex h-full flex-col gap-5 p-6", pending && "opacity-40")}>
                    <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted">
                            <Building2 className="h-6 w-6 text-muted-foreground"/>
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <h2 className="truncate text-lg font-semibold">{branch.name}</h2>
                                {branch.status === "SUSPENDED" && (
                                    <Badge variant="destructiveSoft">{BRANCH_STATUS_LABELS.SUSPENDED}</Badge>
                                )}
                                {branch.status === "ACTIVE" && branch.openNow && (
                                    <Badge variant="success">Open now</Badge>
                                )}
                            </div>
                            <p className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 shrink-0"/>
                                <span className="truncate">{formatAddress(branch)}</span>
                            </p>
                            <div className="flex items-center gap-2 text-sm">
                                {branch.rating === null ? (
                                    <Badge variant="secondary">New</Badge>
                                ) : (
                                    <>
                                        <StarRating rating={branch.rating}/>
                                        <span className="font-medium tabular-nums">{branch.rating.toFixed(1)}</span>
                                        <span className="text-muted-foreground">· {branch.reviewCount} reviews</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <dl className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                            <dt className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4"/> Bookings
                            </dt>
                            <dd className="text-2xl font-semibold tabular-nums">
                                {branch.bookingsToday}
                                <span className="text-sm font-normal text-muted-foreground">
                                    {" "}/ {branch.completedToday} completed
                                </span>
                            </dd>
                        </div>
                        <div className="flex flex-col gap-1">
                            <dt className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Users className="h-4 w-4"/> Personnel
                            </dt>
                            <dd className="text-2xl font-semibold tabular-nums">
                                {branch.employeesOnDutyToday} / {branch.employeesTotal}
                            </dd>
                            <Progress value={personnelPercent(branch)} className="h-1.5" aria-label="Personnel on duty"/>
                        </div>
                    </dl>

                    <LatestReviews reviews={branch.latestReviews} total={branch.reviewCount ?? 0}/>
                </CardContent>
            </Card>
        </Link>
    );
}
