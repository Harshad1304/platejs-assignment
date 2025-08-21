

const CodeBlockElement = ({ attributes, children, element }) => {
    return (
        <pre
        {...attributes}
        className="bg-gray-700 text-white text-sm p-4 rounded-md mb-4"
      >
        
        <code>{children}</code>
      </pre>
    );
  };
  
  
  export default CodeBlockElement;  