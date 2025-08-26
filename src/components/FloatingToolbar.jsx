import React, { useState, useEffect, useRef } from "react";
import { useEditorRef, useEditorState } from "platejs/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  ChevronDown,
  Type,
  Quote,
  List,
  ListOrdered,
  ListTodo,
} from "lucide-react";

function FloatingToolbar({ onVisibilityChange }) {
  const editor = useEditorRef();
  const editorState = useEditorState();
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState("above");
  const toolbarRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const updateToolbarPosition = () => {
      try {
        const selection = window.getSelection();

        // Check if there's a selection and it's not empty
        if (
          !selection ||
          selection.rangeCount === 0 ||
          selection.isCollapsed ||
          selection.toString().trim() === ""
        ) {
          setIsVisible(false);
          return;
        }

        // Check if the selection is within the editor
        const editorElement =
          document.querySelector("[data-slate-editor]") ||
          document.querySelector('[contenteditable="true"]');
        if (!editorElement) {
          setIsVisible(false);
          return;
        }

        // Check if selection is within the editor bounds
        const range = selection.getRangeAt(0);
        const selectionContainer = range.commonAncestorContainer;
        const isWithinEditor = editorElement.contains(
          selectionContainer.nodeType === Node.TEXT_NODE
            ? selectionContainer.parentNode
            : selectionContainer
        );

        if (!isWithinEditor) {
          setIsVisible(false);
          return;
        }

        // Get selection bounds
        const selectionRect = range.getBoundingClientRect();
        const editorRect = editorElement.getBoundingClientRect();

        // Calculate toolbar position (above the selection)
        const toolbarHeight = 44; // Approximate toolbar height
        const spacing = 8; // Space between selection and toolbar

        const left = selectionRect.left + selectionRect.width / 2;
        const top = selectionRect.top - toolbarHeight - spacing;

        setPosition({ top, left });
        setIsVisible(true);
        setShouldRender(true);
      } catch (error) {
        console.error("Error updating toolbar position:", error);
        setIsVisible(false);
      }
    };

    // Update position on selection change
    const handleSelectionChange = () => {
      // Small delay to ensure selection is fully updated
      setTimeout(updateToolbarPosition, 10);
    };

    // Listen for selection changes
    document.addEventListener("selectionchange", handleSelectionChange);

    // Also listen for editor state changes
    updateToolbarPosition();

    // Cleanup
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [editor, editorState]);

  // Calculate dropdown position when it opens
  useEffect(() => {
    if (showHeadingDropdown && toolbarRef.current) {
      const toolbarRect = toolbarRef.current.getBoundingClientRect();
      const dropdownHeight = 200; // Approximate dropdown height
      const spaceAbove = toolbarRect.top;
      const spaceBelow = window.innerHeight - toolbarRect.bottom;

      // Position dropdown above if there's not enough space below, otherwise below
      if (spaceBelow < dropdownHeight && spaceAbove >= dropdownHeight) {
        setDropdownPosition("above");
      } else {
        setDropdownPosition("below");
      }
    }
  }, [showHeadingDropdown]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        toolbarRef.current &&
        !toolbarRef.current.contains(event.target)
      ) {
        setShowHeadingDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Notify parent component when visibility changes
  useEffect(() => {
    if (onVisibilityChange) {
      onVisibilityChange(isVisible);
    }
  }, [isVisible, onVisibilityChange]);

  // Handle fade out effect before unmounting
  useEffect(() => {
    if (!isVisible && shouldRender) {
      const timer = setTimeout(() => {
        setShouldRender(false);
        setShowHeadingDropdown(false); // Close dropdown when toolbar hides
      }, 150); // Match this with the transition duration
      return () => clearTimeout(timer);
    }
  }, [isVisible, shouldRender]);

  // Center the toolbar horizontally
  useEffect(() => {
    if (isVisible && toolbarRef.current) {
      const toolbarWidth = toolbarRef.current.offsetWidth;
      setPosition((prev) => ({
        ...prev,
        left: prev.left - toolbarWidth / 2,
      }));
    }
  }, [isVisible]);

  const handleButtonClick = (action) => {
    if (action === "Bold") {
      editor.tf.toggleMark("bold");
    }
    if (action === "Italic") {
      editor.tf.toggleMark("italic");
    }
    if (action === "Underline") {
      editor.tf.toggleMark("underline");
    }
    if (action === "Strikethrough") {
      editor.tf.toggleMark("strikethrough");
    }
      if (action === "Blockquote") {
        editor.tf.blockquote.toggle();
      }
      if (action === "BulletedList") {
        editor.tf.ul.toggle();
      }
      if (action === "NumberedList") {
        editor.tf.ol.toggle();
      }
      // if (action === "TaskList") {
      //   editor.tf.taskList.toggle();
      // }
  };

  const handleHeadingSelect = (headingLevel) => {
    editor.tf[headingLevel].toggle();
    
    setShowHeadingDropdown(false);
  };

  const headingOptions = [
    { level: "h1", label: "Heading 1", icon: <Heading1 size={16} /> },
    { level: "h2", label: "Heading 2", icon: <Heading2 size={16} /> },
    { level: "h3", label: "Heading 3", icon: <Heading3 size={16} /> },
    { level: "h4", label: "Heading 4", icon: <Heading4 size={16} /> },
    { level: "h5", label: "Heading 5", icon: <Heading5 size={16} /> },
    { level: "h6", label: "Heading 6", icon: <Heading5 size={16} /> },
  ];

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      ref={toolbarRef}
      className="fixed z-50 bg-gray-800 rounded-lg shadow-lg p-2 flex gap-1 transition-all duration-150"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(10px)",
      }}
    >
      <button
        onClick={() => handleButtonClick("Bold")}
        className="p-2 text-white hover:bg-gray-700 rounded transition-colors duration-150"
        title="Bold"
      >
        <Bold size={16} />
      </button>

      <button
        onClick={() => handleButtonClick("Blockquote")}
        className="p-2 text-white hover:bg-gray-700 rounded transition-colors duration-150"
        title="Quote"
      >
        <Quote size={16} />
      </button>
      <button
        onClick={() => handleButtonClick("Italic")}
        className="p-2 text-white hover:bg-gray-700 rounded transition-colors duration-150"
        title="Italic"
      >
        <Italic size={16} />
      </button>

      <button
        onClick={() => handleButtonClick("Underline")}
        className="p-2 text-white hover:bg-gray-700 rounded transition-colors duration-150"
        title="Underline"
      >
        <Underline size={16} />
      </button>

      <button
        onClick={() => handleButtonClick("Strikethrough")}
        className="p-2 text-white hover:bg-gray-700 rounded transition-colors duration-150"
        title="Strikethrough"
      >
        <Strikethrough size={16} />
      </button>
      <button
        onClick={() => handleButtonClick("BulletedList")}
        className="p-2 text-white hover:bg-gray-700 rounded transition-colors duration-150"
        title="Bulleted List"
      >
        <List size={16} />
      </button>
      <button
        onClick={() => handleButtonClick("NumberedList")}
        className="p-2 text-white hover:bg-gray-700 rounded transition-colors duration-150"
        title="Numbered List"
      >
        <ListOrdered size={16} />
      </button>
      {/* <button
        onClick={() => handleButtonClick("TaskList")}
        className="p-2 text-white hover:bg-gray-700 rounded transition-colors duration-150"
        title="Task List"
      >
        <ListTodo size={16} />
      </button> */}

      <div className="w-px bg-gray-600 mx-1" />

      {/* Heading Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setShowHeadingDropdown(!showHeadingDropdown)}
          className="p-2 text-white hover:bg-gray-700 rounded transition-colors duration-150 flex items-center gap-1"
          title="Headings"
        >
          <Type size={16} />
          <ChevronDown
            size={14}
            className="transition-transform duration-200"
            style={{
              transform: showHeadingDropdown ? "rotate(180deg)" : "rotate(0)",
            }}
          />
        </button>

        {showHeadingDropdown && (
          <div
            className={`absolute ${
              dropdownPosition === "above"
                ? "bottom-full mb-2"
                : "top-full mt-2"
            } left-0 bg-white rounded-md shadow-lg border border-gray-200 py-1.5 min-w-[160px] z-50`}
          >
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100 mb-1">
              Headings
            </div>
            <div className="space-y-0.5">
              {headingOptions.map((option) => (
                <button
                  key={option.level}
                  onClick={() => handleHeadingSelect(option.level)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center text-sm text-gray-700 hover:text-gray-900 transition-colors duration-150 rounded-md"
                >
                  <span className="text-gray-500 mr-2.5 flex items-center">
                    {option.icon}
                  </span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FloatingToolbar;
