'use client'

import {useState} from "react";
import {UseFormReturn} from "react-hook-form";

import {BranchOverviewForm} from "@/features/ownerBranch/branchOverviewForm";
import {CANCELLATION_POLICY_CONTENT} from "@/features/ownerBranch/cancellationPolicyContent";
import {CANCELLATION_POLICIES, CancellationPolicy} from "@/features/ownerBranch/ownerBranchTypes";
import {cn} from "@/lib/utils";

import CollapsibleCard from "@/business/(owner)/branches/[branchId]/_components/collapsibleCard";

export default function CancellationPolicyCard({form}: { form: UseFormReturn<BranchOverviewForm> }) {
    const [selected, setSelected] = useState<CancellationPolicy>(() => form.getValues("cancellationPolicy"));

    return (
        <CollapsibleCard title="Cancellation Policy">
            <div className="flex flex-col gap-4">
                {CANCELLATION_POLICIES.map((policy) => {
                    const content = CANCELLATION_POLICY_CONTENT[policy];
                    const isSelected = selected === policy;
                    return (
                        <button
                            key={policy}
                            type="button"
                            onClick={() => setSelected(policy)}
                            aria-pressed={isSelected}
                            className={cn(
                                "flex gap-3 rounded-xl border p-4 text-left transition-colors",
                                isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                            )}
                        >
                            <span className={cn(
                                "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                                isSelected ? "border-primary" : "border-input"
                            )}>
                                {isSelected && <span className="h-2 w-2 rounded-full bg-primary"/>}
                            </span>
                            <span className="space-y-1">
                                <span className="block text-base font-semibold">{content.title}</span>
                                <span className="block text-sm">{content.summary}</span>
                                <span className="block text-sm text-muted-foreground">{content.details}</span>
                            </span>
                        </button>
                    );
                })}
            </div>
        </CollapsibleCard>
    );
}
