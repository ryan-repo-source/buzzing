import React from 'react'

const RenderHtml = (escapedHTML) => React.createElement("div", { dangerouslySetInnerHTML: { __html: escapedHTML } });

export default RenderHtml
