import { t } from "@bloom-housing/ui-components"
import { Button, Drawer } from "@bloom-housing/ui-seeds"

export const FilterDrawer = () => (
  <Drawer
    isOpen={true}
    onClose={() => console.log("log")}
    ariaLabelledBy="drawer-heading"
    ariaDescribedBy="drawer-content"
  >
    <Drawer.Header id="drawer-heading">{t("t.filter")}</Drawer.Header>
    <Drawer.Content id="drawer-content">test</Drawer.Content>
    <Drawer.Footer>
      <Button variant="primary" size="sm">
        {t("listings.showMatchingListings")}
      </Button>
      <Button variant="primary-outlined" size="sm">
        {t("t.cancel")}
      </Button>
    </Drawer.Footer>
  </Drawer>
)
