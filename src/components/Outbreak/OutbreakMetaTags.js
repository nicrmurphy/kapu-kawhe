import React from 'react'
import MetaTags from 'react-meta-tags'

function OutbreakMetaTags() {
  return (
    <MetaTags>
    {/* Primary Meta Tags */}
    <title>WI Covid-19 Outbreak</title>
    <meta name="title" content="WI Covid-19 Outbreak" />
    <meta
      name="description"
      content="Visualized Covid-19 outbreak in Wisconsin"
    />

    {/* Open Graph / Facebook */}
    <meta property="og:type" content="website" />
    <meta property="og:url" content={process.env.PUBLIC_URL} />
    <meta property="og:title" content="WI Covid-19 Outbreak" />
    <meta
      property="og:description"
      content="Visualized Covid-19 outbreak in Wisconsin"
    />
    <meta
      property="og:image"
      content={`${process.env.PUBLIC_URL}/outbreak.png`}
    />

    {/* Twitter */}
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content={process.env.PUBLIC_URL} />
    <meta property="twitter:title" content="WI Covid-19 Outbreak" />
    <meta
      property="twitter:description"
      content="Visualized Covid-19 outbreak in Wisconsin"
    />
    <meta
      property="twitter:image"
      content={`${process.env.PUBLIC_URL}/outbreak.png`}
    />
  </MetaTags>
  )
}

export default OutbreakMetaTags
