import { Button } from '@/components/ui/button';
import { Bold, HighlighterIcon, Italic, Strikethrough, UnderlineIcon } from 'lucide-react';

export default function TextStyle({ editor }) {
    return (
        <>
            <Button variant="ghost" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : 'font-bold'}>
                <Bold/>
            </Button>
            <Button variant="ghost" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : 'italic'}>
                <Italic/>
            </Button>
            <Button variant="ghost" onClick={() => editor.chain().focus().toggleMark('underline').run()} className={editor.isActive('underline') ? 'is-active' : 'underline'}>
                <UnderlineIcon/>
            </Button>
            <Button variant="ghost" onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'is-active' : 'line-through'}>
                <Strikethrough/>
            </Button>
            <Button variant="ghost" size="icon" onClick={() => editor.chain().focus().toggleHighlight().run()} className={editor.isActive('highlight') ? 'is-active' : ''}>
                <HighlighterIcon/>
            </Button>
        </>
    )
}
