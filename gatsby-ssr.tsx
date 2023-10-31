import { GatsbySSR } from "gatsby"
import { gtmNoscript, gtmScript } from "./src/components/gtm-setup"

export const onRenderBody: GatsbySSR["onRenderBody"] = ({
  setHeadComponents,
  setPreBodyComponents,
}) => {
  setHeadComponents([gtmScript])
  setPreBodyComponents([gtmNoscript])
}
