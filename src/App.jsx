import React, { useState, useRef } from "react";
import { Plate, PlateContent, useElement, usePlateEditor } from "platejs/react";
import FloatingPlusButton from "./components/FloatingPlusButton";
import AddQuestionDialog from "./components/AddQuestionDialog";
import AddCodeDialog from "./components/AddCodeDialog";
import { elementToComponent } from "./hooks/ElementsToComponent";
import FloatingToolbar from "./components/FloatingToolBar";
import { plugins } from "./utils/plugins";

function App() {
 

  const [openQuestionsDialog, setOpenQuestionsDialog] = useState(false);
  const [openCodeDialog, setOpenCodeDialog] = useState(false);
  const [isFloatingToolbarVisible, setIsFloatingToolbarVisible] = useState(false);
  const fileInputRef = useRef(null);

  const editor = usePlateEditor({
    plugins: [
     ...plugins
    ],
    value: [
      {
        type: "p",
        children: [
          {
            text: "Hello World",
          },
        ],
      },
    ],
  });

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        editor.insertNode({
          type: "img",
          url: imageUrl,
          alt: file.name || "Uploaded Image",
          children: [{ text: "" }],
        });
        editor.insertNode({
          type: "p",
          children: [
            {
              text: "",
            },
          ],
        });
      };
      reader.readAsDataURL(file);
    }
    event.target.value = "";
  };

  const handleAddContent = (optionType) => {
    if (optionType === "question") {
      setOpenQuestionsDialog(true);
    } else if (optionType === "image") {
      fileInputRef.current?.click();
    } else if (optionType === "code") {
      setOpenCodeDialog(true);
    } else if (optionType === "quote") {
      console.log("quote");
    } else if (optionType === "divider") {
      console.log("divider");
    }
  };

  const handleSubmitMCQ = (mcqData) => {
    const paragraphElement = {
      type: "p",
      children: [
        {
          text: "",
        },
      ],
    };
    const mcqElement = {
      type: "mcq",
      children: [
        {
          text: "",
        },
      ],
      data: {
        id: mcqData.id,
        question: mcqData.question,
        options: mcqData.options,
        correctOptionId: mcqData.correctOptionId,
        explanation: mcqData.explanation,
      },
    };
    editor.insertNode(mcqElement);
    editor.insertNode(paragraphElement);
  };

  const handleSubmitCode = (codeData) => {
    const codeBlockElement = {
      type: "code_block",
      lang: codeData.language,
      children: [
        {
          type: "code_line",
          children: [{ text: codeData.code }],
        },
      ],
    };

    const paragraphElement = {
      type: "p",
      children: [
        {
          text: "",
        },
      ],
    };
    editor.insertNode(codeBlockElement);
    editor.children.push(paragraphElement);
  };

  

  return (
    <Plate editor={editor}>
      <PlateContent
        className="pt-20 px-32 min-h-screen bg-blue-100"
        placeholder="Type your amazing content here..."
        renderElement={(props) => elementToComponent(props.element, props)}
      />
      <FloatingPlusButton 
        onAddContent={handleAddContent} 
        isFloatingToolbarVisible={isFloatingToolbarVisible}
      />
      <FloatingToolbar 
        onVisibilityChange={setIsFloatingToolbarVisible}
      />
      {openQuestionsDialog && (
        <AddQuestionDialog
          open={openQuestionsDialog}
          onClose={() => setOpenQuestionsDialog(false)}
          onSubmit={handleSubmitMCQ}
        />
      )}
      {openCodeDialog && (
        <AddCodeDialog
          open={openCodeDialog}
          onClose={() => setOpenCodeDialog(false)}
          onSubmit={handleSubmitCode}
        />
      )}

      {/* This is our hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: "none" }}
      />
      {/* <MCQCard /> */}
    </Plate>
  );
}
export default App;
