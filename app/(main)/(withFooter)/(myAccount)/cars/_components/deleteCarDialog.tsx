'use client'

import {useState} from "react";

import {CarProfile} from "@/util/types/carProfileTypes";
import {useCarProfiles} from "@/util/hooks/useCarProfiles";
import {toDisplayError} from "@/util/func/errorHandler";
import {ApiError} from "@/util/types/apiTypes";

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
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete {carProfile.name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This removes the car profile permanently. Bookings already made are not affected.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
                        {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                </AlertDialogFooter>
                <FormErrorAlert message={error}/>
            </AlertDialogContent>
        </AlertDialog>
    )
}
