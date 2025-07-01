import { useContext, useEffect, useMemo, useState } from "react"
import Head from "next/head"
import { AuthContext } from "@bloom-housing/shared-helpers"
import PencilSquareIcon from "@heroicons/react/24/solid/PencilSquareIcon"
import { Field, Hero, MinimalTable, t } from "@bloom-housing/ui-components"
import { Button, Card, Drawer, Heading, Icon, Tabs } from "@bloom-housing/ui-seeds"
import Layout from "../../layouts"
import { NavigationHeader } from "../../components/shared/NavigationHeader"

export enum TabsIndexEnum {
  jurisdiction,
  featureFlag,
}

const Admin = () => {
  const { profile, featureFlagService, jurisdictionsService } = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(true)
  const [featureFlags, setFeatureFlags] = useState([])
  const [jurisdictions, setJurisdictions] = useState([])
  const [selectedJurisdiction, setSelectedJurisdiction] = useState("")
  const [selectedFeatureFlags, setSelectedFeatureFlags] = useState([])
  const [selectedJurisdictions, setSelectedJurisdictions] = useState([])
  const [selectedFeatureFlag, setSelectedFeatureFlag] = useState("")
  const [viewBy, setViewBy] = useState(TabsIndexEnum.jurisdiction)

  useEffect(() => {
    const fetchData = async () => {
      const retrievedFeatureFlags = await featureFlagService.list()
      setFeatureFlags(retrievedFeatureFlags)
      const retrievedJurisdictions = await jurisdictionsService.list()
      setJurisdictions(retrievedJurisdictions)
      setIsLoading(false)
    }
    if (isLoading) {
      void fetchData()
    }
  }, [featureFlagService, jurisdictionsService, isLoading])

  useEffect(() => {
    if (selectedJurisdiction) {
      const selected = jurisdictions.find((juris) => juris.id === selectedJurisdiction)
      setSelectedFeatureFlags(selected?.featureFlags)
    } else {
      setSelectedFeatureFlags([])
    }
  }, [selectedJurisdiction, jurisdictions, featureFlags])

  useEffect(() => {
    if (selectedFeatureFlag) {
      const selected = featureFlags.find((flag) => flag.id === selectedFeatureFlag)
      setSelectedJurisdictions(selected?.jurisdictions?.map((juris) => juris.id))
    } else {
      setSelectedJurisdictions([])
    }
  }, [selectedFeatureFlag, jurisdictions, featureFlags])

  const jurisdictionTableData = useMemo(() => {
    return jurisdictions?.map((juris) => {
      return {
        jurisdiction: {
          content: juris.name,
        },
        actions: {
          content: (
            <div className={"flex justify-end gap-5"}>
              <button
                className="text-primary"
                onClick={() => setSelectedJurisdiction(juris.id)}
                aria-label={"Edit"}
              >
                <Icon size="md">
                  <PencilSquareIcon />
                </Icon>
              </button>
            </div>
          ),
        },
      }
    })
  }, [jurisdictions])

  const featureFlagTableData = useMemo(() => {
    return featureFlags?.map((flag) => {
      return {
        featureFlag: {
          content: <b>{flag.name}</b>,
        },
        description: {
          content: flag.description,
        },
        actions: {
          content: (
            <div className={"flex justify-end gap-5"}>
              <button
                className="text-primary"
                onClick={() => setSelectedFeatureFlag(flag.id)}
                aria-label={"Edit"}
              >
                <Icon size="md">
                  <PencilSquareIcon />
                </Icon>
              </button>
            </div>
          ),
        },
      }
    })
  }, [featureFlags])

  const onAddAll = async () => {
    await featureFlagService.addAllNewFeatureFlags()
  }

  const onFeatureFlagChange = async (featureFlagId: string, jurisdiction: string) => {
    const foundFeatureFlag = featureFlags.find((flag) => flag.id === featureFlagId)
    const shouldRemove = foundFeatureFlag.jurisdictions.some((juris) => juris.id === jurisdiction)
    await featureFlagService.associateJurisdictions({
      body: {
        id: featureFlagId,
        associate: !shouldRemove ? [jurisdiction] : [],
        remove: shouldRemove ? [jurisdiction] : [],
      },
    })
    setIsLoading(true)
  }

  if (!profile || !profile?.userRoles?.isSuperAdmin) {
    return (
      <Layout>
        <Head>
          <title>{t("nav.siteTitlePartners")}</title>
        </Head>
        <Hero title={t("t.administration")}>{t("errors.unauthorized.message")}</Hero>
      </Layout>
    )
  }

  const selectedJurisdictionName = selectedJurisdiction
    ? jurisdictions.find((juris) => juris.id === selectedJurisdiction)?.name
    : ""
  const selectedFeatureFlagName = selectedFeatureFlag
    ? featureFlags.find((flag) => flag.id === selectedFeatureFlag)?.name
    : ""

  return (
    <>
      <Layout>
        <Head>
          <title>{t("nav.siteTitlePartners")}</title>
        </Head>
        <NavigationHeader className="relative" title={t("t.administration")} />
        <section>
          <article className="flex-row flex-wrap relative max-w-screen-xl mx-auto py-8 px-4">
            <Tabs
              onSelect={(value) => {
                setViewBy(value)
              }}
              selectedIndex={viewBy}
              className={"seeds-m-be-content"}
            >
              <Tabs.TabList>
                <Tabs.Tab>{t("admin.byJurisdiction")}</Tabs.Tab>
                <Tabs.Tab>{t("admin.byFeatureFlag")}</Tabs.Tab>
              </Tabs.TabList>

              <Tabs.TabPanel>
                <Card.Header className={"seeds-m-be-header"}>
                  <Heading size="2xl" priority={2}>
                    {t("t.jurisdictions")}
                  </Heading>
                </Card.Header>
                <Card.Section>
                  <MinimalTable
                    headers={{ jurisdiction: "t.jurisdiction", actions: "" }}
                    data={jurisdictionTableData}
                    cellClassName={"px-5 py-3"}
                    flushRight={true}
                  />
                </Card.Section>
              </Tabs.TabPanel>
              <Tabs.TabPanel>
                <Card.Header className={"seeds-m-be-header"}>
                  <Heading size="2xl" priority={2}>
                    {t("t.featureFlag")}
                  </Heading>
                </Card.Header>
                <Card.Section>
                  {viewBy === TabsIndexEnum.featureFlag && (
                    <MinimalTable
                      headers={{
                        featureFlag: "t.featureFlag",
                        description: "t.descriptionTitle",
                        actions: "",
                      }}
                      data={featureFlagTableData}
                      cellClassName={"px-5 py-3"}
                    />
                  )}
                </Card.Section>
              </Tabs.TabPanel>
            </Tabs>
            <Button onClick={onAddAll}>{t("admin.addFeatureFlags")}</Button>
          </article>
        </section>
      </Layout>

      {/* Edit by jurisdiction Drawer */}
      <Drawer isOpen={!!selectedJurisdiction} onClose={() => setSelectedJurisdiction("")}>
        <Drawer.Header>{selectedJurisdictionName}</Drawer.Header>
        <Drawer.Content>
          <div>
            {featureFlags.map((flag) => (
              <div key={flag.id} className={"seeds-m-be-content"}>
                <legend className={"seeds-m-be-text"}>{flag.name}</legend>
                <Field
                  type="checkbox"
                  id={flag.id}
                  name={flag.name}
                  label={flag.description}
                  inputProps={{
                    defaultChecked: selectedFeatureFlags.some(
                      (selected) => selected.id === flag.id
                    ),
                  }}
                  bordered
                  onChange={() => onFeatureFlagChange(flag.id, selectedJurisdiction)}
                />
              </div>
            ))}
          </div>
        </Drawer.Content>
      </Drawer>

      {/* Edit by feature flag Drawer */}
      <Drawer isOpen={!!selectedFeatureFlag} onClose={() => setSelectedFeatureFlag("")}>
        <Drawer.Header>{selectedFeatureFlagName}</Drawer.Header>
        <Drawer.Content>
          <div>
            {jurisdictions.map((juris) => (
              <div key={juris.id} className={"seeds-m-be-content"}>
                <Field
                  type="checkbox"
                  id={juris.id}
                  name={juris.name}
                  label={juris.name}
                  inputProps={{
                    defaultChecked: selectedJurisdictions.some((selected) => selected === juris.id),
                  }}
                  bordered
                  onChange={() => onFeatureFlagChange(selectedFeatureFlag, juris.id)}
                />
              </div>
            ))}
          </div>
        </Drawer.Content>
      </Drawer>
    </>
  )
}

export default Admin
