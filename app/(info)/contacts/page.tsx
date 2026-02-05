'use client'

import {usePathname} from "next/navigation";
import SideBar from "@/(info)/_components/SideBar";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/_components/shadcn/card";
import {Separator} from "@/_components/shadcn/separator";
import {useForm} from "react-hook-form";
import {HelpMessage, messageSchema} from "@/util/types/authTypes";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/_components/shadcn/input";
import {Textarea} from "@/_components/shadcn/textarea";
import {Button} from "@/_components/shadcn/button";
import {OrbitProgress} from "react-loading-indicators";



export default function Page(){
    const pathname = usePathname();
    const {
        register,
        handleSubmit,
        reset,
        formState: {errors, isSubmitting}
    } = useForm<HelpMessage>({
        resolver: zodResolver(messageSchema),
        mode: "onSubmit",
    });

    const onSubmit = async (messageData: HelpMessage) =>{
        await new Promise((resolve, reject) => setTimeout(resolve, 1000));
        {/*TODO implement the function*/}
        reset();
    }

    return(
        <div className="flex mx-auto max-w-[1425px] px-[72px] py-6 min-h-[calc(100vh-115px)]">
            <div className="grid grid-cols-[256px_1fr] gap-5 flex-1">
                <SideBar pathName={pathname}/>
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
                            <Card className="flex flex-col">
                                {/*TODO display loading only on the card itself*/}
                                {isSubmitting && (
                                    <div className="absolute inset-0 z-20 flex items-center justify-center rounded-xl bg-card/75 ">
                                        <OrbitProgress
                                            color="var(--primary)"
                                            size="large"
                                            text=""
                                            textColor=""
                                            dense
                                        />
                                    </div>
                                    )
                                }
                                <CardHeader>
                                    <CardTitle className="text-xl">Send us a message</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1">
                                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col h-full">
                                        <div className="space-y-2">
                                            <div className="space-y-1">
                                                <Input
                                                    {...register("name")}
                                                    id="name"
                                                    type="text"
                                                    placeholder="Name"
                                                    className={`${errors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                                />
                                                {errors.name && (
                                                    <p id="email-error" className="text-sm text-destructive">
                                                        {errors.name.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-1">
                                                <Input
                                                    {...register("email")}
                                                    id="email"
                                                    type="email"
                                                    placeholder="Email"
                                                    className={`${errors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                                />
                                                {errors.email && (
                                                    <p id="email-error" className="text-sm text-destructive">
                                                        {errors.email.message}
                                                    </p>
                                                )}
                                            </div>

                                            <div className="space-y-1">
                                                <Textarea
                                                    {...register("message")}
                                                    id="message"
                                                    placeholder="Message"
                                                    rows={4}
                                                    className={`resize-none ${errors.message ? "border-destructive focus-visible:ring-destructive" : ""}`}
                                                />
                                                {errors.message && (
                                                    <p id="email-error" className="text-sm text-destructive">
                                                        {errors.message.message}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mt-auto pt-4">
                                            <Button
                                                type="submit"
                                                variant="default"
                                                className="w-full"
                                            >
                                                Send
                                            </Button>
                                        </div>
                                    </form>
                                    {/*TODO display success message or errors if there are any*/}
                                </CardContent>
                            </Card>
                        </div>
                    </section>
                </div>
            </div>
        </div>
        
    )
}
