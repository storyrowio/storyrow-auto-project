'use client'

import {
    AlertDialog, AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogTitle,
    AlertDialogFooter, AlertDialogHeader
} from "@/components/ui/alert-dialog";
import PropTypes from "prop-types";
import {useState} from "react";

DeleteConfirmation.propTypes = {
    open: PropTypes.bool,
    onClose: PropTypes.func,
    onSubmit: PropTypes.func
};

export default function DeleteConfirmation(props: any) {
    const { open, onClose, onSubmit } = props;
    const [loadingDelete, setLoadingDelete] = useState(false);

    return (
        <AlertDialog open={open} onChangeOpen={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your
                        data and remove it from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={loadingDelete} variant="destructive" onClick={() => {
                        onSubmit();
                        setLoadingDelete(true);
                    }}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
