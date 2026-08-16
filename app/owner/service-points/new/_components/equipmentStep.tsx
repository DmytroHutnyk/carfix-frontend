"use client"

import ResourceListStep from "@/owner/service-points/new/_components/resourceListStep";
import {useBranchRegistrationDraft} from "@/features/branchRegistration/useBranchRegistrationDraft";

export default function EquipmentStep() {
    const types = useBranchRegistrationDraft((s) => s.equipmentTypes);
    const rows = useBranchRegistrationDraft((s) => s.equipment);
    const setEquipment = useBranchRegistrationDraft((s) => s.setEquipment);
    const next = useBranchRegistrationDraft((s) => s.next);
    const back = useBranchRegistrationDraft((s) => s.back);

    return (
        <ResourceListStep
            title="Add equipment that must be reserved exclusively"
            subtitle="List the tools or machines that cannot be shared by multiple mechanics at the same time. These items will be booked together with a service."
            hint={<p>One row = one physical unit. The category groups identical units (e.g. two “2-post lift” units) — a service later requires a category, and any free unit of it will do.</p>}
            addLabel="Add equipment"
            namePlaceholder="Equipment name, e.g. 2-post lift #1"
            typePlaceholder="Select or add a category"
            createTypeLabel="Add category"
            initialTypes={types}
            initialRows={rows}
            onBack={(t, r) => { setEquipment(t, r); back(); }}
            onContinue={(nextTypes, nextRows) => {
                setEquipment(nextTypes, nextRows);
                next();
            }}
        />
    );
}
