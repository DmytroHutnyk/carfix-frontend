import {Card, CardContent, CardHeader, CardTitle} from "@/_components/shadcn/card";
import {Separator} from "@/_components/shadcn/separator";
import ContactForm from "@/(main)/(info)/contacts/_components/ContactForm";

export default function Page(){
    return(
        <div className="py-3">
            {/*-==-==-=-=-=-=--==-=-=-=-header-==-==-=-=-=-=-=-=-=---==*/}
            <section className="space-y-1.5 lg:space-y-3">
                <h1 className="text-lg font-semibold tracking-tight lg:text-3xl lg:font-bold">
                    Contact Us
                </h1>
                <p className="text-sm text-muted-foreground lg:text-base">
                    Get in touch with our support team
                </p>
            </section>

            <Separator className="my-4 lg:my-6" />

            {/*-==-==-=-=-=-=--==-=-=-=-Cards-==-==-=-=-=-=-=-=-=---==*/}
            <section className="flex flex-col gap-y-2">
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4">
                    {/*-==-==-=-=-=-=--==-=-=-=-Support Info-==-==-=-=-=-=-=-=-=---==*/}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base lg:text-xl">Support Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 lg:space-y-6">

                            {/*-==-==-=-=-=-=--==-=-=-=-Email-==-==-=-=-=-=-=-=-=---==*/}
                            <div className="space-y-1">
                                <p className="text-sm font-semibold lg:text-base">Email Support</p>
                                <a
                                    href="mailto:support@carfix.pl"
                                    className="text-sm text-muted-foreground hover:underline lg:text-base"
                                >
                                    support@carfix.pl
                                </a>
                            </div>

                            {/*-==-==-=-=-=-=--==-=-=-=-Phone-==-==-=-=-=-=-=-=-=---==*/}
                            <div className="space-y-1">
                                <p className="text-sm font-semibold lg:text-base">Phone Support</p>
                                <a
                                    href="tel:+48221234567"
                                    className="text-sm text-muted-foreground hover:underline lg:text-base"
                                >
                                    +48 22 123 4567
                                </a>
                                <p className="text-xs text-muted-foreground lg:text-sm">Mon-Fri 8:00-18:00</p>
                            </div>

                            {/*-==-==-=-=-=-=--==-=-=-=-Address-==-==-=-=-=-=-=-=-=---==*/}
                            <div className="space-y-1">
                                <p className="text-sm font-semibold lg:text-base">Business Address</p>
                                <div className="text-sm text-muted-foreground lg:text-base">
                                    <p>CarFix Sp. z o.o.</p>
                                    <p>ul. Marszałkowska 100</p>
                                    <p>00-026 Warszawa, Poland</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>


                    {/*-==-==-=-=-=-=--==-=-=-=-Message form-==-==-=-=-=-=-=-=-=---==*/}
                    <ContactForm/>
                </div>
            </section>
        </div>

    )
}
