import React, { useContext, useState, useMemo, useEffect } from "react"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  MultiselectQuestion,
  MultiselectQuestionsApplicationSectionEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { AgTable, t, useAgTable } from "@bloom-housing/ui-components"
import { Button, Tag } from "@bloom-housing/ui-seeds"
import dayjs from "dayjs"
import Head from "next/head"
import Layout from "../../layouts"
import { NavigationHeader } from "../../components/shared/NavigationHeader"
import { useJurisdictionalMultiselectQuestionList } from "../../lib/hooks"
import EditPreference, { DrawerType } from "../../components/settings/preferences/EditPreference"
import styles from "./preferences-new.module.scss"

const SettingsPreferences = () => {
  const { profile } = useContext(AuthContext)
  const tableOptions = useAgTable()

  const [editConfirmModalOpen, setEditConfirmModalOpen] = useState<MultiselectQuestion | null>(null)
  const [preferenceDrawerOpen, setPreferenceDrawerOpen] = useState<DrawerType | null>(null)
  const [questionData, setQuestionData] = useState<MultiselectQuestion>(null)

  const columns = useMemo(() => {
    return [
      {
        headerName: t("t.preference"),
        field: "name",
        flex: 1.5,
        cellRendererFramework: ({ data }) => {
          const { preference, id, name } = data
          return (
            <Button
              variant="text"
              onClick={() => setEditConfirmModalOpen(preference)}
              id={`preference-link-${id}`}
            >
              {name}
            </Button>
          )
        },
      },
      {
        headerName: t("application.status"),
        field: "",
        cellRendererFramework: ({ data }) => {
          let variant = null
          switch (data.status) {
            case "draft":
              variant = "primary"
              break
            case "active":
              variant = "success"
              break
            case "retiring":
              variant = "highlight-warm"
              break
          }
          const statusText = data.status.charAt(0).toUpperCase() + data.status.slice(1)
          return (
            <Tag variant={variant} className={styles["tag-in-table"]}>
              {statusText}
            </Tag>
          )
        },
      },
      {
        headerName: t("t.jurisdictions"),
        field: "jurisdictions",
        flex: 1.5,
      },
      { headerName: t("t.lastUpdated"), field: "updatedAt" },
    ]
  }, [])

  const { data, loading, cacheKey } = useJurisdictionalMultiselectQuestionList(
    profile?.jurisdictions?.map((jurisdiction) => jurisdiction.id).toString(),
    MultiselectQuestionsApplicationSectionEnum.preferences
  )

  const items = useMemo(
    () =>
      (data || [])
        .sort((a, b) => {
          const aChar = a.text.toUpperCase()
          const bChar = b.text.toUpperCase()
          if (aChar === bChar)
            return a.updatedAt > b.updatedAt ? -1 : a.updatedAt < b.updatedAt ? 1 : 0
          return aChar.localeCompare(bChar)
        })
        .map((preference) => {
          const { name, status, jurisdictions, updatedAt } = preference
          return {
            name,
            status,
            jurisdictions: jurisdictions.map((jurisdiction) => jurisdiction.name).join(", "),
            updatedAt: dayjs(updatedAt).format("MM/DD/YYYY"),
            preference,
          }
        }),
    [data]
  )

  if (profile?.userRoles?.isPartner || profile?.userRoles?.isSupportAdmin) {
    window.location.href = "/unauthorized"
  }

  return (
    <>
      <Layout>
        <Head>
          <title>{`Preferences - ${t("nav.siteTitlePartners")}`}</title>
        </Head>
        <NavigationHeader className="relative" title={t("t.preferences")} />
        <section className={styles["preferences-section"]}>
          <div className={styles["table-wrapper"]}>
            <AgTable
              id="preferences-table"
              pagination={{
                perPage: tableOptions.pagination.itemsPerPage,
                setPerPage: tableOptions.pagination.setItemsPerPage,
                currentPage: tableOptions.pagination.currentPage,
                setCurrentPage: tableOptions.pagination.setCurrentPage,
              }}
              config={{
                columns,
                totalItemsLabel: "items",
              }}
              data={{
                items,
                loading: loading,
                totalItems: 2,
                totalPages: 1,
              }}
              search={{
                showSearch: false,
                setSearch: tableOptions.filter.setFilterValue, // currently not used
              }}
              headerContent={
                <>
                  <span></span>
                  <span>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setQuestionData(null)
                        setPreferenceDrawerOpen("add")
                      }}
                      id={"add-preference"}
                    >
                      {t("t.addItem")}
                    </Button>
                  </span>
                </>
              }
            />
          </div>
        </section>
      </Layout>

      <EditPreference
        cacheKey={cacheKey}
        editConfirmModalOpen={editConfirmModalOpen}
        setEditConfirmModalOpen={setEditConfirmModalOpen}
        preferenceDrawerOpen={preferenceDrawerOpen}
        setPreferenceDrawerOpen={setPreferenceDrawerOpen}
        questionData={questionData}
        setQuestionData={setQuestionData}
      />
    </>
  )
}

export default SettingsPreferences
