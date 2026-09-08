import {Separator} from "@/_components/shadcn/separator";
import FaqAccordion from "@/(main)/(withFooter)/(info)/faq/_components/faqAccordion";

export default function Page(){
    return(
        <div className="py-3">
            <section className="text-center space-y-1.5 lg:space-y-3">
                <h1 className="text-lg font-semibold tracking-tight lg:text-3xl lg:font-bold">
                    FAQ
                </h1>
                <p className="text-sm text-muted-foreground lg:text-base">
                    Answers to the questions we get most often
                </p>
            </section>

            <Separator className="my-4 lg:my-6" />

            <FaqAccordion/>
        </div>
    )
}
