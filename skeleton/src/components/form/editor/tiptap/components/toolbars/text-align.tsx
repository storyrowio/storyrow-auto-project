import { Button } from '@/components/ui/button';
import { AlignCenter, AlignJustify, AlignLeft, AlignRight } from 'lucide-react';

export default function TextAlign({ editor }) {
    return (
        <>
            <Button variant="ghost" size="icon" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}>
                <AlignLeft/>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}>
                <AlignCenter/>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}>
                <AlignRight/>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}>
                <AlignJustify/>
            </Button>
        </>
    )
}
