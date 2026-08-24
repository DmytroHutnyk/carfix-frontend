import Link from "next/link";
import {Building2, Calendar, MapPin, Users} from "lucide-react";
import {Card, CardContent} from "@/_components/shadcn/card";
import {Badge} from "@/_components/shadcn/badge";
import {Progress} from "@/_components/shadcn/progress";
import StarRating from "@/(main)/(withFooter)/search/_components/starRating";
import {cn} from "@/lib/utils";
import {OwnerBranchSummary} from "@/features/ownerBranch/ownerBranchTypes";
import {BRANCH_STATUS_LABELS, formatAddress, personnelPercent} from "@/features/ownerBranch/ownerBranchList";
import LatestReviews from "@/business/(owner)/branches/_components/latestReviews";

export default function BranchCard({branch}: { branch: OwnerBranchSummary }) {
    const pending = branch.status === "VERIFICATION_PENDING";

    return (
        <Link href={`/business/branches/${branch.branchId}`} className="block h-full">
            <Card className="relative h-full transition-shadow hover:shadow-md">
                {pending && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-card/60">
                        <span className="text-sm font-semibold lg:text-lg">Verification is pending</span>
                    </div>
                )}
                <CardContent className={cn("flex h-full flex-col gap-3 p-3 lg:gap-5 lg:p-6", pending && "opacity-40")}>
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-muted lg:h-12 lg:w-12 lg:rounded-lg">
                            <Building2 className="h-5 w-5 text-muted-foreground lg:h-6 lg:w-6"/>
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                            <div className="flex items-center gap-2">
                                <h2 className="truncate text-sm font-semibold lg:text-lg">{branch.name}</h2>
                                {branch.status === "SUSPENDED" && (
                                    <Badge variant="destructiveSoft">{BRANCH_STATUS_LABELS.SUSPENDED}</Badge>
                                )}
                                {branch.status === "ACTIVE" && branch.openNow && (
                                    <Badge variant="success">Open now</Badge>
                                )}
                            </div>
                            <p className="flex items-center gap-1 text-xs text-muted-foreground lg:text-sm">
                                <MapPin className="h-3.5 w-3.5 shrink-0 lg:h-4 lg:w-4"/>
                                <span className="truncate">{formatAddress(branch)}</span>
                            </p>
                            <div className="flex items-center gap-2 text-xs lg:text-sm">
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

                    <dl className="grid grid-cols-2 gap-3 lg:gap-4">
                        <div className="flex flex-col gap-1">
                            <dt className="flex items-center gap-1 text-xs text-muted-foreground lg:text-sm">
                                <Calendar className="h-3.5 w-3.5 lg:h-4 lg:w-4"/> Bookings
                            </dt>
                            <dd className="text-lg font-semibold tabular-nums lg:text-2xl">
                                {branch.bookingsToday}
                                <span className="text-xs font-normal text-muted-foreground lg:text-sm">
                                    {" "}/ {branch.completedToday} completed
                                </span>
                            </dd>
                        </div>
                        <div className="flex flex-col gap-1">
                            <dt className="flex items-center gap-1 text-xs text-muted-foreground lg:text-sm">
                                <Users className="h-3.5 w-3.5 lg:h-4 lg:w-4"/> Personnel
                            </dt>
                            <dd className="text-lg font-semibold tabular-nums lg:text-2xl">
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
