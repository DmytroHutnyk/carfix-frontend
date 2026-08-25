import {Separator} from "@/_components/shadcn/separator";

const RULES = [
    "Use part + action (clear and searchable)",
    "Add side/scope where relevant (front/rear, 4-wheel, bank 1)",
    "Keep to 2–5 words; avoid jargon",
    "Use units or standard terms (OBD, R134a) when helpful",
];

const EXAMPLES = [
    "Brake pads replacement — front",
    "Oil & filter change",
    "Wheel alignment — 4-wheel",
    "A/C recharge — R134a",
    "Engine diagnostics — OBD scan",
];

export default function ServiceNamingHint() {
    return (
        <div className="space-y-3">
            <p className="text-sm font-semibold lg:text-base">How to name a service</p>
            <ul className="list-disc space-y-1 pl-4">
                {RULES.map((rule) => <li key={rule}>{rule}</li>)}
            </ul>
            <Separator/>
            <p className="font-semibold">Examples:</p>
            <ul className="list-disc space-y-1 pl-4 text-muted-foreground">
                {EXAMPLES.map((example) => <li key={example}>{example}</li>)}
            </ul>
        </div>
    );
}
