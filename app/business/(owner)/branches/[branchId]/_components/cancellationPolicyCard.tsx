'use client'

import {Controller, UseFormReturn} from "react-hook-form";

import {BranchOverviewForm} from "@/features/ownerBranch/branchOverviewForm";
import {CANCELLATION_POLICY_CONTENT} from "@/features/ownerBranch/cancellationPolicyContent";
import {CANCELLATION_POLICIES} from "@/features/ownerBranch/ownerBranchTypes";
import {cn} from "@/lib/utils";

import {Card, CardContent, CardHeader, CardTitle} from "@/_components/shadcn/card";
import {Label} from "@/_components/shadcn/label";
import {RadioGroup, RadioGroupItem} from "@/_components/shadcn/radio-group";

export default function CancellationPolicyCard({form}: { form: UseFormReturn<BranchOverviewForm> }) {
    return (
        <Card>
            <CardHeader><CardTitle>Cancellation Policy</CardTitle></CardHeader>
            <CardContent>
                <Controller
                    control={form.control}
                    name="cancellationPolicy"
                    render={({field}) => (
                        <RadioGroup value={field.value} onValueChange={field.onChange} className="gap-4">
                            {CANCELLATION_POLICIES.map((policy) => {
                                const content = CANCELLATION_POLICY_CONTENT[policy];
                                const selected = field.value === policy;
                                return (
                                    <div
                                        key={policy}
                                        className={cn(
                                            "flex gap-3 rounded-xl border p-4",
                                            selected ? "border-primary" : "border-border"
                                        )}
                                    >
                                        <RadioGroupItem value={policy} id={`policy-${policy}`} className="mt-1"/>
                                        <div className="space-y-1">
                                            <Label htmlFor={`policy-${policy}`} className="text-base font-semibold">
                                                {content.title}
                                            </Label>
                                            <p className="text-sm">{content.summary}</p>
                                            <p className="text-sm text-muted-foreground">{content.details}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </RadioGroup>
                    )}
                />
            </CardContent>
        </Card>
    );
}
