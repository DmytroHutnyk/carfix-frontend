import {Separator} from "@/_components/shadcn/separator";
import FaqAccordion from "@/(main)/(withFooter)/(info)/faq/_components/faqAccordion";

export default function Page(){
    return(
        <div className="py-3">
            <section className="space-y-3">
                <h1 className="text-3xl font-bold tracking-tight">
                    FAQ
                </h1>
                <p className="text-muted-foreground">
                    Answers to the questions we get most often
                </p>
            </section>

            <Separator className="my-6" />

            <FaqAccordion/>
        </div>
    )
}
