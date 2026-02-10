import React, { useContext, useMemo, useState } from "react"
import { AuthContext } from "@bloom-housing/shared-helpers"
import {
  FeatureFlagEnum,
  MultiselectQuestion,
  MultiselectQuestionsApplicationSectionEnum,
  MultiselectQuestionsStatusEnum,
} from "@bloom-housing/shared-helpers/src/types/backend-swagger"
import { AgTable, t, useAgTable } from "@bloom-housing/ui-components"
import { Button, Tag } from "@bloom-housing/ui-seeds"
import dayjs from "dayjs"
import Head from "next/head"
import { useRouter } from "next/router"
import EditMultiselectQuestion, {
  DrawerType,
} from "../../../components/settings/MultiselectQuestions/EditMultiselectQuestion"
import {
  getSettingsTabs,
  SettingsIndexEnum,
} from "../../../components/settings/SettingsViewHelpers"
import { NavigationHeader } from "../../../components/shared/NavigationHeader"
import Layout from "../../../layouts"
import TabView from "../../../layouts/TabView"
import { useJurisdictionalMultiselectQuestionList } from "../../../lib/hooks"
import styles from "./preferences.module.scss"

const MultiselectQuestionsPreferences = () => {
  const { profile, doJurisdictionsHaveFeatureFlagOn } = useContext(AuthContext)
  const router = useRouter()
  const tableOptions = useAgTable()
  const enableProperties = doJurisdictionsHaveFeatureFlagOn(FeatureFlagEnum.enableProperties)

  const [multiselectQuestionDrawerOpen, setMultiselectQuestionDrawerOpen] =
    useState<DrawerType | null>(null)
  const [questionData, setQuestionData] = useState<MultiselectQuestion>(null)

  const columns = useMemo(() => {
    return [
      {
        headerName: t("settings.preference"),
        field: "name",
        flex: 1.5,
      },
      {
        headerName: t("application.status"),
        field: "",
        cellRendererFramework: ({ data }) => {
          let variant = null
          switch (data.status) {
            case MultiselectQuestionsStatusEnum.active:
              variant = "success"
              break
            case MultiselectQuestionsStatusEnum.toRetire:
            case MultiselectQuestionsStatusEnum.retired:
              variant = "highlight-warm"
              break
          }
          const statusText = `${data.status.charAt(0).toUpperCase()}${data.status.slice(1)}`
          return <Tag variant={variant}>{statusText}</Tag>
        },
      },
      {
        headerName: t("t.jurisdictions"),
        field: "jurisdictions",
        flex: 1.5,
      },
      { headerName: t("t.lastUpdated"), field: "updatedAt" },
      {
        headerName: "actions",
        field: "",
        cellRendererFramework: ({ data }) => {
          const { preference, id } = data

          return preference.status === MultiselectQuestionsStatusEnum.draft ||
            preference.status === MultiselectQuestionsStatusEnum.visible ? (
            <Button
              variant="text"
              onClick={() => {
                setQuestionData(preference)
                setMultiselectQuestionDrawerOpen("edit")
              }}
              id={`preference-link-${id}`}
            >
              {t("t.edit")}
            </Button>
          ) : (
            <Button
              variant="text"
              onClick={() => {
                setQuestionData(preference)
                setMultiselectQuestionDrawerOpen("view")
              }}
              id={`preference-link-${id}`}
            >
              {t("t.view")}
            </Button>
          )
        },
      },
    ]
  }, [])

  const { data, loading, cacheKey } = useJurisdictionalMultiselectQuestionList(
    profile?.jurisdictions?.map((jurisdiction) => jurisdiction.id).toString(),
    MultiselectQuestionsApplicationSectionEnum.preferences,
    [
      MultiselectQuestionsStatusEnum.draft,
      MultiselectQuestionsStatusEnum.visible,
      MultiselectQuestionsStatusEnum.active,
      MultiselectQuestionsStatusEnum.toRetire,
    ]
  )

  const items = useMemo(
    () =>
      (data?.items || [])
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
        <NavigationHeader className="relative" title={t("settings.preferences")} />
        <TabView
          hideTabs={!enableProperties}
          tabs={getSettingsTabs(SettingsIndexEnum.preferences, router, true)}
        >
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
                          setMultiselectQuestionDrawerOpen("add")
                        }}
                        id={"add-preference"}
                      >
                        {t("settings.preferenceAdd")}
                      </Button>
                    </span>
                  </>
                }
              />
            </div>
          </section>
        </TabView>
      </Layout>

      <EditMultiselectQuestion
        cacheKey={cacheKey}
        multiselectQuestionDrawerOpen={multiselectQuestionDrawerOpen}
        setMultiselectQuestionDrawerOpen={setMultiselectQuestionDrawerOpen}
        questionData={questionData}
        setQuestionData={setQuestionData}
      />
    </>
  )
}

export default MultiselectQuestionsPreferences
