import React, { useState, useRef, useEffect } from "react";
import { useEditorRef } from "platejs/react";
import { HelpCircle, Image, Code, Plus, ChevronRight } from "lucide-react";

// Helper function to get selection bounding client rect (from Plate floating API)
const getSelectionBoundingClientRect = () => {
  const selection = window.getSelection();

  if (!selection || selection.rangeCount === 0 || !selection.isCollapsed) {
    return null;
  }

  try {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    // For collapsed selections, try to get a better position
    if (rect.width === 0 && rect.height === 0) {
      const tempRange = document.createRange();
      tempRange.selectNode(range.startContainer);
      const containerRect = tempRange.getBoundingClientRect();
      tempRange.detach();
      return containerRect;
    }

    return rect;
  } catch (error) {
    return null;
  }
};

const FloatingCaretButton = ({ onAddContent }) => {
  const editor = useEditorRef();
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
    const editorElements = editor.children.filter(el => el.type === "code-block");
    console.log(editorElements);
    
  useEffect(() => {
    const updateVisibility = () => {
      try {
        const selection = window.getSelection();
        if (selection.anchorOffset > 1) {
          setIsVisible(false);
          setShowDropdown(false);
          return;
        }
        if (
          !selection ||
          selection.rangeCount === 0 ||
          !selection.isCollapsed
        ) {
          setIsVisible(false);
          setShowDropdown(false);
          return;
        }

        // Check if selection is within the editor
        const editorElement =
          document.querySelector("[data-slate-editor]") ||
          document.querySelector('[contenteditable="true"]');

        if (!editorElement) {
          setIsVisible(false);
          return;
        }

        const range = selection.getRangeAt(0);
        const isWithinEditor = editorElement.contains(
          range.commonAncestorContainer.nodeType === Node.TEXT_NODE
            ? range.commonAncestorContainer.parentNode
            : range.commonAncestorContainer
        );

        if (!isWithinEditor) {
          setIsVisible(false);
          return;
        }

        // Check if we're in a special element (like code blocks, MCQs, etc.)
        let currentNode = range.commonAncestorContainer;
        let isInSpecialElement = false;

        while (currentNode && currentNode !== editorElement) {
          if (currentNode.nodeType === Node.ELEMENT_NODE) {
            if (
              currentNode.getAttribute &&
              (currentNode.getAttribute("contenteditable") === "false" ||
                currentNode.hasAttribute("data-slate-void") ||
                currentNode.classList.contains("mcq-card") ||
                currentNode.classList.contains("code-block"))
            ) {
              isInSpecialElement = true;
              break;
            }
          }
          currentNode = currentNode.parentNode;
        }

        if (isInSpecialElement) {
          setIsVisible(false);
          return;
        }

        // Get caret position and update component position
        const rect = getSelectionBoundingClientRect();
        if (rect) {
          setPosition({
            x: rect.left + rect.width + 10 + window.scrollX, // 10px offset to the right
            y: rect.top + window.scrollY,
          });
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      } catch (error) {
        setIsVisible(false);
      }
    };

    const handleSelectionChange = () => {
      setTimeout(updateVisibility, 0);
    };

    document.addEventListener("selectionchange", handleSelectionChange);

    // Also listen for editor changes
    const unsubscribe = editor.onChange?.(() => {
      handleSelectionChange();
    });

    updateVisibility();

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
      unsubscribe?.();
    };
  }, [editor]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleButtonClick = () => {
    setShowDropdown((prev) => !prev);
  };

  const handleOptionClick = (optionType) => {
    console.log(`${optionType} option clicked`);
    setShowDropdown(false);

    // Call the parent's onAddContent function if provided
    if (onAddContent) {
      onAddContent(optionType);
    }
  };

  const dropdownOptions = [
    { id: "question", label: "Question", icon: <HelpCircle size={16} /> },
    { id: "image", label: "Add Image", icon: <Image size={16} /> },
    { id: "code", label: "Add Code", icon: <Code size={16} /> },
  ];

  if (!isVisible) {
    return null;
  }

  
  
  return (
    <div
      className="fixed pointer-events-auto"
      style={{
        left: `${position.x - 35}px`,
        top: `${position.y + 10}px`,
        zIndex: 50,
        transform: "translate(-50%, -50%)",
      }}
    >
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ease-out hover:scale-110 hover:shadow-xl ring-2 ring-white/50"
        title="Add content"
        aria-label="Add content"
      >
        <Plus size={16} />
      </button>

      <div
        ref={dropdownRef}
        className={`absolute left-full top-0 ml-2 bg-white rounded-lg shadow-xl border border-gray-200 py-1.5 min-w-[160px] z-50
          transition-all duration-200 ease-out origin-left
          ${
            showDropdown
              ? "opacity-100 scale-100 translate-x-0 visible"
              : "opacity-0 scale-95 -translate-x-2 invisible"
          }`}
      >
        <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100 mb-1">
          Insert
        </div>
        <div className="space-y-0.5">
          {dropdownOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center text-sm text-gray-700 hover:text-gray-900 transition-colors duration-150 ease-out rounded-md group"
            >
              <span className="text-gray-500 group-hover:text-indigo-600 transition-colors mr-2.5 flex items-center">
                {option.icon}
              </span>
              <span className="font-medium">{option.label}</span>
              <ChevronRight
                size={14}
                className="ml-auto text-gray-300 group-hover:text-gray-400 transition-colors"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FloatingCaretButton;
