'use client'

import {usePathname} from "next/navigation";
import SideBar from "@/(info)/_components/SideBar";
import {Separator} from "@/_components/shadcn/separator";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/_components/shadcn/card";
import {Clock, CreditCard, FileText, Headphones, Search, Wrench} from "lucide-react";

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
                        <p className="text-lg font-bold pl-1.5" >Key Features</p>
                        <div className="grid grid-cols-2 gap-4">
                            {keyFeatures.map((item) => {
                                const Icon = item.icon;
                                return(
                                    <Card key={item.title}>
                                        <CardHeader>
                                            <div className="flex gap-x-2">
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
                        <p className="text-lg font-bold pl-1.5">How It Works</p>
                        <Card>
                            <div className="flex flex-col gap-y-2">
                                {howItWorks.map((step) => (
                                    <CardHeader className="flex flex-row gap-x-2">
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