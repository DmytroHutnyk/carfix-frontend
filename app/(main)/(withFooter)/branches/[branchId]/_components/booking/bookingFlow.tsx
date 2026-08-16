"use client"

import {useEffect, useRef, useState} from "react";
import {Workshop, WorkshopService} from "@/features/workshop/workshopTypes";
import {SlotPick, VisitRange} from "@/features/slots/slotTypes";
import {initialVisitRange, MAX_SERVICES_PER_VISIT, pickRandom, SUGGESTION_COUNT} from "@/features/slots/slotList";
import SuggestionsStep from "./suggestionsStep";
import WhenStep from "./whenStep";
import ConfirmStep from "./confirmStep";

type Step = "suggestions" | "when" | "confirm";

export default function BookingFlow({workshop, selectedServices, onToggleService, initialRange, onClose}: {
    workshop: Workshop;
    selectedServices: WorkshopService[];
    onToggleService: (serviceId: number) => void;
    initialRange: VisitRange | null;
    onClose: () => void;
}) {
    const selectedIds = selectedServices.map((service) => service.serviceId);
    // Picked once per opening — re-rolling on every render would shuffle the cards under the cursor
    const [suggestions] = useState(() => {
        if (selectedIds.length >= MAX_SERVICES_PER_VISIT) return [];
        const candidates = workshop.serviceCategories
            .flatMap((category) => category.services)
            .filter((service) => !selectedIds.includes(service.serviceId));
        return pickRandom(candidates, SUGGESTION_COUNT);
    });
    const steps: Step[] = suggestions.length > 0 ? ["suggestions", "when", "confirm"] : ["when", "confirm"];

    const [step, setStep] = useState<Step>(steps[0]);
    const [range, setRange] = useState<VisitRange>(() => initialVisitRange(initialRange, workshop.tz));
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedSlot, setSelectedSlot] = useState<SlotPick | null>(null);

    const stepIndex = steps.indexOf(step);
    const goBack = () => setStep(steps[stepIndex - 1]);
    const goNext = () => setStep(steps[stepIndex + 1]);

    const stepRef = useRef<HTMLDivElement>(null);
    // Each step swap unmounts the focused button; a non-modal popover does not recapture focus, so move it to the new step
    useEffect(() => {
        stepRef.current?.focus();
    }, [step]);

    const content = step === "confirm" && selectedSlot ? (
        <ConfirmStep
            workshop={workshop}
            services={selectedServices}
            pick={selectedSlot}
            stepIndex={stepIndex}
            stepCount={steps.length}
            onBack={goBack}
            onConfirm={onClose}
        />
    ) : step === "suggestions" ? (
        <SuggestionsStep
            suggestions={suggestions}
            selectedIds={selectedIds}
            onToggle={onToggleService}
            stepIndex={stepIndex}
            stepCount={steps.length}
            onContinue={goNext}
        />
    ) : (
        <WhenStep
            branchId={workshop.branchId}
            tz={workshop.tz}
            serviceIds={selectedIds}
            range={range}
            onRangeChange={setRange}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            selectedSlot={selectedSlot}
            onSelectSlot={setSelectedSlot}
            stepIndex={steps.indexOf("when")}
            stepCount={steps.length}
            onBack={steps.indexOf("when") > 0 ? () => setStep("suggestions") : undefined}
            onContinue={() => setStep("confirm")}
        />
    );

    return (
        <div ref={stepRef} tabIndex={-1} className="outline-none">
            {content}
        </div>
    );
}
