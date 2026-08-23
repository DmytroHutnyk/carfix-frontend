"use client"

import {useState} from "react";
import {Check} from "lucide-react";
import {Badge} from "@/_components/shadcn/badge";
import {Button} from "@/_components/shadcn/button";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/_components/shadcn/card";
import {cn} from "@/lib/utils";

type PlanId = "free" | "standard" | "pro";

interface Plan {
    id: PlanId;
    name: string;
    tagline: string;
    monthlyPrice: number;
    cta: string;
    popular?: boolean;
    features: string[];
}

export default function PricingSection() {
    const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);

    return (
        <section id="pricing" className="scroll-mt-6 space-y-8">
            <h2 className="text-center text-2xl font-bold">Simple pricing overview</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {plans.map((plan) => {
                    const isSelected = plan.id === selectedPlan;
                    /* Before any click the "Popular" plan is highlighted; after a click the chosen one is */
                    const isHighlighted = selectedPlan ? isSelected : plan.popular === true;
                    return (
                        <Card key={plan.id} className={cn("flex flex-col", isHighlighted && "border-primary")}>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    {plan.name}
                                    {plan.popular && <Badge>Popular</Badge>}
                                </CardTitle>
                                <CardDescription>{plan.tagline}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex flex-1 flex-col gap-8">
                                <p>
                                    <span className="text-3xl font-bold tabular-nums">${plan.monthlyPrice}</span>
                                    <span className="text-sm text-muted-foreground">/month</span>
                                </p>
                                <ul className="space-y-3">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-2 text-sm">
                                            <Check className="h-4 w-4 shrink-0 text-success-badge-foreground"/>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full"
                                    variant={isHighlighted ? "default" : "accent"}
                                    aria-pressed={isSelected}
                                    onClick={() => setSelectedPlan(plan.id)}
                                >
                                    {isSelected ? <><Check/> Selected</> : plan.cta}
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        </section>
    );
}

const plans: Plan[] = [
    {
        id: "free",
        name: "Free",
        tagline: "Perfect for getting started",
        monthlyPrice: 0,
        cta: "Get Started",
        features: ["Up to 10 bookings/month", "Basic scheduling tools", "Customer notifications", "Payment processing", "Email support"],
    },
    {
        id: "standard",
        name: "Standard",
        tagline: "For growing businesses",
        monthlyPrice: 29,
        cta: "Choose Standard",
        popular: true,
        features: ["Unlimited bookings", "Advanced scheduling", "Customer management", "Analytics dashboard", "Priority support", "Marketing tools"],
    },
    {
        id: "pro",
        name: "Pro",
        tagline: "For established businesses",
        monthlyPrice: 79,
        cta: "Choose Pro",
        features: ["Everything in Standard", "Multi-location support", "Advanced reporting", "API access", "Dedicated support", "Custom integrations"],
    },
];
