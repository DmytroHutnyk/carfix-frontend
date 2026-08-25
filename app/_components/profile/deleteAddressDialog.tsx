'use client'

import {useState} from "react";

import {useUpdateAddress} from "@/features/user/useUpdateAddress";
import {toDisplayError} from "@/lib/errorHandler";
import {ApiError} from "@/lib/apiTypes";

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/_components/shadcn/alert-dialog";
import {Button} from "@/_components/shadcn/button";
import FormErrorAlert from "@/_components/formErrorAlert";

export default function DeleteAddressDialog({open, onOpenChange}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const {deleteAddress} = useUpdateAddress();

    const onConfirm = async () => {
        setError(null);
        setIsDeleting(true);
        try {
            await deleteAddress();
            onOpenChange(false);
        } catch (err) {
            setError(toDisplayError(err as ApiError).message);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="w-[calc(100%-2rem)] rounded-lg">
                <AlertDialogHeader>
                    <AlertDialogTitle>Remove your address?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Your saved address is deleted. You can add a new one at any time.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2 lg:gap-0">
                    <AlertDialogCancel className="h-8 rounded-md px-3 text-xs lg:h-9 lg:px-4 lg:py-2 lg:text-sm" disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <Button variant="destructive" size="sm" className="lg:h-9 lg:px-4 lg:py-2 lg:text-sm" onClick={onConfirm} disabled={isDeleting}>
                        {isDeleting ? "Removing..." : "Remove"}
                    </Button>
                </AlertDialogFooter>
                <FormErrorAlert message={error}/>
            </AlertDialogContent>
        </AlertDialog>
    )
}
