import {PopoverDescription, PopoverHeader, PopoverTitle} from "@/_components/shadcn/popover";

export default function StepHeader({title, stepIndex, stepCount}: {
    title: string;
    stepIndex: number;
    stepCount: number;
}) {
    return (
        <PopoverHeader>
            <PopoverDescription className="text-xs">Step {stepIndex + 1} of {stepCount}</PopoverDescription>
            <PopoverTitle className="text-base">{title}</PopoverTitle>
        </PopoverHeader>
    );
}
