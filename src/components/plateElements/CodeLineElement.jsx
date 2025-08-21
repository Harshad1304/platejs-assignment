import React from 'react'

const CodeLineElement = ({ attributes, children, element }  ) => {
  return (
    <div {...attributes} style={{ display: "block" }}>
    {children}
  </div>
  )
}

export default CodeLineElement  