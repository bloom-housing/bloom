import { AlertBox, t } from "@bloom-housing/ui-components"
import styles from "./FinderDisclaimer.module.scss"

export default function FinderDisclaimer() {
  return (
    <div>
      <AlertBox type="notice" closeable>
        {t("finder.disclaimer.alert")}
      </AlertBox>
      <ul data-testid="disclaimers-list" className={styles["disclaimer-info-list"]}>
        {[1, 2, 3, 4, 5].map((num) => (
          <li key={`disclaimer_${num}`} className={styles["disclaimer-info-point"]}>
            {t(`finder.disclaimer.info${num}`)}
          </li>
        ))}
      </ul>
    </div>
  )
}
