import { useEditorRef, usePlateEditor } from "platejs/react";
import React, { useState } from "react";

const SlashInputElement = ({ attributes, children, element }) => {
  const editor = usePlateEditor();
  const [isOpen, setIsOpen] = useState(true);
  const headingNode = {
    type: "h1",
    children: [{ text: "" }],
  };
  const handleClick = () => {
    editor.tf.insertNodes(headingNode);
 
    editor.transforms.removeNodes({
      match: (node) => node.type === "slash_input",
    });
    setIsOpen(false);
  };

  if (!isOpen) return null;
  // slash_input
  return (
    <div
      {...attributes}
      className="inline-flex bg-red-500 h-20 w-40 p-2 text-sm   "
    >
      insert
      <button className="text-white p-4" onClick={handleClick}>
        Hello
      </button>
    </div>
  );
};

export default SlashInputElement;
