import {Card, CardContent, CardHeader, CardTitle} from "@/_components/shadcn/card";

export default function SupportSection() {
    return (
        <section id="contact" className="scroll-mt-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl">Support Information</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <div className="space-y-1">
                        <p className="font-semibold">Email Support</p>
                        <a href="mailto:support@carfix.pl" className="text-muted-foreground hover:underline">
                            support@carfix.pl
                        </a>
                    </div>
                    <div className="space-y-1">
                        <p className="font-semibold">Phone Support</p>
                        <a href="tel:+48221234567" className="text-muted-foreground hover:underline">
                            +48 22 123 4567
                        </a>
                        <p className="text-sm text-muted-foreground">Mon-Fri 8:00-18:00</p>
                    </div>
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
        </section>
    );
}
