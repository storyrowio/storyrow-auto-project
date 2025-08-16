import UndoRedoButton from '@/components/form/editor/tiptap/components/toolbars/undo-redo-button';
import { Separator } from '@radix-ui/react-select';
import HeadingDropdown from '@/components/form/editor/tiptap/components/toolbars/heading-dropdown';
import TextStyle from '@/components/form/editor/tiptap/components/toolbars/text-style';
import TextAlign from '@/components/form/editor/tiptap/components/toolbars/text-align';
import ListDropdownMenu from '@/components/form/editor/tiptap/components/toolbars/list-dropdown-menu';
import CodeBlockButton from '@/components/form/editor/tiptap/components/toolbars/code-block-button';
import BlockquoteButton from '@/components/form/editor/tiptap/components/toolbars/blockquote-button';
import AddImageUrl from '@/components/form/editor/tiptap/components/toolbars/image-url';

export default function EditorTiptapToolbar({ editor }) {
    return (
        <div className="pb-1 border-b border-gray-200">
            <div className="flex flex-wrap items-center gap-1">
                <UndoRedoButton action="undo" editor={editor}/>
                <UndoRedoButton action="redo" editor={editor}/>
                <Separator orientation="vertical" className="w-[1px] !h-7 mx-1 bg-gray-300"/>
                <HeadingDropdown editor={editor}/>
                <ListDropdownMenu editor={editor}/>
                <Separator orientation="vertical" className="w-[1px] !h-7 mx-1 bg-gray-300"/>
                <TextStyle editor={editor}/>
                <TextAlign editor={editor}/>
                <Separator orientation="vertical" className="w-[1px] !h-7 mx-1 bg-gray-300"/>
                <BlockquoteButton editor={editor}/>
                <CodeBlockButton editor={editor}/>
                <Separator orientation="vertical" className="w-[1px] !h-7 mx-1 bg-gray-300"/>
                <AddImageUrl editor={editor}/>
            </div>
        </div>
    )
}
