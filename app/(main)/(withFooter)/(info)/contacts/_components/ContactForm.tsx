"use client"

import {useForm} from "react-hook-form";
import {HelpMessage, messageSchema} from "@/features/auth/authTypes";
import {zodResolver} from "@hookform/resolvers/zod";
import {cn} from "@/lib/utils";
import {OrbitProgress} from "react-loading-indicators";
import {Card, CardContent, CardHeader, CardTitle} from "@/_components/shadcn/card";
import {Input} from "@/_components/shadcn/input";
import {Textarea} from "@/_components/shadcn/textarea";
import {Button} from "@/_components/shadcn/button";

export default function ContactForm(){
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
        <Card className="relative flex flex-col">
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
                <CardTitle className="text-base lg:text-xl">Send us a message</CardTitle>
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
                                className={cn(errors.name && "border-destructive focus-visible:ring-destructive")}
                            />
                            {errors.name && (
                                <p id="name-error" className="text-xs text-destructive lg:text-sm">
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
                                className={cn(errors.email && "border-destructive focus-visible:ring-destructive")}
                            />
                            {errors.email && (
                                <p id="email-error" className="text-xs text-destructive lg:text-sm">
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
                                className={cn("resize-none", errors.message && "border-destructive focus-visible:ring-destructive")}
                            />
                            {errors.message && (
                                <p id="message-error" className="text-xs text-destructive lg:text-sm">
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
    )
}