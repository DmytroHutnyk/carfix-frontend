import {Fragment} from "react";
import {format} from "date-fns";
import {Car, Pencil, Trash2} from "lucide-react";

import {CarProfile} from "@/features/carProfile/carProfileTypes";
import {Card, CardContent} from "@/_components/shadcn/card";
import {Badge} from "@/_components/shadcn/badge";
import {Button} from "@/_components/shadcn/button";

function formatDate(isoDate: string): string {
    return format(new Date(isoDate + "T00:00:00"), "dd/MM/yyyy");
}

function isExpired(isoDate: string): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(isoDate + "T00:00:00") < today;
}

export default function CarCard({carProfile, onEdit, onDelete}: {
    carProfile: CarProfile;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const expiryDates = [
        {label: "Insurance", value: carProfile.insuranceDate},
        {label: "Certificate", value: carProfile.serviceCertificateDate},
    ];

    return (
        <Card>
            <CardContent className="flex gap-3 p-3 lg:gap-6 lg:p-6">
                {/*-==-==-=-=-=-=--==-=-=-=-Image placeholder-==-==-=-=-=-=-=-=-=---==*/}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-muted lg:h-36 lg:w-36 lg:rounded-lg">
                    <Car className="h-6 w-6 text-muted-foreground lg:h-10 lg:w-10"/>
                </div>

                <div className="flex min-w-0 flex-1 flex-col gap-0.5 lg:gap-1">
                    <h2 className="truncate text-sm font-semibold tracking-tight lg:whitespace-normal lg:text-2xl lg:font-bold">
                        {carProfile.name}
                    </h2>
                    <p className="truncate text-xs text-muted-foreground lg:whitespace-normal lg:text-base">
                        {carProfile.brandName} {carProfile.modelName} {carProfile.versionName}
                    </p>

                    <div className="flex flex-col gap-0.5 pt-1.5 text-xs lg:flex-row lg:items-center lg:gap-4 lg:pt-2 lg:text-base">
                        <p>
                            <span className="text-muted-foreground">VIN: </span>
                            <span className="font-semibold">{carProfile.vin ?? "—"}</span>
                        </p>
                        <p>
                            <span className="text-muted-foreground">Plate: </span>
                            <span className="font-semibold">{carProfile.plates ?? "—"}</span>
                        </p>
                    </div>

                    <dl className="grid w-fit grid-cols-[max-content_max-content_auto] items-center gap-x-2 gap-y-0.5 pt-1 text-xs lg:gap-x-3 lg:gap-y-1 lg:text-base">
                        {expiryDates.map(({label, value}) => (
                            <Fragment key={label}>
                                <dt className="text-muted-foreground">{label}</dt>
                                <dd className="font-semibold tabular-nums">
                                    {value ? formatDate(value) : "—"}
                                </dd>
                                {/* Own column so the chips share an edge; stays rendered when
                                    empty, or the next row would slide into this cell. */}
                                <dd>
                                    {value && (
                                        isExpired(value)
                                            ? <Badge variant="destructiveSoft">Expired</Badge>
                                            : <Badge variant="success">Valid</Badge>
                                    )}
                                </dd>
                            </Fragment>
                        ))}
                    </dl>

                    {/*-==-==-=-=-=-=--==-=-=-=-Actions-==-==-=-=-=-=-=-=-=---==*/}
                    <div className="flex justify-end gap-2 pt-2">
                        <Button variant="ghost" size="sm" className="lg:h-9 lg:bg-primary lg:px-4 lg:py-2 lg:text-sm lg:text-primary-foreground lg:shadow lg:hover:bg-primary/90" onClick={onEdit}>
                            <Pencil/> Edit
                        </Button>
                        <Button variant="destructive" size="sm" className="lg:h-9 lg:px-4 lg:py-2 lg:text-sm" onClick={onDelete}>
                            <Trash2/> Delete
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
