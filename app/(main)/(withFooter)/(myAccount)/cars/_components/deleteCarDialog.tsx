'use client'

import {useState} from "react";

import {CarProfile} from "@/features/carProfile/carProfileTypes";
import {useCarProfiles} from "@/features/carProfile/useCarProfiles";
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

export default function DeleteCarDialog({open, onOpenChange, carProfile}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    carProfile: CarProfile;
}) {
    const [error, setError] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const {deleteCarProfile} = useCarProfiles({enabled: false});

    const onConfirm = async () => {
        setError(null);
        setIsDeleting(true);
        try {
            await deleteCarProfile(carProfile.id);
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
                    <AlertDialogTitle>Delete {carProfile.name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This removes the car profile permanently. Bookings already made are not affected.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2 lg:gap-0">
                    <AlertDialogCancel className="h-8 rounded-md px-3 text-xs lg:h-9 lg:px-4 lg:py-2 lg:text-sm" disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <Button variant="destructive" size="sm" className="lg:h-9 lg:px-4 lg:py-2 lg:text-sm" onClick={onConfirm} disabled={isDeleting}>
                        {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                </AlertDialogFooter>
                <FormErrorAlert message={error}/>
            </AlertDialogContent>
        </AlertDialog>
    )
}
