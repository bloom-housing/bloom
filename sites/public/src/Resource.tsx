import Markdown from "markdown-to-jsx"
import RenderIf from "./RenderIf"

const Resource = ({ children }) => (
  <div className="info-card markdown">
    <Markdown
      options={{
        overrides: {
          RenderIf,
          a: {
            component: ({ children, ...props }) => {
              if (props.href?.startsWith("tel:") || props.href?.startsWith("mailto:")) {
                return <a {...props}>{children}</a>
              } else {
                // Make sure standard web URLs will open in a new tab
                return (
                  <a {...props} target="_blank">
                    {children}
                  </a>
                )
              }
            },
          },
          h3: {
            component: ({ children, ...props }) => (
              <div className="info-card__header">
                <h3 {...props} className="info-card__title">
                  {children}
                </h3>
              </div>
            ),
          },
        },
      }}
      children={children}
    />
  </div>
)

export default Resource
