

const ImageElement = ({ attributes, children, element }) => {
  return (
    <div 
    {...attributes} 
    contentEditable={false} 
    className=" relative inline-block max-w-full my-4 mx-auto border border-gray-200 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200 bg-white"
  >
    <img 
      src={element.url} 
      alt={element.alt} 
      className="rounded-md max-w-full h-auto block mx-auto"
    />
    {children}
  </div>
  );
};


export default ImageElement;  