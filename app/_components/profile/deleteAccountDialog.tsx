'use client'

import {useState} from "react";
import {useRouter} from "next/navigation";

import {useDeleteAccount} from "@/features/user/useDeleteAccount";
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

export default function DeleteAccountDialog({open, onOpenChange}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const {deleteAccount} = useDeleteAccount();

    const onConfirm = async () => {
        setError(null);
        setIsDeleting(true);
        try {
            await deleteAccount();
            router.replace("/");
        } catch (err) {
            setError(toDisplayError(err as ApiError).message);
            setIsDeleting(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="w-[calc(100%-2rem)] rounded-lg">
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This permanently deletes your account and all of its data, including your
                        cars and bookings. This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2 lg:gap-0">
                    <AlertDialogCancel className="h-8 rounded-md px-3 text-xs lg:h-9 lg:px-4 lg:py-2 lg:text-sm" disabled={isDeleting}>
                        Cancel
                    </AlertDialogCancel>
                    <Button variant="destructive" size="sm" className="lg:h-9 lg:px-4 lg:py-2 lg:text-sm" onClick={onConfirm} disabled={isDeleting}>
                        {isDeleting ? "Deleting..." : "Delete account"}
                    </Button>
                </AlertDialogFooter>
                <FormErrorAlert message={error}/>
            </AlertDialogContent>
        </AlertDialog>
    )
}
