import { AlertBox, t } from "@bloom-housing/ui-components"

const FinderDisclaimer = () => (
  <div>
    <AlertBox type="notice" closeable>
      {t("finder.disclaimer.alert")}
    </AlertBox>
    <ul className="list-disc list-inside py-8 flex flex-col gap-y-4">
      {[1, 2, 3, 4, 5].map((num) => (
        <li key={`disclaimer_${num}`} className="pl-2 text-gray-700">
          {t(`finder.disclaimer.info${num}`)}
        </li>
      ))}
    </ul>
  </div>
)

export default FinderDisclaimer
