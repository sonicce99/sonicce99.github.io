import React from "react"

const Toc = ({ tableOfContents }) => {
  return (
    <aside
      className="tocContainer"
      dangerouslySetInnerHTML={{ __html: tableOfContents }}
    />
  )
}

export default Toc
