import * as React from "react"
import { isNodeSelection } from "@tiptap/react";
import { isNodeInSchema } from "@/lib/tiptap-utils"
import { ListButton, canToggleList, isListActive, listOptions } from "./list-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {ChevronDownIcon, ListIcon} from "lucide-react";

export function canToggleAnyList(editor, listTypes) {
  if (!editor) return false
  return listTypes.some((type) => canToggleList(editor, type));
}

export function isAnyListActive(editor, listTypes) {
  if (!editor) return false
  return listTypes.some((type) => isListActive(editor, type));
}

export function getFilteredListOptions(availableTypes) {
  return listOptions.filter((option) => !option.type || availableTypes.includes(option.type));
}

export function shouldShowListDropdown(params) {
  const { editor, hideWhenUnavailable, listInSchema, canToggleAny } = params

  if (!listInSchema || !editor) {
    return false
  }

  if (hideWhenUnavailable) {
    if (isNodeSelection(editor.state.selection) || !canToggleAny) {
      return false
    }
  }

  return true
}

export function useListDropdownState(
    editor,
    availableTypes
) {
  const [isOpen, setIsOpen] = React.useState(false)

  const listInSchema = availableTypes.some((type) =>
      isNodeInSchema(type, editor))

  const filteredLists = React.useMemo(() => getFilteredListOptions(availableTypes), [availableTypes])

  const canToggleAny = canToggleAnyList(editor, availableTypes)
  const isAnyActive = isAnyListActive(editor, availableTypes)

  const handleOpenChange = React.useCallback((open, callback) => {
    setIsOpen(open)
    callback?.(open)
  }, [])

  return {
    isOpen,
    setIsOpen,
    listInSchema,
    filteredLists,
    canToggleAny,
    isAnyActive,
    handleOpenChange,
  }
}

export function useActiveListIcon(
    editor,
    filteredLists
) {
  return React.useCallback(() => {
    const activeOption = filteredLists.find((option) =>
        isListActive(editor, option.type))

    return activeOption ? (
        <activeOption.icon className="tiptap-button-icon" />
    ) : (
        <ListIcon className="tiptap-button-icon" />
    );
  }, [editor, filteredLists]);
}

export function ListDropdownMenu({
                                   editor,
                                   types = ["bulletList", "orderedList", "taskList"],
                                   hideWhenUnavailable = false,
                                   onOpenChange,
                                   ...props
                                 }) {
  const {
    isOpen,
    listInSchema,
    filteredLists,
    canToggleAny,
    isAnyActive,
    handleOpenChange,
  } = useListDropdownState(editor, types)

  const getActiveIcon = useActiveListIcon(editor, filteredLists)

  const show = React.useMemo(() => {
    return shouldShowListDropdown({
      editor,
      listTypes: types,
      hideWhenUnavailable,
      listInSchema,
      canToggleAny,
    });
  }, [editor, types, hideWhenUnavailable, listInSchema, canToggleAny])

  const handleOnOpenChange = React.useCallback(
      (open) => handleOpenChange(open, onOpenChange),
      [handleOpenChange, onOpenChange]
  )

  if (!show || !editor || !editor.isEditable) {
    return null
  }

  return (
      <DropdownMenu open={isOpen} onOpenChange={handleOnOpenChange}>
          <DropdownMenuTrigger asChild>
              <Button
                  type="button"
                  variant="ghost"
                  data-active-state={isAnyActive ? "on" : "off"}
                  role="button"
                  tabIndex={-1}
                  aria-label="List options"
                  tooltip="List"
                  {...props}>
                {getActiveIcon()}
                <ChevronDownIcon className="tiptap-button-dropdown-small" />
              </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
              <DropdownMenuGroup>
                  {filteredLists.map((option) => (
                      <DropdownMenuItem key={option.type} asChild className="mb-1">
                          <ListButton
                              editor={editor}
                              type={option.type}
                              text={option.label}
                              hideWhenUnavailable={hideWhenUnavailable}
                              tooltip={""} />
                      </DropdownMenuItem>
                  ))}
              </DropdownMenuGroup>
          </DropdownMenuContent>
      </DropdownMenu>
  );
}

export default ListDropdownMenu
