import React, { useId, useState } from "react"
import PlusIcon from "@heroicons/react/24/solid/PlusIcon"
import MinusIcon from "@heroicons/react/24/solid/MinusIcon"
import { Card, Heading, Icon } from "@bloom-housing/ui-seeds"
import styles from "./FilterCollapsibleSection.module.scss"

interface FilterCollapsibleSectionProps {
  children: React.ReactNode
  title: string
}

export const FilterCollapsibleSection = ({ children, title }: FilterCollapsibleSectionProps) => {
  const [collapsed, setCollapsed] = useState(false)
  const contentId = useId()
  const titleId = useId()

  return (
    <Card className={styles["filter-section"]}>
      <Card.Section>
        <div className={styles["header"]}>
          <Heading priority={5} size="lg" id={titleId} className={styles["heading"]}>
            {title}
          </Heading>
          <button
            type="button"
            className={styles["toggle"]}
            aria-expanded={!collapsed}
            aria-controls={contentId}
            aria-labelledby={titleId}
            onClick={() => setCollapsed(!collapsed)}
          >
            <Icon size="md" className={styles["toggle-icon"]}>
              {collapsed ? <PlusIcon /> : <MinusIcon />}
            </Icon>
          </button>
        </div>
        <div id={contentId} hidden={collapsed} className={styles["content"]}>
          {children}
        </div>
      </Card.Section>
    </Card>
  )
}
