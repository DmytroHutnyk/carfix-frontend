import {format} from "date-fns";
import {Car, Pencil, Trash2} from "lucide-react";

import {CarProfile} from "@/util/types/carProfileTypes";
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
    return (
        <Card>
            <CardContent className="flex gap-6 p-6">
                {/*-==-==-=-=-=-=--==-=-=-=-Image placeholder-==-==-=-=-=-=-=-=-=---==*/}
                <div className="flex h-36 w-36 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Car className="h-10 w-10 text-muted-foreground"/>
                </div>

                <div className="flex flex-1 flex-col gap-1">
                    <h2 className="text-2xl font-bold tracking-tight">{carProfile.name}</h2>
                    <p className="text-muted-foreground">
                        {carProfile.brandName} {carProfile.modelName} {carProfile.generationName}
                    </p>

                    <div className="flex items-center gap-4 pt-2">
                        <p>
                            <span className="text-muted-foreground">VIN: </span>
                            <span className="font-semibold">{carProfile.vin ?? "—"}</span>
                        </p>
                        <p>
                            <span className="text-muted-foreground">Plate: </span>
                            <span className="font-semibold">{carProfile.plates ?? "—"}</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        <p>
                            <span className="text-muted-foreground">Certificate: </span>
                            <span className="font-semibold">
                                {carProfile.serviceCertificateDate ? formatDate(carProfile.serviceCertificateDate) : "—"}
                            </span>
                        </p>
                        {carProfile.serviceCertificateDate && (
                            isExpired(carProfile.serviceCertificateDate)
                                ? <Badge variant="destructiveSoft">Expired</Badge>
                                : <Badge variant="success">Valid</Badge>
                        )}
                    </div>

                    {/*-==-==-=-=-=-=--==-=-=-=-Actions-==-==-=-=-=-=-=-=-=---==*/}
                    <div className="flex justify-end gap-2 pt-2">
                        <Button onClick={onEdit}>
                            <Pencil/> Edit
                        </Button>
                        <Button variant="destructive" onClick={onDelete}>
                            <Trash2/> Delete
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
