"use client"

import {useState} from "react";
import {CarFront} from "lucide-react";
import {Button} from "@/_components/shadcn/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/_components/shadcn/card";
import {WorkshopBrand} from "@/features/workshop/workshopTypes";

const VISIBLE_COUNT = 6;

export default function BrandsCard({brands}: { brands: WorkshopBrand[] }) {
    const [showAll, setShowAll] = useState(false);
    if (brands.length === 0) return null;

    const visible = showAll ? brands : brands.slice(0, VISIBLE_COUNT);
    return (
        <Card>
            <CardHeader><CardTitle>Brands we work with</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-3">
                {/* Wrap, don't grid: fixed columns clip long names ("Volks…"), flow fits as many per row as actually fit */}
                <ul className="flex flex-wrap gap-x-4 gap-y-3">
                    {visible.map((brand) => (
                        <li key={brand.carBrandId} className="flex items-center gap-2">
                            {/* Logo placeholder until brand assets exist */}
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                                <CarFront className="h-4 w-4 text-muted-foreground"/>
                            </span>
                            <span className="text-sm whitespace-nowrap">{brand.name}</span>
                        </li>
                    ))}
                </ul>
                {brands.length > VISIBLE_COUNT && (
                    <Button
                        variant="secondary"
                        size="sm"
                        className="self-end"
                        onClick={() => setShowAll((value) => !value)}
                    >
                        {showAll ? "Show less" : "Show all"}
                    </Button>
                )}
            </CardContent>
        </Card>
    );
}
