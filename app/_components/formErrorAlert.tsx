import {AlertCircle} from "lucide-react";
import {Alert, AlertDescription} from "@/_components/shadcn/alert";

export default function FormErrorAlert({message, className}: {message: string | null, className?: string}) {
    if (!message) {
        return null;
    }

    return (
        <Alert variant="destructive" className={className}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="whitespace-pre-line">{message}</AlertDescription>
        </Alert>
    );
}
