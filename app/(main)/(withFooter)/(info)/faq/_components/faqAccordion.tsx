"use client"

import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/_components/shadcn/accordion";

export default function FaqAccordion() {
    return (
        <Accordion type="multiple" className="flex flex-col gap-4">
            {faqs.map((faq) => (
                <AccordionItem
                    key={faq.id}
                    value={faq.id}
                    className="rounded-xl border bg-card px-6 text-card-foreground shadow"
                >
                    <AccordionTrigger className="text-base font-semibold hover:no-underline">
                        {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground">
                        {faq.answer}
                    </AccordionContent>
                </AccordionItem>
            ))}
        </Accordion>
    );
}

const faqs = [
    {
        id: "booking",
        question: "How do I book a service?",
        answer: "Search for a workshop, pick the services you need, then press Book now. You will see the free time slots for the next seven days and get an instant confirmation — there is no waiting for the workshop to accept.",
    },
    {
        id: "car",
        question: "Do I need to add my car before booking?",
        answer: "Yes. A booking is always tied to one of your cars, so add it under My Cars first and pick it in the header. That way the workshop knows the make, model and year before you arrive.",
    },
    {
        id: "multiple",
        question: "Can I book several services at once?",
        answer: "You can put up to three services in one visit. We only offer time slots long enough for all of them together, so you get one appointment instead of three.",
    },
    {
        id: "cancel",
        question: "How do I cancel or change a booking?",
        answer: "Open My Bookings and cancel the visit there. Please cancel at least 24 hours in advance so the slot can go to someone else.",
    },
    {
        id: "payment",
        question: "When and how do I pay?",
        answer: "You pay the workshop directly after the work is done. CarFix takes no prepayment and adds no booking fee — the price you see for a service is the price the workshop charges.",
    },
    {
        id: "prices",
        question: "Are the prices I see final?",
        answer: "They are the workshop's price for that service. If the mechanic finds extra work is needed, they will tell you and agree it with you before doing it.",
    },
];
