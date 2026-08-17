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
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Remove your address?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Your saved address is deleted. You can add a new one at any time.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
                        {isDeleting ? "Removing..." : "Remove"}
                    </Button>
                </AlertDialogFooter>
                <FormErrorAlert message={error}/>
            </AlertDialogContent>
        </AlertDialog>
    )
}
