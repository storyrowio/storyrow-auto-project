import { Editor, EditorContent, useEditor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit';
import EditorTiptapToolbar from '@/components/form/editor/tiptap/components/toolbars/toolbar';
import Link from '@/components/form/editor/tiptap/components/extensions/link-extension';
import { TextAlign } from '@tiptap/extension-text-align';
import { Highlight } from '@tiptap/extension-highlight';
import { Underline } from "@tiptap/extension-underline"
import Dropcursor from '@tiptap/extension-dropcursor'
import Image from '@tiptap/extension-image'
import TextStyle from '@/components/form/editor/tiptap/components/toolbars/text-style';
import { useEffect, useRef } from 'react';

const extensions = [
    StarterKit,
    TextAlign.configure({
        types: ['heading', 'paragraph'],
    }),
    Highlight,
    Underline,
    Image,
    Dropcursor,
    Link.configure({ openOnClick: false }),
]

const content = '<p>Hello World!</p>'

const editorProps = {
    attributes: {
        class: 'min-h-[300px] py-8 px-4 prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
    }
};

const options: never = {
    content,
    editorProps,
    extensions
}

const EditorTiptap = (props) => {
    const { onChange, initialValue } = props;
    const editor: Editor | null = useEditor(options);

    const mounted = useRef(false);
    useEffect(() => {
        if (!mounted.current && initialValue) {
            editor?.commands.setContent(initialValue);
            mounted.current = true
        }
    }, [editor?.commands, initialValue]);

    useEffect(() => {
        if (onChange) {
            onChange(editor?.getHTML());
        }
    }, [editor]);

    return (
        <>
            <EditorTiptapToolbar editor={editor}/>
            <EditorContent editor={editor} />
            <BubbleMenu editor={editor} className="p-2 bg-gray-50 shadow-sm border border-gray-200 rounded-lg">
                <TextStyle editor={editor}/>
            </BubbleMenu>
        </>
    )
}

export default EditorTiptap
