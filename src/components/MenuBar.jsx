import {
  FaBold,
  FaHeading,
  FaItalic,
  FaStrikethrough,
  FaUnderline,
  FaListUl
} from "react-icons/fa";

const MenuBar = ({editor}) => {

  if (!editor) {
    return null;
  }

  return (
    <div className="menuBar xsm:max-w-screen-xsm grid-cols-7">
       
      
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is_active" : ""}
      >
        <FaBold />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is_active" : ""}
      >
        <FaItalic />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive("underline") ? "is_active" : ""}
      >
        <FaUnderline />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "is_active" : ""}
      >
        <FaStrikethrough />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive("heading", { level: 2 }) ? "is_active" : ""}
      >
        <FaHeading />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive("heading", { level: 3 }) ? "is_active" : ""}
      >
        <FaHeading className="heading3" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        <FaListUl/>
      </button>

      
    </div>
  );
};

export default MenuBar;
