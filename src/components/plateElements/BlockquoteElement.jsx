import React from 'react'

const BlockquoteElement = ({attributes, children}) => {
  return (
    <div {...attributes}>
        <div className="border-l-4 border-gray-300 pl-4">{children}</div>
    </div>
  )
}

export default BlockquoteElement