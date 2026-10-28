import { Card, Heading, Link } from "@bloom-housing/ui-seeds"
import styles from "./ContactCard.module.scss"

export interface ContactCardProps {
  address?: React.ReactNode
  contactDescription?: React.ReactNode | string
  contactInfo?: string
  email?: string
  heading?: React.ReactNode | string
  hours?: string
  phone?: string
}

const ContactCard = (props: ContactCardProps) => {
  return (
    <Card className={styles["contact-card"]}>
      <div className={styles["contact-card-subsection"]}>
        {props.heading && (
          <Heading size="xl" priority={2}>
            {props.heading}
          </Heading>
        )}
        {props.contactDescription && (
          <div className={styles["contact-card-description"]}>{props.contactDescription}</div>
        )}
      </div>
      <div className={styles["contact-card-subsection"]}>
        {props.contactInfo && <p className={styles["contact-card-info"]}>{props.contactInfo}</p>}
        {props.email && <Link href={`mailto:${props.email}`}>{props.email}</Link>}
        {props.phone && <Link href={`tel:${props.phone}`}>{props.phone}</Link>}
        {props.address}
        {props.hours && <p className={styles["contact-card-info"]}>{props.hours}</p>}
      </div>
    </Card>
  )
}

export default ContactCard
