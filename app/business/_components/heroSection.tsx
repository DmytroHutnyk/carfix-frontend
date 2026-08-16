import Link from "next/link";
import {Check} from "lucide-react";
import {Button} from "@/_components/shadcn/button";
import ImagePlaceholder from "@/business/_components/imagePlaceholder";

export default function HeroSection() {
    return (
        <section id="try-for-free" className="grid scroll-mt-6 grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div className="space-y-6">
                <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                    Grow Your Auto Service Business with CarFix
                </h1>
                <p className="text-lg text-muted-foreground">
                    Join thousands of service points connecting with customers through our trusted platform
                </p>
                <ul className="space-y-3">
                    {benefits.map((benefit) => (
                        <li key={benefit} className="flex items-center gap-3">
                            <Check className="h-5 w-5 shrink-0 text-success-badge-foreground"/>
                            <span>{benefit}</span>
                        </li>
                    ))}
                </ul>
                <div className="space-y-2">
                    <Button size="lg" asChild>
                        <Link href="/register">Try for Free</Link>
                    </Button>
                    <p className="text-sm text-muted-foreground">No credit card, cancel anytime</p>
                </div>
            </div>
            <ImagePlaceholder className="h-[450px]"/>
        </section>
    );
}

const benefits = [
    "Instant booking notifications",
    "Automated scheduling system",
    "Secure payment processing",
    "Customer review management",
    "Business analytics dashboard",
];
