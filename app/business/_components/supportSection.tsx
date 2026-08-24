import {Card, CardContent, CardHeader, CardTitle} from "@/_components/shadcn/card";

export default function SupportSection() {
    return (
        <section id="contact" className="scroll-mt-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-base lg:text-xl">Support Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-8">
                    <div className="space-y-1">
                        <p className="text-sm font-semibold lg:text-base">Email Support</p>
                        <a href="mailto:support@carfix.pl" className="text-sm text-muted-foreground hover:underline lg:text-base">
                            support@carfix.pl
                        </a>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-semibold lg:text-base">Phone Support</p>
                        <a href="tel:+48221234567" className="text-sm text-muted-foreground hover:underline lg:text-base">
                            +48 22 123 4567
                        </a>
                        <p className="text-xs text-muted-foreground lg:text-sm">Mon-Fri 8:00-18:00</p>
                    </div>
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
        </section>
    );
}
