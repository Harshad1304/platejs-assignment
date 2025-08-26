import React, { useState } from "react";
import { useEditorRef } from "platejs/react";
import { Heading1, Heading2, Heading3, Heading4 } from "lucide-react";

const SlashInputElement = ({ attributes, children }) => {
  const editor = useEditorRef();
  const [isOpen, setIsOpen] = useState(true);

  const handleHeadingInsert = (level) => {
    const headingNode = {
      type: `h${level}`,
      children: [{ text: " " }],
    };

    editor.tf.insertNodes(headingNode,{nextBlock:true});

    editor.transforms.removeNodes({
      match: (node) => node.type === "slash_input",
    });
  
    setIsOpen(false);
  };
  



  if (!isOpen) return null;

  return (
    <div
      {...attributes}
      className="inline-block absolute z-50 bg-white rounded-lg shadow-lg border border-gray-200 p-2 w-64"
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

      </div>
      {children}
    </div>
  );
};

export default SlashInputElement;
