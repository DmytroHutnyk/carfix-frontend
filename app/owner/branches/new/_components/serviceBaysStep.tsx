"use client"

import ResourceListStep from "@/owner/branches/new/_components/resourceListStep";
import {useBranchRegistrationDraft} from "@/features/branchRegistration/useBranchRegistrationDraft";

export default function ServiceBaysStep() {
    const types = useBranchRegistrationDraft((s) => s.serviceBayTypes);
    const rows = useBranchRegistrationDraft((s) => s.serviceBays);
    const setServiceBays = useBranchRegistrationDraft((s) => s.setServiceBays);
    const next = useBranchRegistrationDraft((s) => s.next);
    const back = useBranchRegistrationDraft((s) => s.back);

    return (
        <ResourceListStep
            title="Set up your service bays"
            subtitle="Add each workstation where you service vehicles. Pick a type and define availability."
            hint={<p>A bay is one workstation a car occupies for the whole visit. Types are yours to define (e.g. Basic, With lift, With pit) — a service later says which types it can run on. Availability is configured later.</p>}
            addLabel="Add bay"
            namePlaceholder="Bay name, e.g. Bay 1"
            typePlaceholder="Select or add a type"
            createTypeLabel="Add type"
            initialTypes={types}
            initialRows={rows}
            onBack={(t, r) => { setServiceBays(t, r); back(); }}
            onContinue={(nextTypes, nextRows) => {
                setServiceBays(nextTypes, nextRows);
                next();
            }}
        />
    );
}
