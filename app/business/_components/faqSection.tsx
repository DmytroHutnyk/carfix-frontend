"use client"

import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/_components/shadcn/accordion";
import {Separator} from "@/_components/shadcn/separator";
import FaqFeedback from "@/business/_components/faqFeedback";

export default function FaqSection() {
    return (
        <section id="faq" className="scroll-mt-6 space-y-5 lg:space-y-8">
            <h2 className="text-center text-base font-semibold lg:text-2xl lg:font-bold">Frequently asked questions</h2>
            <Accordion type="multiple" defaultValue={faqs.map((faq) => faq.id)} className="space-y-3 lg:space-y-4">
                {faqs.map((faq) => (
                    <AccordionItem
                        key={faq.id}
                        value={faq.id}
                        className="rounded-xl border bg-card px-4 text-card-foreground shadow lg:px-6"
                    >
                        <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline lg:text-base">
                            {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="space-y-3 lg:space-y-4">
                            <p className="text-xs text-muted-foreground lg:text-base">{faq.answer}</p>
                            <Separator/>
                            <FaqFeedback/>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </section>
    );
}

const faqs = [
    {
        id: "start",
        question: "How quickly can I start receiving bookings?",
        answer: "Once you complete your profile setup and verification, you can start receiving bookings within 24 hours. Our team reviews all new service points to ensure quality standards.",
    },
    {
        id: "payments",
        question: "What payment methods do you support?",
        answer: "We support all major credit cards, debit cards, and digital wallets. Payments are processed securely and transferred to your account within 2-3 business days.",
    },
    {
        id: "locations",
        question: "Can I manage multiple locations?",
        answer: "Yes, our Standard and Pro plans support multiple locations. You can manage all your service points from a single dashboard with location-specific analytics and scheduling.",
    },
    {
        id: "fees",
        question: "Is there a setup fee or long-term contract?",
        answer: "No setup fees and no long-term contracts required. You can start with our free plan and upgrade anytime. Cancel your subscription at any time with no penalties.",
    },
    {
        id: "support",
        question: "What kind of support do you provide?",
        answer: "We offer email support for all plans, priority support for Standard users, and dedicated phone support for Pro subscribers. Our help center is available 24/7.",
    },
    {
        id: "reviews",
        question: "How do customer reviews work?",
        answer: "Customers can leave reviews after their service is completed. You can respond to reviews and use our reputation management tools to maintain a positive online presence.",
    },
];
