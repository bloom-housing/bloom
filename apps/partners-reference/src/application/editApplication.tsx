import React, { Fragment, useMemo } from "react"
import { useRouter } from "next/router"
import moment from "moment"
import Head from "next/head"
import {
  PageHeader,
  t,
  Tag,
  GridSection,
  ViewItem,
  GridCell,
  MinimalTable,
  InlineButton,
  DOBField,
  BlankApplicationFields,
} from "@bloom-housing/ui-components"
import { useSingleApplicationData } from "../../lib/hooks"
import Layout from "../../layouts/application"
import { useForm } from "react-hook-form"

type Props = {
  isEditable?: boolean
}

const EditApplication = ({ isEditable }: Props) => {
  const router = useRouter()

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, handleSubmit, errors } = useForm({ defaultValues: BlankApplicationFields })

  return (
    <>
      <section className="flex flex-row w-full mx-auto max-w-screen-xl justify-between px-5 items-center my-3">
        {!!isEditable && (
          <InlineButton arrow onClick={() => router.back()}>
            {t("t.back")}
          </InlineButton>
        )}
        {/* TODO:hardcoded until we get information from the backend */}
        <div className="status-bar__status md:pl-4 md:w-3/12">
          <Tag success pillStyle>
            Submitted
          </Tag>
        </div>
      </section>

      <section className="bg-primary-lighter">
        <div className="flex flex-row flex-wrap mx-auto px-5 mt-5 max-w-screen-xl">
          <div className="info-card md:w-9/12">
            <GridSection
              className="bg-primary-lighter"
              title={t("application.details.applicationData")}
              inset
            >
              <GridCell>
                <ViewItem label={t("application.new.dateSubmitted")}>.</ViewItem>
              </GridCell>
              <GridCell>
                <ViewItem label={t("application.new.timeSubmitted")}>.</ViewItem>
              </GridCell>
              <GridCell>
                <ViewItem label={t("application.new.languageSubmittedIn")}>.</ViewItem>
              </GridCell>
            </GridSection>
          </div>

          {/* <div className="md:w-3/12">
            <ul className="status-messages">
              <li className="status-message">
                <div className="status-message__note text-center">
                  {t("t.lastUpdated")} {applicationUpdated}
                </div>
              </li>
            </ul>
          </div> */}
        </div>
      </section>
    </>
  )
}

export default EditApplication
