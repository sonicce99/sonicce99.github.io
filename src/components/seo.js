/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import PropTypes from "prop-types"
import { Helmet } from "react-helmet"
import { useStaticQuery, graphql } from "gatsby"

const Seo = ({ description, lang, meta, title }) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            author {
              name
              summary
            }
            description
            image
            keywords
            siteUrl
            social {
              github
            }
            title
          }
        }
      }
    `
  )

  const author = site.siteMetadata?.author?.name
  const metaDescription = description || site.siteMetadata.description
  const defaultTitle = site.siteMetadata?.title
  const image = site.siteMetadata?.image
  const keywords = site.siteMetadata?.keywords

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={defaultTitle ? `%s | ${defaultTitle}` : null}
      meta={[
        {
          name: `title`,
          content: defaultTitle,
        },
        {
          name: `author`,
          content: author,
        },
        {
          name: `keywords`,
          content: keywords,
        },
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:image`,
          content: image,
        },
        {
          property: `og:title`,
          content: defaultTitle,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `creator`,
          content: site.siteMetadata?.social?.github,
        },
        {
          name: `google-site-verification`,
          content: "UqO2bE8rlQgda0_FcbAF8XKCh_eeFuQeNsSFLuO840o",
        },
      ].concat(meta)}
    />
  )
}

Seo.defaultProps = {
  lang: `ko`,
  meta: [],
}

Seo.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
}

export default Seo
