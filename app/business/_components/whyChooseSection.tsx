import {LucideIcon, Shield, Wrench} from "lucide-react";
import ImagePlaceholder from "@/business/_components/imagePlaceholder";

export default function WhyChooseSection() {
    return (
        <section className="space-y-6 lg:space-y-12">
            <div className="mx-auto max-w-3xl space-y-2 text-center lg:space-y-4">
                <h2 className="text-base font-semibold lg:text-2xl lg:font-bold">Why choose CarFix for service points</h2>
                <p className="text-sm text-muted-foreground lg:text-base">
                    Our platform is designed specifically for automotive service providers, offering tools and
                    features that help you manage your business more efficiently while reaching more customers.
                </p>
            </div>
            <div className="space-y-8 lg:space-y-16">
                {features.map(({icon: Icon, title, description, points}) => (
                    <div key={title} className="grid grid-cols-1 items-center gap-4 lg:grid-cols-2 lg:gap-12">
                        <ImagePlaceholder className="h-32 lg:h-[450px]"/>
                        <div className="space-y-3 lg:space-y-4">
                            <h3 className="flex items-center gap-2 text-base font-semibold lg:gap-3 lg:text-xl">
                                <Icon className="h-4 w-4 lg:h-5 lg:w-5"/>
                                {title}
                            </h3>
                            <p className="text-sm text-muted-foreground lg:text-base">{description}</p>
                            <ul className="list-disc space-y-2 pl-5 text-sm">
                                {points.map((point) => <li key={point}>{point}</li>)}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

const features: { icon: LucideIcon; title: string; description: string; points: string[] }[] = [
    {
        icon: Wrench,
        title: "Smart Booking Management",
        description: "Streamline your appointment scheduling with our intelligent booking system that prevents double-bookings and optimizes your daily workflow.",
        points: ["Real-time availability updates", "Automated confirmation messages", "Service duration optimization"],
    },
    {
        icon: Shield,
        title: "Trusted Payment System",
        description: "Secure, fast payments with automatic invoicing and detailed transaction records for better financial management.",
        points: ["Instant payment processing", "Automated invoice generation", "Financial reporting tools"],
    },
];
