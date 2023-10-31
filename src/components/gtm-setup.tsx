import React from "react"
import { oneLine } from "common-tags"

const gtm: string = "GTM-XXXXXXX"

// Google Tag Manager (head)
export const gtmScript = (
  <script
    key="gtm-js"
    dangerouslySetInnerHTML={{
      __html: oneLine`
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-M5W59LM2');</script>
    <!-- End Google Tag Manager -->
`,
    }}
  />
)

// Google Tag Manager - noscript (body)
export const gtmNoscript = (
  <noscript
    key="gtm-noscript"
    dangerouslySetInnerHTML={{
      __html: oneLine`
    <!-- Google Tag Manager (noscript) -->
    <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M5W59LM2"
    height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <!-- End Google Tag Manager (noscript) -->
`,
    }}
  />
)
