"use client"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Children } from "react";


export const ConfirmModal=({
    Children,
    onConfirm
})=>{
    return(
       <AlertDialog>
        <AlertDialogTrigger asChild>
            {Children}
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>
                    Are you sure?
                </AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>
                    Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={onConfirm}>
                    Continue
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
       </AlertDialog>
    )
}