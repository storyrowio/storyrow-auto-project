import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {useMemo, useState} from "react";
import {ChevronDown} from "lucide-react";

export default function HeadingDropdown({ editor }) {
    const [activeOption, setActiveOption] = useState({});

    const options = useMemo(() => {
        if (editor === null) {
            return [];
        }

        return [
            {
                label: 'Heading 1',
                className: 'text-2xl font-semibold',
                onclick: () => editor.chain().focus().toggleHeading({ level: 1 }).run()
            },
            {
                label: 'Heading 2',
                className: 'text-xl font-semibold',
                onclick: () => editor.chain().focus().toggleHeading({ level: 2 }).run()
            },
            {
                label: 'Heading 3',
                className: 'text-xl font-semibold',
                onclick: () => editor.chain().focus().toggleHeading({ level: 3 }).run()
            },
            {
                label: 'Heading 2',
                className: 'text-xl font-semibold',
                onclick: () => editor.chain().focus().toggleHeading({ level: 2 }).run()
            },
            {
                label: 'Paragraph',
                onclick: () => editor.chain().focus().setParagraph().run()
            },
        ]
    }, [editor]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                    {activeOption?.label ?? 'Paragraph'}
                    <ChevronDown className="size-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-56" align="start">
                <DropdownMenuGroup>
                    {options.map((e, i) => {
                        return (
                            <DropdownMenuItem key={i} className={e.className ?? ''} onClick={() => {
                                e.onclick();
                                setActiveOption(e);
                            }}>
                                {e.label}
                            </DropdownMenuItem>
                        )
                    })}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
