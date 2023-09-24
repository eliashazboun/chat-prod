import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Mention from "@tiptap/extension-mention";

import Placeholder from "@tiptap/extension-placeholder";
import { ReactRenderer } from '@tiptap/react'
import tippy from 'tippy.js'

import MentionList from "./MentionList";

const TiptapComment = ({ setComment, setEditor, users }) => {
  
  const userNames = users.map((item) => (item.display))
  const suggestion = {
    items: ({ query }) => {
      return userNames
        .filter(item => item.toLowerCase().startsWith(query.toLowerCase()))
        .slice(0, 5)
    },
  
    render: () => {
      let component
      let popup
  
      return {
        onStart: props => {
          component = new ReactRenderer(MentionList, {
            props,
            editor: props.editor,
          })
  
          if (!props.clientRect) {
            return
          }
  
          popup = tippy('body', {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom-start',
          })
        },
  
        onUpdate(props) {
          component.updateProps(props)
  
          if (!props.clientRect) {
            return
          }
  
          popup[0].setProps({
            getReferenceClientRect: props.clientRect,
          })
        },
  
        onKeyDown(props) {
          if (props.event.key === 'Escape') {
            popup[0].hide()
  
            return true
          }
  
          return component.ref?.onKeyDown(props)
        },
  
        onExit() {
          popup[0].destroy()
          component.destroy()
        },
      }
    },
  }
  const extensions = [
    StarterKit,
    Underline,
    Mention.configure({
      HTMLAttributes: {
        class: "mention",
      },
      suggestion:suggestion
    }),
    Placeholder.configure({ placeholder: "Enter comment..." }),
  ];

  const editor = useEditor({
    editorProps:{
      attributes:{
        class:'comment-tiptap flex-1'
      }
    },
    extensions,
    onUpdate: (e) => {
      const json = e.editor.getJSON();
      setComment(json);
    },
    onCreate: (e) => {
      setEditor(e.editor);
    },
  });

  return (
    <div className="flex flex-1">
      <EditorContent className="flex flex-1" editor={editor} />
    </div>
  );
};

export default TiptapComment;
