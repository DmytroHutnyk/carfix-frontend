import {DialogDescription, DialogHeader, DialogTitle} from "@/_components/shadcn/dialog";

export default function StepHeader({title, stepIndex, stepCount}: {
    title: string;
    stepIndex: number;
    stepCount: number;
}) {
    return (
        <DialogHeader className="sticky top-0 -mx-6 -mt-6 space-y-0.5 bg-card px-6 pb-3 pt-6 text-left pr-8">
            <DialogDescription className="text-xs">Step {stepIndex + 1} of {stepCount}</DialogDescription>
            <DialogTitle className="text-base">{title}</DialogTitle>
        </DialogHeader>
    );
}
