import {DialogDescription, DialogHeader, DialogTitle} from "@/_components/shadcn/dialog";

export default function StepHeader({title, stepIndex, stepCount}: {
    title: string;
    stepIndex: number;
    stepCount: number;
}) {
    return (
        <DialogHeader className="space-y-0.5 pr-8 text-left">
            <DialogDescription className="text-xs">Step {stepIndex + 1} of {stepCount}</DialogDescription>
            <DialogTitle className="text-base">{title}</DialogTitle>
        </DialogHeader>
    );
}
