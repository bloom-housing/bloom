import { CustomIconMap, CustomIconType } from "@bloom-housing/shared-helpers"
import MaxWidthLayout from "../../layouts/max-width"
import { Heading, Icon } from "@bloom-housing/ui-seeds"
import styles from "./HomeSection.module.scss"

interface HomeSectionProps {
  sectionTitle: string
  sectionIcon?: CustomIconType
  layoutClassName?: string
}

export const HomeSection = ({
  sectionIcon,
  sectionTitle,
  children,
  layoutClassName,
}: React.PropsWithChildren<HomeSectionProps>) => {
  const customIcon = sectionIcon ? CustomIconMap[sectionIcon] : undefined
  const className = [styles["section-container"]]
  if (layoutClassName) className.push(layoutClassName)

  return (
    <MaxWidthLayout className={`home-section ${className.join(" ")}`}>
      <div className={styles["section-header"]}>
        {customIcon && (
          <Icon outlined size="xl" className={styles["section-header-icon"]}>
            {customIcon}
          </Icon>
        )}
        <Heading size="3xl" priority={2} className={styles["section-header-title"]}>
          {sectionTitle}
        </Heading>
      </div>
      <div>{children}</div>
    </MaxWidthLayout>
  )
}
