export const H1Element = ({attributes, children}) => {
    return (
        <h1  {...attributes} className="text-3xl  text-gray-900">{children}</h1>
    )
}

export const H2Element = ({attributes, children}) => {
    return (
        <h2 {...attributes} className="text-2xl  text-gray-800 " >{children}</h2>
    )
}

export const H3Element = ({attributes, children}) => {
    return (
        <h3 {...attributes} className="text-xl  text-gray-700 ">{children}</h3>
    )
}

export const H4Element = ({attributes, children}) => {
    return (
        <h4 {...attributes} className="text-lg  text-gray-700 ">{children}</h4>
    )
}

export const H5Element = ({attributes, children}) => {
    return (
        <h5 {...attributes} className="text-base  text-gray-600 ">{children}</h5>
    )
}

export const H6Element = ({attributes, children}) => {
    return (
        <h6 {...attributes} className="text-sm  text-gray-600 ">{children}</h6>
    )
}