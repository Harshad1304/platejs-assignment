import { useEditorRef } from "platejs/react";
import { useEffect } from "react";

export const H1Element = ({ attributes, children, element }) => {
  const editor = useEditorRef();

  const isEmpty =
    !element.children ||
    !element.children[0] ||
    element.children[0].text.trim() === "";

  useEffect(() => {
    if (isEmpty) {
      const path = editor.findPath(element);
        document.querySelector('[data-slate-editor]').focus()
        editor.tf.select({
          anchor: { path: [...path, 0], offset: 0 },
          focus: { path: [...path, 0], offset: 0 },
        });
    }
  }, [isEmpty, editor, element]);

  return (
    <h1 {...attributes} className="relative text-3xl text-gray-900">
      {isEmpty && (
        <span
          contentEditable={false}
          className="absolute left-0 top-0 text-gray-400 pointer-events-none"
        >
          Enter Your Heading here
        </span>
      )}
      {children}
    </h1>
  );
};

export const H2Element = ({ attributes, children, element }) => {
  const editor = useEditorRef();

  const isEmpty =
    !element.children ||
    !element.children[0] ||
    element.children[0].text.trim() === "";

  useEffect(() => {
    if (isEmpty) {
      // Move cursor to this H2 element if it's empty
      const path = editor.findPath(element);
      console.log(path)
    
        document.querySelector('[data-slate-editor]').focus()
        editor.tf.select({
          anchor: { path: [...path, 0], offset: 0 },
          focus: { path: [...path, 0], offset: 0 },
        });
    }
  }, [isEmpty, editor, element]);

  return (
    <h2
      {...attributes}
      data-id={element.id}
      className="relative text-2xl text-gray-800"
    >
      {isEmpty && (
        <span
          contentEditable={false}
          className="absolute left-0 top-0 text-gray-400 pointer-events-none"
        >
          Enter Your Heading here
        </span>
      )}
      {children}
    </h2>
  );
};

export const H3Element = ({ attributes, children, element }) => {
  const editor = useEditorRef();

  const isEmpty =
    !element.children ||
    !element.children[0] ||
    element.children[0].text.trim() === "";

  useEffect(() => {
    if (isEmpty) {
      // Move cursor to this H3 element if it's empty
      const path = editor.findPath(element);
      console.log(path)
    
        document.querySelector('[data-slate-editor]').focus()
        editor.tf.select({
          anchor: { path: [...path, 0], offset: 0 },
          focus: { path: [...path, 0], offset: 0 },
        });
    }
  }, [isEmpty, editor, element]);

  return (
    <h3 {...attributes} className="relative text-xl text-gray-700">
      {isEmpty && (
        <span
          contentEditable={false}
          className="absolute left-0 top-0 text-gray-400 pointer-events-none"
        >
          Enter Your Heading here
        </span>
      )}
      {children}
    </h3>
  );
};

export const H4Element = ({ attributes, children, element }) => {
  const editor = useEditorRef();

  const isEmpty =
    !element.children ||
    !element.children[0] ||
    element.children[0].text.trim() === "";

  useEffect(() => {
    if (isEmpty) {
      // Move cursor to this H4 element if it's empty
      const path = editor.findPath(element);
      console.log(path)
    
        document.querySelector('[data-slate-editor]').focus()
        editor.tf.select({
          anchor: { path: [...path, 0], offset: 0 },
          focus: { path: [...path, 0], offset: 0 },
        });
    }
  }, [isEmpty, editor, element]);

  return (
    <h4 {...attributes} className="relative text-lg text-gray-700">
      {isEmpty && (
        <span
          contentEditable={false}
          className="absolute left-0 top-0 text-gray-400 pointer-events-none"
        >
          Enter Your Heading here
        </span>
      )}
      {children}
    </h4>
  );
};

export const H5Element = ({ attributes, children, element }) => {
  const editor = useEditorRef();

  const isEmpty =
    !element.children ||
    !element.children[0] ||
    element.children[0].text.trim() === "";

  useEffect(() => {
    if (isEmpty) {
      // Move cursor to this H5 element if it's empty
      const path = editor.findPath(element);
      console.log(path)
    
        document.querySelector('[data-slate-editor]').focus()
        editor.tf.select({
          anchor: { path: [...path, 0], offset: 0 },
          focus: { path: [...path, 0], offset: 0 },
        });
    }
  }, [isEmpty, editor, element]);

  return (
    <h5 {...attributes} className="relative text-base text-gray-600">
      {isEmpty && (
        <span
          contentEditable={false}
          className="absolute left-0 top-0 text-gray-400 pointer-events-none"
        >
          Enter Your Heading here
        </span>
      )}
      {children}
    </h5>
  );
};

export const H6Element = ({ attributes, children, element }) => {
  const editor = useEditorRef();

  const isEmpty =
    !element.children ||
    !element.children[0] ||
    element.children[0].text.trim() === "";

  useEffect(() => {
    if (isEmpty) {
      // Move cursor to this H6 element if it's empty
      const path = editor.findPath(element);
      console.log(path)
    
        document.querySelector('[data-slate-editor]').focus()
        editor.tf.select({
          anchor: { path: [...path, 0], offset: 0 },
          focus: { path: [...path, 0], offset: 0 },
        });
    }
  }, [isEmpty, editor, element]);

  return (
    <h6 {...attributes} className="relative text-sm text-gray-600">
      {isEmpty && (
        <span
          contentEditable={false}
          className="absolute left-0 top-0 text-gray-400 pointer-events-none"
        >
          Enter Your Heading here
        </span>
      )}
      {children}
    </h6>
  );
};
