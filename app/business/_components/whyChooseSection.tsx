import {LucideIcon, Shield, Wrench} from "lucide-react";
import ImagePlaceholder from "@/business/_components/imagePlaceholder";

export default function WhyChooseSection() {
    return (
        <section className="space-y-8 lg:space-y-12">
            <div className="mx-auto max-w-3xl space-y-4 text-center">
                <h2 className="text-2xl font-bold">Why choose CarFix for service points</h2>
                <p className="text-muted-foreground">
                    Our platform is designed specifically for automotive service providers, offering tools and
                    features that help you manage your business more efficiently while reaching more customers.
                </p>
            </div>
            <div className="space-y-12 lg:space-y-16">
                {features.map(({icon: Icon, title, description, points}) => (
                    <div key={title} className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
                        <ImagePlaceholder className="h-56 sm:h-80 lg:h-[450px]"/>
                        <div className="space-y-4">
                            <h3 className="flex items-center gap-3 text-xl font-semibold">
                                <Icon className="h-5 w-5"/>
                                {title}
                            </h3>
                            <p className="text-muted-foreground">{description}</p>
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
