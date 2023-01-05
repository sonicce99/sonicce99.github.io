/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import github from "../../static/github.png"
import notion from "../../static/notion.png"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            github
          }
        }
      }
    }
  `)

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = data.site.siteMetadata?.author
  // const social = data.site.siteMetadata?.social

  return (
    <div
      className="bio"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <StaticImage
        className="bio-avatar"
        formats={["auto", "webp", "avif"]}
        src="../images/profile-pic.png"
        width={90}
        height={90}
        alt="Profile picture"
      />
      {author?.name && (
        <div>
          <h3>안녕하세요 🙌🏻 동수입니다.</h3>
          <p>
            주어진 상황에서 최고의 퍼포먼스를 내기위해 최선을 다하고 있습니다.
          </p>
          <p>기억보단 기록을, 기록보단 공유하는 것을 좋아합니다.</p>
          <p style={{ marginBottom: "1vh" }}>
            현재는 풀필먼트 서비스 회사에서 웹 프론트 개발을 하고 있습니다. 🎃
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              rowGap: "10px",
            }}
          >
            <p style={{ marginRight: "2vw" }}>📬 : sonicce99@naver.com</p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <a
                href="https://github.com/sonicce99"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={github}
                  style={{
                    background: "white",
                    borderRadius: "15px",
                    marginRight: "15px",
                  }}
                  width="25px"
                  alt="github 이미지"
                />
              </a>

              <a
                href="https://sonicce99.notion.site/907ecc80c359442c910659a926d2eb30"
                target="_blank"
                rel="noreferrer"
              >
                <img
                  src={notion}
                  style={{
                    background: "white",
                    borderRadius: "15px",
                  }}
                  width="25px"
                  alt="notion 이미지"
                />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Bio
