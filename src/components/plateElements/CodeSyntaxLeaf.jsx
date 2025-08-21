import React from 'react'

    const CodeSyntaxLeaf = ({ attributes, children, leaf }) => {
  return ( 
    <span
      {...attributes}
      style={{
        color: leaf.color || "inherit", // `lowlight` can set color
        fontWeight: leaf.bold ? "bold" : "normal",
        fontStyle: leaf.italic ? "italic" : "normal",
      }}
    >
      {children}
    </span> 
  )
}

export default CodeSyntaxLeaf