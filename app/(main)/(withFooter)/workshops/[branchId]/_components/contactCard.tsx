import {Mail, Phone} from "lucide-react";
import {Card, CardContent, CardHeader, CardTitle} from "@/_components/shadcn/card";

export default function ContactCard({phoneNumber, email}: { phoneNumber: string; email: string }) {
    return (
        <Card>
            <CardHeader><CardTitle>Contact</CardTitle></CardHeader>
            <CardContent className="flex flex-col gap-2">
                <a href={`tel:${phoneNumber}`}
                   className="flex items-center gap-3 rounded-lg bg-muted/50 p-3 text-sm hover:bg-muted">
                    <Phone className="h-4 w-4 shrink-0 text-muted-foreground"/>
                    {phoneNumber}
                </a>
                <a href={`mailto:${email}`}
                   className="flex items-center gap-3 rounded-lg bg-muted/50 p-3 text-sm hover:bg-muted">
                    <Mail className="h-4 w-4 shrink-0 text-muted-foreground"/>
                    <span className="truncate">{email}</span>
                </a>
            </CardContent>
        </Card>
    );
}
