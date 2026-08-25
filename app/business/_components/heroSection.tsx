import Link from "next/link";
import {Check} from "lucide-react";
import {Button} from "@/_components/shadcn/button";
import ImagePlaceholder from "@/business/_components/imagePlaceholder";

export default function HeroSection() {
    return (
        <section id="try-for-free" className="grid scroll-mt-6 grid-cols-1 items-center gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-4 lg:space-y-6">
                <h1 className="text-2xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                    Grow Your Auto Service Business with CarFix
                </h1>
                <p className="text-sm text-muted-foreground lg:text-lg">
                    Join thousands of service points connecting with customers through our trusted platform
                </p>
                <ul className="space-y-2 text-sm lg:space-y-3 lg:text-base">
                    {benefits.map((benefit) => (
                        <li key={benefit} className="flex items-center gap-3">
                            <Check className="h-4 w-4 shrink-0 text-success-badge-foreground lg:h-5 lg:w-5"/>
                            <span>{benefit}</span>
                        </li>
                    ))}
                </ul>
                <div className="space-y-2">
                    <Button className="w-full lg:h-10 lg:w-auto lg:px-8" asChild>
                        <Link href="/business/register">Try for Free</Link>
                    </Button>
                    <p className="text-xs text-muted-foreground lg:text-sm">No credit card, cancel anytime</p>
                </div>
            </div>
            <ImagePlaceholder className="h-32 lg:h-[450px]"/>
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
