import {Separator} from "@/_components/shadcn/separator";

export default function BusinessTermsOfUsePage() {
    return (
        <main className="mx-auto max-w-4xl px-[72px] py-12">
            <section className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight">Terms of Use for Service Providers</h1>
                <p className="text-muted-foreground">
                    Legal terms and conditions for workshops and service points listing on CarFix
                </p>
            </section>

            <Separator className="my-6"/>

            <section className="space-y-8">
                {terms.map((item) => (
                    <div key={item.number}>
                        <h2 className="mb-2 text-xl font-bold">
                            {item.number}. {item.title}
                        </h2>
                        <p className="text-muted-foreground">{item.description}</p>
                    </div>
                ))}
            </section>
        </main>
    );
}

const terms = [
    {
        number: 1,
        title: "Acceptance of Terms",
        description: "By registering a service point on CarFix or using the CarFix business tools, you accept and agree to be bound by these Terms of Use for Service Providers. They apply in addition to the general CarFix Terms of Use.",
    },
    {
        number: 2,
        title: "Eligibility and Account",
        description: "Only legally registered businesses may list service points. You must provide accurate company details, including tax and registry identifiers, keep them up to date, and keep your account credentials confidential. You are responsible for all activity under your account, including that of your employees.",
    },
    {
        number: 3,
        title: "Service Point Listings",
        description: "You are responsible for the accuracy of your listings: services offered, prices, opening hours, equipment, and location. Listings that are misleading, incomplete, or violate applicable law may be suspended or removed.",
    },
    {
        number: 4,
        title: "Bookings and Availability",
        description: "Bookings made through CarFix are confirmed instantly based on the availability you publish. You agree to honour confirmed bookings and to keep your availability, service durations, and bay assignments accurate so that customers are never double-booked.",
    },
    {
        number: 5,
        title: "Cancellations and No-Shows",
        description: "You may cancel a booking only for a legitimate reason and must notify the customer through the platform as early as possible. Repeated late cancellations or no-shows on your side may affect your visibility in search results and may lead to suspension.",
    },
    {
        number: 6,
        title: "Subscription Plans and Fees",
        description: "CarFix offers Free, Standard, and Pro plans billed monthly. Plan features and prices are those shown on the CarFix for Business page at the time of purchase. You may upgrade, downgrade, or cancel at any time; changes take effect from the next billing period. There are no setup fees or long-term commitments.",
    },
    {
        number: 7,
        title: "Payments and Payouts",
        description: "Where payments are processed through CarFix, funds are transferred to your designated bank account within 2-3 business days after the service is completed, less any applicable fees. You are responsible for issuing invoices to customers and for all taxes related to your services.",
    },
    {
        number: 8,
        title: "Reviews and Conduct",
        description: "Customers may review completed services. You may respond to reviews but may not offer incentives for positive reviews, post fake reviews, or attempt to remove honest feedback. You agree to treat customers professionally and to comply with consumer protection law.",
    },
    {
        number: 9,
        title: "Data Protection",
        description: "You will receive customer personal data (such as name, contact details, and vehicle information) solely to perform the booked service. You must process it in accordance with the GDPR and CarFix's Privacy Policy and must not use it for unrelated marketing.",
    },
    {
        number: 10,
        title: "Intellectual Property",
        description: "You grant CarFix a non-exclusive licence to display your business name, logo, photos, and listing content on the platform and in CarFix marketing. You confirm that you hold the rights to all content you upload.",
    },
    {
        number: 11,
        title: "Limitation of Liability",
        description: "CarFix is an intermediary platform and is not a party to the service contract between you and the customer. CarFix is not liable for the quality or outcome of services, and its liability towards you is limited to the fees you paid to CarFix in the preceding 12 months.",
    },
    {
        number: 12,
        title: "Suspension and Termination",
        description: "CarFix may suspend or terminate your account for breach of these terms, fraudulent activity, or repeated customer complaints. You may close your account at any time; outstanding bookings must be honoured or properly cancelled first.",
    },
    {
        number: 13,
        title: "Changes to These Terms",
        description: "CarFix may update these terms. Material changes will be announced by email or in the business dashboard at least 14 days before they take effect. Continued use of the platform after that date constitutes acceptance.",
    },
    {
        number: 14,
        title: "Contact",
        description: "Questions about these terms: legal@carfix.pl, or write to CarFix Sp. z o.o., ul. Marszałkowska 100, 00-026 Warszawa, Poland.",
    },
];
