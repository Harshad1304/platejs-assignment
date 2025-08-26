

const ImageElement = ({ attributes, children, element }) => {
  return (
    <div 
    {...attributes} 
    contentEditable={false} 
    className="w-[50%] mx-auto"
  >
    <img 
      src={element.url} 
      alt={element.alt} 
      className="rounded-md"
    />
    {children}
  </div>
  );
};


export default ImageElement;  