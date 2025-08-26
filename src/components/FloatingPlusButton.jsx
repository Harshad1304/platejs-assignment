import React, { useEffect, useState, useRef } from 'react';
import { useEditorRef } from 'platejs/react';
import { 
  Plus, 
  Image, 
  Code, 
  HelpCircle,
  ChevronRight,
} from 'lucide-react';

const FloatingPlusButton = ({ onAddContent, isFloatingToolbarVisible }) => {
  const editor = useEditorRef();
  const [position, setPosition] = useState({ x: 0, y: 0, visible: false });
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const updatePosition = () => {
      try {
        // Hide if floating toolbar is visible
        if (isFloatingToolbarVisible) {
          setPosition(prev => ({ ...prev, visible: false }));
          return;
        }

        const selection = window.getSelection();
        
        // Only show on cursor (collapsed selection), not when text is selected
        if (!selection || selection.rangeCount === 0 || !selection.isCollapsed) {
          setPosition(prev => ({ ...prev, visible: false }));
          return;
        }

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        
        const editorElement = document.querySelector('[data-slate-editor]') || document.querySelector('[contenteditable="true"]');
        if (!editorElement || !editorElement.contains(range.commonAncestorContainer)) {
          setPosition(prev => ({ ...prev, visible: false }));
          return;
        }
        
        let currentNode = range.commonAncestorContainer;
        let isInRenderedElement = false;
        let isInCodeBlock = false;
        
        // Check if we're inside any non-editable elements or code blocks
        while (currentNode && currentNode !== editorElement) {
          if (currentNode.nodeType === Node.ELEMENT_NODE) {
            // Check for non-editable elements
            if (currentNode.getAttribute && currentNode.getAttribute('contenteditable') === 'false') {
              isInRenderedElement = true;
              break;
            }
            
            // Check for various void elements and special components
            if (currentNode.hasAttribute && (
              currentNode.hasAttribute('data-slate-void') ||
              currentNode.classList.contains('mcq-card') ||
              currentNode.querySelector('[contenteditable="false"]')
            )) {
              isInRenderedElement = true;
              break;
            }
            
            // Check for code blocks
            if (currentNode.hasAttribute && (
              currentNode.hasAttribute('data-slate-node') &&
              (currentNode.classList.contains('code-block') ||
               currentNode.querySelector('[data-slate-node][class*="code"]') ||
               currentNode.closest('[data-slate-node][class*="code"]'))
            )) {
              isInCodeBlock = true;
              break;
            }
            
            // Also check by element type for code blocks
            const elementType = currentNode.getAttribute('data-slate-node');
            if (elementType && (elementType.includes('code') || currentNode.classList.contains('code-block'))) {
              isInCodeBlock = true;
              break;
            }
          }
          currentNode = currentNode.parentNode;
        }
        
        // Hide if in rendered element or code block
        if (isInRenderedElement || isInCodeBlock) {
          setPosition(prev => ({ ...prev, visible: false }));
          return;
        }
        
        // Check if cursor has a valid position
        if (rect.width === 0 && rect.height === 0) {
          // For collapsed selection, getBoundingClientRect might return empty rect
          // Try to get a better position
          const tempRange = document.createRange();
          tempRange.selectNode(range.startContainer);
          const containerRect = tempRange.getBoundingClientRect();
          tempRange.detach();
          
          if (containerRect.width > 0 || containerRect.height > 0) {
            setPosition({
              x: containerRect.left + window.scrollX,
              y: containerRect.top + window.scrollY,
              visible: true
            });
          } else {
            setPosition(prev => ({ ...prev, visible: false }));
          }
        } else {
          setPosition({
            x: rect.right + window.scrollX,
            y: rect.top + window.scrollY,
            visible: true
          });
        }
      } catch (error) {
        setPosition(prev => ({ ...prev, visible: false }));
      }
    };

    const handleSelectionChange = () => {
      setTimeout(updatePosition, 0);
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    
    const unsubscribe = editor.onChange?.(() => {
      handleSelectionChange();
    });

    updatePosition();

    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
      unsubscribe?.();
    };
  }, [editor, isFloatingToolbarVisible]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleButtonClick = () => {
    setShowDropdown(prev => !prev);
  };

  const handleOptionClick = (optionType) => {
    setShowDropdown(false);
    if (onAddContent) {
      onAddContent(optionType);
    }
  };

  const dropdownOptions = [
    { id: 'question', label: 'Question', icon: <HelpCircle size={16} /> },
    { id: 'image', label: 'Image', icon: <Image size={16} /> },
    { id: 'code', label: 'Code', icon: <Code size={16} /> },
  ];

  if (!position.visible) {
    return null;
  }

  return (
    <div
      className="fixed z-50 pointer-events-auto"
      style={{
        left: `${position.x + 20}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)'
      }}
    >
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        className="w-9 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ease-out hover:scale-110 hover:shadow-xl ring-2 ring-white/50"
        title="Add content"
        aria-label="Add content"
      >
        <Plus size={18} />
      </button>

      <div 
        ref={dropdownRef}
        className={`absolute left-full top-0 ml-2 bg-white rounded-lg shadow-xl border border-gray-200 py-1.5 min-w-[180px] z-50
          transition-all duration-200 ease-out origin-left
          ${showDropdown 
            ? 'opacity-100 scale-100 translate-x-0 visible' 
            : 'opacity-0 scale-95 -translate-x-2 invisible'
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
              className="w-full text-left px-3 py-2.5 hover:bg-gray-100 flex items-center text-sm text-gray-700 hover:text-gray-900 transition-colors duration-150 ease-out rounded-md  group"
            >
              <span className="text-gray-500 group-hover:text-blue-600 transition-colors mr-2.5 flex items-center">
                {option.icon}
              </span>
              <span className="font-medium">{option.label}</span>
              <ChevronRight size={14} className="ml-auto text-gray-300 group-hover:text-gray-400 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FloatingPlusButton;