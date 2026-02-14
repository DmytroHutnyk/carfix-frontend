import SideBar from "@/(info)/_components/SideBar";
import {Card, CardContent, CardHeader, CardTitle} from "@/_components/shadcn/card";
import {Separator} from "@/_components/shadcn/separator";
import ContactForm from "@/(info)/contacts/_components/ContactForm";

export default function Page(){
    return(
        <div className="flex mx-auto max-w-[1425px] px-[72px] py-6 min-h-[calc(100vh-115px)]">
            <div className="grid grid-cols-[256px_1fr] gap-5 flex-1">
                <SideBar/>
                <div className="py-3">
                    {/*-==-==-=-=-=-=--==-=-=-=-header-==-==-=-=-=-=-=-=-=---==*/}
                    <section className="space-y-3">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Contact Us
                        </h1>
                        <p className="text-muted-foreground">
                            Get in touch with our support team
                        </p>
                    </section>

                    <Separator className="my-6" />

                    {/*-==-==-=-=-=-=--==-=-=-=-Cards-==-==-=-=-=-=-=-=-=---==*/}
                    <section className="flex flex-col gap-y-2">
                        <div className="grid grid-cols-2 gap-4">
                            {/*-==-==-=-=-=-=--==-=-=-=-Support Info-==-==-=-=-=-=-=-=-=---==*/}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl">Support Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">

                                    {/*-==-==-=-=-=-=--==-=-=-=-Email-==-==-=-=-=-=-=-=-=---==*/}
                                    <div className="space-y-1">
                                        <p className="font-semibold">Email Support</p>
                                        <a 
                                            href="mailto:support@carfix.pl" 
                                            className="text-muted-foreground hover:underline"
                                        >
                                            support@carfix.pl
                                        </a>
                                    </div>

                                    {/*-==-==-=-=-=-=--==-=-=-=-Phone-==-==-=-=-=-=-=-=-=---==*/}
                                    <div className="space-y-1">
                                        <p className="font-semibold">Phone Support</p>
                                        <a 
                                            href="tel:+48221234567" 
                                            className="text-muted-foreground hover:underline"
                                        >
                                            +48 22 123 4567
                                        </a>
                                        <p className="text-sm text-muted-foreground">Mon-Fri 8:00-18:00</p>
                                    </div>

                                    {/*-==-==-=-=-=-=--==-=-=-=-Address-==-==-=-=-=-=-=-=-=---==*/}
                                    <div className="space-y-1">
                                        <p className="font-semibold">Business Address</p>
                                        <div className="text-muted-foreground">
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
            </div>
        </div>
        
    )
}
