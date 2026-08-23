import {Card, CardContent} from "@/_components/shadcn/card";
import {Separator} from "@/_components/shadcn/separator";

export default function Page(){
    return(
        <div className="py-3">
            <section className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight">
                    Terms of Use
                </h1>
                <p className="text-muted-foreground">
                    Legal terms and conditions for using CarFix
                </p>
            </section>

            <Separator className="my-6" />

            <section className="flex flex-col gap-y-2">
                <Card>
                    <CardContent className="space-y-6 p-6">
                        {termsOfUseContent.map((item) => (
                            <div key={item.number} className="space-y-1">
                                <h2 className="text-xl font-bold">
                                    {item.number}. {item.title}
                                </h2>
                                <p className="text-muted-foreground">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </section>
        </div>
    )
}

const termsOfUseContent = [
    {
        number: 1,
        title: "Acceptance of Terms",
        description: "By accessing and using the CarFix platform, you accept and agree to be bound by the terms and provision of this agreement. These terms apply to all users of the service."
    },
    {
        number: 2,
        title: "Service Description",
        description: "CarFix provides a platform that connects customers with automotive service providers. We facilitate bookings but do not directly provide automotive services."
    },
    {
        number: 3,
        title: "User Responsibilities",
        description: "Users are responsible for providing accurate information, maintaining account security, and using the platform in accordance with these terms."
    },
    {
        number: 4,
        title: "Payment Terms",
        description: "Payment processing is handled securely through our platform. Refunds and cancellations are subject to individual service provider policies and our general terms."
    },
    {
        number: 5,
        title: "Limitation of Liability",
        description: "CarFix acts as an intermediary platform. While we verify service providers, the quality and execution of services is the responsibility of individual service providers."
    },
    {
        number: 6,
        title: "Privacy Policy",
        description: "We are committed to protecting your privacy. Personal information is collected and used in accordance with our Privacy Policy, which forms part of these terms."
    },
    {
        number: 7,
        title: "Modifications",
        description: "CarFix reserves the right to modify these terms at any time. Users will be notified of significant changes via email or platform notifications."
    },
    {
        number: 8,
        title: "Contact Information",
        description: "For questions about these terms, please contact us at legal@carfix.pl or through our customer support channels."
    }
];
