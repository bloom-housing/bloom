import { Card, Heading, Link } from "@bloom-housing/ui-seeds"
import styles from "./ResourceCard.module.scss"
import Markdown from "markdown-to-jsx"
import { RenderIf } from "../../lib/helpers"

export interface ResourceCardProps {
  title: string
  content: string
  href?: string
}

const ResourceCard = ({ title, href, content }: ResourceCardProps) => {
  return (
    <Card className={styles["resource-card"]}>
      {href ? (
        <Link hideExternalLinkIcon={true} href={href} className={styles["resource-card-title"]}>
          {title}
        </Link>
      ) : (
        <Heading priority={3} className={styles["resource-card-title"]}>
          {title}
        </Heading>
      )}

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
          },
        }}
        className={styles["resource-card-content"]}
        children={content}
      />
    </Card>
  )
}

export default ResourceCard
