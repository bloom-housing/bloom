import React, { useState } from "react"
import { useFormContext } from "react-hook-form"
import {
  t,
  GridSection,
  DateField,
  TimeField,
  Drawer,
  Button,
  AppearanceSizeType,
} from "@bloom-housing/ui-components"
import { FormListing } from "../index"
import { OpenHouseForm } from "../OpenHouseForm"
import moment from "moment"

type ApplicationDatesProps = {
  listing?: FormListing
}

const ApplicationDates = ({ listing }: ApplicationDatesProps) => {
  const formMethods = useFormContext()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch } = formMethods

  const [drawerOpenHouse, setDrawerOpenHouse] = useState(false)

  return (
    <>
      <GridSection
        grid={false}
        separator
        title={t("listings.sections.applicationDatesTitle")}
        description={t("listings.sections.applicationDatesSubtitle")}
      >
        <GridSection columns={2}>
          <DateField
            label={t("listings.applicationDeadline")}
            name={"applicationDueDateField"}
            id={"applicationDueDateField"}
            register={register}
            watch={watch}
            note={t("listings.whenApplicationsClose")}
            defaultDate={{
              month: listing?.applicationDueDate
                ? moment(new Date(listing?.applicationDueDate)).utc().format("MM")
                : null,
              day: listing?.applicationDueDate
                ? moment(new Date(listing?.applicationDueDate)).utc().format("DD")
                : null,
              year: listing?.applicationDueDate
                ? moment(new Date(listing?.applicationDueDate)).utc().format("YYYY")
                : null,
            }}
          />
          <TimeField
            label={t("listings.applicationDueTime")}
            name={"applicationDueTimeField"}
            id={"applicationDueTimeField"}
            register={register}
            watch={watch}
            defaultValues={{
              hours: listing?.applicationDueTime
                ? moment(new Date(listing?.applicationDueTime)).format("hh")
                : null,
              minutes: listing?.applicationDueTime
                ? moment(new Date(listing?.applicationDueTime)).format("mm")
                : null,
              seconds: listing?.applicationDueTime
                ? moment(new Date(listing?.applicationDueTime)).format("ss")
                : null,
              period: new Date(listing?.applicationDueTime).getHours() >= 12 ? "pm" : "am",
            }}
          />
        </GridSection>
        <div className="bg-gray-300 px-4 py-5 mt-5">
          {/* <div className="mb-5">
            <MinimalTable headers={{}} data={[]} />
          </div> */}

          <Button
            type="button"
            size={AppearanceSizeType.normal}
            onClick={() => setDrawerOpenHouse(true)}
          >
            {t("listings.sections.addOpenHouse")}
          </Button>
        </div>
      </GridSection>

      <Drawer
        open={!!drawerOpenHouse}
        title={t("listings.sections.addOpenHouse")}
        ariaDescription={t("listings.sections.addOpenHouse")}
        onClose={() => setDrawerOpenHouse(null)}
      >
        <OpenHouseForm />
      </Drawer>
    </>
  )
}

export default ApplicationDates
