import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {ImageIcon} from "lucide-react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {useState} from "react";

export default function AddImageUrl({ editor }) {
    const [open, setOpen] = useState(false);
    const [url, setUrl] = useState(null);

    const handleSubmit = () => {
        setOpen(false);
        editor.chain().focus().setImage({ src: url }).run();
    };

    return (
        <Dialog open={open} onOpenChange={() => setOpen(!open)}>
            <DialogTrigger asChild>
                <Button variant="ghost">
                    <ImageIcon/>
                    Image
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Image Url</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                    <div className="grid gap-3">
                        <Label htmlFor="name-1">Image URL</Label>
                        <Input id="name-1" onChange={(e) => setUrl(e.target.value)}/>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleSubmit}>Add Url</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
