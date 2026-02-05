'use client'

import {usePathname} from "next/navigation";
import SideBar from "@/(info)/_components/SideBar";
import {Separator} from "@/_components/shadcn/separator";
import {Card, CardDescription, CardHeader, CardTitle} from "@/_components/shadcn/card";
import {Clock, CreditCard, FileText, Headphones, Search, Shield, Star, Wrench} from "lucide-react";
import {Avatar, AvatarFallback} from "@/_components/shadcn/avatar";
import {Badge} from "@/_components/shadcn/badge";

export default function Page(){
    const pathname = usePathname();

    return(
        <div className="flex mx-auto max-w-[1425px] px-[72px] py-6 min-h-[calc(100vh-115px)]">
            <div className="grid grid-cols-[256px_1fr] gap-5 flex-1">
                <SideBar pathName={pathname}/>
                <div className="py-3">
                    <section className="text-center space-y-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Your trusted automotive service platform
                        </h1>
                        <p className="text-muted-foreground">
                            Connect with verified automotive service providers. Book appointments,
                            compare prices, and get your car serviced with confidence and convenience.
                        </p>
                    </section>

                    <Separator className="my-6" />

                    <section className="flex flex-col gap-y-2">
                        <p className="text-lg font-semibold pl-1.5">Key Features</p>
                        <div className="grid grid-cols-2 gap-4">
                            {keyFeatures.map((item) => {
                                const Icon = item.icon;
                                return(
                                    <Card key={item.title}>
                                        <CardHeader>
                                            <div className="flex gap-x-2 items-center">
                                                <Icon className="size-5"></Icon>
                                                <CardTitle>{item.title}</CardTitle>
                                            </div>
                                            <CardDescription className="pl-[28px]">
                                                {item.description}
                                            </CardDescription>
                                        </CardHeader>
                                    </Card>
                                )
                            })}
                        </div>
                    </section>

                    <Separator className="my-6"/>

                    <section className="flex flex-col gap-y-2">
                        <p className="text-lg font-semibold pl-1.5">How It Works</p>
                        <Card className="py-4">
                            <div className="flex flex-col gap-y-4">
                                {howItWorks.map((step) => (
                                    <CardHeader key={step.number} className="flex flex-row gap-x-2 py-2">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center text-white font-semibold text-lg shadow-sm">
                                            {step.number}
                                        </div>
                                        <div className="h-10 flex flex-col justify-between">
                                            <CardTitle>
                                                {step.title}
                                            </CardTitle>
                                            <CardDescription>
                                                {step.description}
                                            </CardDescription>
                                        </div>
                                    </CardHeader>
                                ))}
                            </div>
                        </Card>
                    </section>
                    <Separator className="my-6" />
                    <section className="flex flex-col gap-y-2">
                        <Card className="bg-muted">
                            <CardHeader>
                                <div className="flex gap-x-2 items-center">
                                    <Shield className="size-5"></Shield>
                                    <CardTitle className="font-semibold">Trust & Safety</CardTitle>
                                    <Badge variant="outline">No prepayment</Badge>
                                </div>
                                <CardDescription className="pl-[28px]">
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>All service providers are verified and background-checked</li>
                                        <li>Clear, upfront pricing with no hidden fees</li>
                                        <li>Service warranties shown where provided by partners</li>
                                        <li>Your personal data is protected with industry-standard encryption</li>
                                    </ul>
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </section>

                    <Separator className="my-6" />
                    <section className="flex flex-col gap-y-2">
                        <p className="text-lg font-semibold pl-1.5">What Our Customers Say</p>
                        <div className="grid grid-cols-2 gap-4">
                            {reviews.map((testimonial) => (
                                <Card key={testimonial.name}>
                                    <CardHeader>
                                        <div className="flex gap-x-3 items-start">
                                            <Avatar>
                                                <AvatarFallback className="bg-muted text-muted-foreground font-medium">
                                                    {testimonial.initials}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <CardTitle>{testimonial.name}</CardTitle>
                                                <div className="flex gap-0.5 mt-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className="size-4 fill-foreground text-foreground"
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <CardDescription className="pt-2">
                                            "{testimonial.review}"
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                    </section>
                    {/*TODO rest of the page*/}
                </div>
            </div>
        </div>
    )
}

const keyFeatures = [
    {
        icon: Wrench,
        title: "Expert Services",
        description: "From routine maintenance to complex repairs, our verified providers offer comprehensive automotive services with transparent pricing and quality guarantees."
    },
    {
        icon: Search,
        title: "Easy Discovery",
        description: "Search and compare service providers by location, price, and ratings. Find the perfect match for your vehicle's needs with detailed provider profiles."
    },
    {
        icon: Clock,
        title: "Flexible Scheduling",
        description: "Book appointments that fit your schedule with real-time availability. Get instant confirmation and reminders to keep your car maintenance on track."
    },
    {
        icon: CreditCard,
        title: "Transparent Pricing",
        description: "No hidden fees or surprise charges. See upfront pricing for all services and pay directly at the service location after work is completed."
    },
    {
        icon: FileText,
        title: "Service Records",
        description: "Keep track of all your vehicle's service history in one place. Access digital receipts and maintenance records whenever you need them."
    },
    {
        icon: Headphones,
        title: "24/7 Support",
        description: "Our customer support team is available around the clock to help with bookings, questions, or any issues that may arise during your service experience."
    }
]

const howItWorks = [
    {
        number: 1,
        title: "Search & compare",
        description: "Find service providers near you"
    },
    {
        number: 2,
        title: "Pick a slot",
        description: "Choose your preferred date and time"
    },
    {
        number: 3,
        title: "Confirm booking",
        description: "Review details and confirm your appointment"
    },
    {
        number: 4,
        title: "Pay on site",
        description: "Complete payment after service is done"
    }
]

const reviews = [
    {
        initials: "MK",
        name: "Michat K.",
        review: "Quick booking, fair prices, and excellent service. My car was ready exactly when promised."
    },
    {
        initials: "AN",
        name: "Anna N.",
        review: "Finally found a reliable way to book car services. The platform is easy to use and trustworthy."
    }
]