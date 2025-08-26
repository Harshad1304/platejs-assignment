import React, { useState, useRef } from "react";
import { Plate, PlateContent, useElement, usePlateEditor } from "platejs/react";
import FloatingPlusButton from "./components/FloatingPlusButton";
import FloatingCaretButton from "./components/FloatingCaretButton";
import AddQuestionDialog from "./components/AddQuestionDialog";
import AddCodeDialog from "./components/AddCodeDialog";
import { elementToComponent } from "./hooks/ElementsToComponent";
import FloatingToolbar from "./components/FloatingToolBar";
import { plugins } from "./utils/plugins";
import Header from "./components/Header";
import DarkAnimatedBackground from "./components/animation/DarkAnimatedBackground";
import Loader from "./components/Loader";
import Footer from "./components/Footer";

function App() {

  // Dialog states
  const [openQuestionsDialog, setOpenQuestionsDialog] = useState(false);
  const [openCodeDialog, setOpenCodeDialog] = useState(false);

  // Floating toolbar related states
  const [isFloatingToolbarVisible, setIsFloatingToolbarVisible] =
    useState(false);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // File input ref for image upload
  const fileInputRef = useRef(null);


  const editor = usePlateEditor({
    plugins: [...plugins],
    value: [
      {
        type: "p",
        children: [
          {
            text: "Hello, Welcome to Classavo",
          },
        ],
      },
    ],
  });

  console.log(" Editor ", editor.children);

  const handleImageUpload =  (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        const endPoint = editor.api.end([]);
        editor.tf.select(endPoint);
        editor.tf.insertNode({
          type: "img",
          url: imageUrl,
          alt: file.name || "Uploaded Image",
          children: [{ text: "" }],
        });
        editor.tf.insertNode({
          type: "p",
          children: [
            {
              text: "",
            },
          ],
        });
        setIsLoading(false);
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
      // Add quote functionality
      const endPoint = editor.api.end([]);
      editor.tf.select(endPoint);
      editor.tf.insertNode({
        type: "blockquote",
        children: [
          {
            text: "Enter your quote here...",
          },
        ],
      });
      editor.tf.insertNode({
        type: "p",
        children: [{ text: "" }],
      });
    } else if (optionType === "divider") {
      // Add divider functionality
      const endPoint = editor.api.end([]);
      editor.tf.select(endPoint);
      editor.tf.insertNode({
        type: "hr",
        children: [{ text: "" }],
      });
      editor.tf.insertNode({
        type: "p",
        children: [{ text: "" }],
      });
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
    const endPoint = editor.api.end([]);
    editor.tf.select(endPoint);
    editor.tf.insertNode(mcqElement);
    editor.tf.insertNode(paragraphElement);
    setOpenQuestionsDialog(false);
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
      children: [{ text: "" }],
    };

    // Insert the code block first and get its path
    const codePath = editor.api.end([]).path;
    editor.tf.insertNodes(codeBlockElement, { at: codePath });

    // Calculate where to insert the paragraph (after the code block)
    const newPath = [...codePath];
    newPath[newPath.length - 1] += 1;

    // Insert paragraph at root after code block
    editor.tf.insertNodes(paragraphElement, { at: newPath, select: true });

    setOpenCodeDialog(false);
  };

  return (
    <Plate editor={editor}>
      <div className="min-h-screen relative overflow-hidden">
        {/* Background Animation  */}
        <DarkAnimatedBackground />
        {/* Header */}
        <Header />

        {/* Main editor container */}
        <div className="relative z-10 px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="relative min-h-[calc(100vh-10rem)] border border-slate-700/50 shadow-2xl rounded-2xl bg-slate-800/80 backdrop-blur-sm p-6 md:p-8 lg:p-12 transition-all duration-300 hover:shadow-blue-500/10 hover:shadow-2xl focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/20">
              {isLoading && <Loader />}

              <PlateContent
                className="border-none outline-none"
                placeholder="✨ Hey Gen Z! Welcome to Classavo - Start creating amazing content..."
                renderElement={(props) =>
                  elementToComponent(props.element, props)
                }
                style={{
                  fontSize: "16px",
                  lineHeight: "1.6",
                  color: "#e2e8f0",
                }}
              />

              {/* Word count and status bar */}
              <div className="absolute bottom-4 left-6 text-xs text-gray-500 bg-slate-800/80 backdrop-blur-sm px-3 py-1 rounded-full">
                <span>Ready to create</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Buttons */}
        <FloatingCaretButton onAddContent={handleAddContent} />
        <FloatingToolbar onVisibilityChange={setIsFloatingToolbarVisible} />

        {openQuestionsDialog && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <AddQuestionDialog
              open={openQuestionsDialog}
              onClose={() => setOpenQuestionsDialog(false)}
              onSubmit={handleSubmitMCQ}
            />
          </div>
        )}

        {openCodeDialog && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <AddCodeDialog
              open={openCodeDialog}
              onClose={() => setOpenCodeDialog(false)}
              onSubmit={handleSubmitCode}
            />
          </div>
        )}

        {/* Hidden file input for image upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: "none" }}
        />

        {/* Footer */}
        <Footer />
      </div>
    </Plate>
  );
}

export default App;
