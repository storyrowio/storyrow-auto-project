import * as React from "react"
import { isNodeSelection } from "@tiptap/react";
import { isNodeInSchema } from "@/lib/tiptap-utils"
import {ListIcon, ListOrderedIcon, ListTodoIcon} from "lucide-react";
import {Button} from "@/components/ui/button";

export const listOptions = [
  {
    label: "Bullet List",
    type: "bulletList",
    icon: ListIcon,
  },
  {
    label: "Ordered List",
    type: "orderedList",
    icon: ListOrderedIcon,
  },
  {
    label: "Task List",
    type: "taskList",
    icon: ListTodoIcon,
  },
]

export const listShortcutKeys = {
  bulletList: "Ctrl-Shift-8",
  orderedList: "Ctrl-Shift-7",
  taskList: "Ctrl-Shift-9",
}

export function canToggleList(editor, type) {
  if (!editor) {
    return false
  }

  switch (type) {
    case "bulletList":
      return editor.can().toggleBulletList();
    case "orderedList":
      return editor.can().toggleOrderedList();
    case "taskList":
      return editor.can().toggleList("taskList", "taskItem");
    default:
      return false
  }
}

export function isListActive(editor, type) {
  if (!editor) return false

  switch (type) {
    case "bulletList":
      return editor.isActive("bulletList");
    case "orderedList":
      return editor.isActive("orderedList");
    case "taskList":
      return editor.isActive("taskList");
    default:
      return false
  }
}

export function toggleList(editor, type) {
  if (!editor) return

  switch (type) {
    case "bulletList":
      editor.chain().focus().toggleBulletList().run()
      break
    case "orderedList":
      editor.chain().focus().toggleOrderedList().run()
      break
    case "taskList":
      editor.chain().focus().toggleList("taskList", "taskItem").run()
      break
  }
}

export function getListOption(type) {
  return listOptions.find((option) => option.type === type);
}

export function shouldShowListButton(params) {
  const { editor, type, hideWhenUnavailable, listInSchema } = params

  if (!listInSchema || !editor) {
    return false
  }

  if (hideWhenUnavailable) {
    if (
      isNodeSelection(editor.state.selection) ||
      !canToggleList(editor, type)
    ) {
      return false
    }
  }

  return true
}

export function useListState(editor, type) {
  const listInSchema = isNodeInSchema(type, editor)
  const listOption = getListOption(type)
  const isActive = isListActive(editor, type)
  const shortcutKey = listShortcutKeys[type]

  return {
    listInSchema,
    listOption,
    isActive,
    shortcutKey,
  }
}

export const ListButton = React.forwardRef((
  {
    editor,
    type,
    hideWhenUnavailable = false,
    className = "",
    onClick,
    text,
    children,
    ...buttonProps
  },
  ref
) => {
  const { listInSchema, listOption, isActive, shortcutKey } = useListState(editor, type)

  const Icon = listOption?.icon || ListIcon

  const handleClick = React.useCallback((e) => {
    onClick?.(e)

    if (!e.defaultPrevented && editor) {
      toggleList(editor, type)
    }
  }, [onClick, editor, type])

  const show = React.useMemo(() => {
    return shouldShowListButton({
      editor,
      type,
      hideWhenUnavailable,
      listInSchema,
    });
  }, [editor, type, hideWhenUnavailable, listInSchema])

  if (!show || !editor || !editor.isEditable) {
    return null
  }

  return (
    <Button
      type="button"
      className={`w-full ${className.trim()}`}
      variant="ghost"
      data-active-state={isActive ? "on" : "off"}
      role="button"
      tabIndex={-1}
      aria-label={listOption?.label || type}
      aria-pressed={isActive}
      tooltip={listOption?.label || type}
      shortcutKeys={shortcutKey}
      onClick={handleClick}
      {...buttonProps}
      ref={ref}>
      {children || (
        <>
          <Icon className="tiptap-button-icon" />
          {text && <span className="tiptap-button-text">{text}</span>}
        </>
      )}
    </Button>
  );
})

ListButton.displayName = "ListButton"

export default ListButton
