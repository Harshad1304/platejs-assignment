import React, { useState, useRef } from "react";
import { useEditorRef } from "platejs/react";
import { Heading1, Heading2, Heading3, Heading4, Image } from "lucide-react";

const SlashInputElement = ({ attributes, children }) => {
  const editor = useEditorRef();
  const [isOpen, setIsOpen] = useState(true);
  const fileInputRef = useRef(null);

  const handleHeadingInsert = (level) => {
    const headingNode = {
      type: `h${level}`,
      children: [{ text: " " }],
    };
  
    // Ensure selection is at the END of the last node, not start
    const lastIndex = editor.children.length - 1;
    const lastTextNode = editor.children[lastIndex].children[0];
    const endOffset = lastTextNode.text.length; // place cursor at end of text
  
    editor.tf.select({
      anchor: { path: [lastIndex, 0], offset: endOffset },
      focus: { path: [lastIndex, 0], offset: endOffset },
    });
  
    // Insert heading at current selection (now at end → insert after)
    editor.tf.insertNodes(headingNode);
  
    // Remove the slash_input node if it's still there
    editor.transforms.removeNodes({
      match: (node) => node.type === "slash_input",
    });
  
    setIsOpen(false);
  };
  
  const handleImageInsert = () => {
    // Trigger the hidden file input
    fileInputRef.current?.click();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        
        // Ensure selection is not inside slash_input
        editor.tf.select({
          anchor: { path: [editor.children.length -1 , 0], offset: 0 },
          focus: { path: [editor.children.length -1, 0], offset: 0 },
         });
        
        // Insert image at current selection
        editor.tf.insertNodes({
          type: "img",
          url: imageUrl,
          alt: file.name || "Uploaded Image",
          children: [{ text: "" }],
        });
        
        // Remove the slash_input node if it's still there
        editor.transforms.removeNodes({
          match: (node) => node.type === "slash_input",
        });
        
        setIsOpen(false);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = "";
  };
  

  if (!isOpen) return null;

  return (
    <div
      {...attributes}
      className="inline-block absolute bg-white rounded-lg shadow-lg border border-gray-200 p-2 w-64"
    >
      <div className="text-xs text-gray-500 font-medium px-2 py-1">
        Basic Blocks
      </div>

      <div className="flex flex-col gap-1">
        <button
          className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 text-sm text-gray-700"
          onClick={() => handleHeadingInsert(1)}
        >
          <Heading1 size={18} className="text-blue-500" />
          <span>Heading 1</span>
        </button>

        <button
          className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 text-sm text-gray-700"
          onClick={() => handleHeadingInsert(2)}
        >
          <Heading2 size={18} className="text-blue-500" />
          <span>Heading 2</span>
        </button>

        <button
          className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 text-sm text-gray-700"
          onClick={() => handleHeadingInsert(3)}
        >
          <Heading3 size={18} className="text-blue-500" />
          <span>Heading 3</span>
        </button>

        <button
          className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 text-sm text-gray-700"
          onClick={() => handleHeadingInsert(4)}
        >
          <Heading4 size={18} className="text-blue-500" />
          <span>Heading 4</span>
        </button>

        <button
          className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 text-sm text-gray-700"
          onClick={handleImageInsert}
        >
          <Image size={18} className="text-green-500" />
          <span>Image</span>
        </button>
      </div>

      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />

      {children}
    </div>
  );
};

export default SlashInputElement;
