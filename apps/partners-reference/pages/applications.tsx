import React, { useState, useEffect, useContext, useRef, useMemo } from "react"
import { useRouter } from "next/router"
import moment from "moment"
import Head from "next/head"
import {
  Field,
  PageHeader,
  MetaTags,
  t,
  Button,
  ApiClientContext,
  debounce,
  formatIncome,
} from "@bloom-housing/ui-components"
import { useApplicationsData } from "../lib/hooks"
import Layout from "../layouts/application"
import { useForm } from "react-hook-form"
import { AgGridReact } from "ag-grid-react"

const ApplicationsList = () => {
  const metaDescription = t("pageDescription.welcome", { regionName: t("region.name") })
  const metaImage = "" // TODO: replace with hero image

  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { register, watch } = useForm()

  const filterField = watch("filter-input", "")
  const [delayedFilterValue, setDelayedFilterValue] = useState(filterField)

  const pageSize = watch("page-size", 8)
  const [pageIndex, setPageIndex] = useState(1)

  const listingId = router.query.id as string
  const { appsData } = useApplicationsData(pageIndex, pageSize, listingId, delayedFilterValue)
  const { applicationsService } = useContext(ApiClientContext)

  function fetchFilteredResults(value: string) {
    setDelayedFilterValue(value)
  }

  const debounceFilter = useRef(debounce((value: string) => fetchFilteredResults(value), 1000))

  // reset page to 1 when user change limit
  useEffect(() => {
    setPageIndex(1)
  }, [pageSize])

  // fetch filtered data
  useEffect(() => {
    setPageIndex(1)
    debounceFilter.current(filterField)
  }, [filterField])

  const applications = appsData?.items || []
  const appsMeta = appsData?.meta

  const pageSizeOptions = ["8", "100", "500", "1000"]
  const pageJumpOptions = Array.from(Array(appsMeta?.totalPages).keys())?.map((item) => item + 1)

  // action buttons
  const onBtNext = () => {
    setPageIndex(pageIndex + 1)
  }

  const onBtPrevious = () => {
    setPageIndex(pageIndex - 1)
  }

  const onExport = async () => {
    const content = await applicationsService.listAsCsv({ listingId, includeHeaders: true })
    const now = new Date()
    const dateString = moment(now).format("YYYY-MM-DD_HH:mm:ss")

    const blob = new Blob([content], { type: "text/csv" })
    const fileLink = document.createElement("a")
    fileLink.setAttribute("download", `appplications-${listingId}-${dateString}.csv`)
    fileLink.href = URL.createObjectURL(blob)

    fileLink.click()
  }

  // ag grid settings
  class formatLinkCell {
    linkWithId: HTMLAnchorElement

    init(params) {
      this.linkWithId = document.createElement("a")
      this.linkWithId.setAttribute("href", `/applications/${params.value}`)
      this.linkWithId.innerText = params.value
    }

    getGui() {
      return this.linkWithId
    }
  }
  class formatIncomeAnnualCell {
    incomeUsd: HTMLSpanElement

    init(params) {
      this.incomeUsd = document.createElement("span")
      this.incomeUsd.innerText = formatIncome(
        params.value,
        params.data.application.incomePeriod,
        "perYear"
      )
    }

    getGui() {
      return this.incomeUsd
    }
  }

  class formatIncomeMonthlyCell {
    incomeUsd: HTMLSpanElement

    init(params) {
      this.incomeUsd = document.createElement("span")
      this.incomeUsd.innerText = formatIncome(
        params.value,
        params.data.application.incomePeriod,
        "perMonth"
      )
    }

    getGui() {
      return this.incomeUsd
    }
  }

  class formatAltContactRelationshipCell {
    relationship: HTMLSpanElement

    init({ data, value }) {
      this.relationship = document.createElement("span")
      this.relationship.innerText =
        value === "other"
          ? data.application.alternateContact.otherType
          : t(`application.alternateContact.type.options.${value}`)
    }

    getGui() {
      return this.relationship
    }
  }

  const gridOptions = {
    components: {
      formatLinkCell: formatLinkCell,
      formatIncomeAnnualCell: formatIncomeAnnualCell,
      formatIncomeMonthlyCell: formatIncomeMonthlyCell,
      formatAltContactRelationshipCell: formatAltContactRelationshipCell,
    },
  }

  const defaultColDef = {
    resizable: true,
    maxWidth: 300,
  }

  // get the highest value from householdSize and limit to 6
  const maxHouseholdSize = useMemo(() => {
    let max = 1

    appsData?.items.forEach((item) => {
      if (item.application.householdSize > max) {
        max = item.application.householdSize
      }
    })

    return max < 6 ? max : 6
  }, [appsData])

  const columnDefs = useMemo(() => {
    const defs = [
      {
        headerName: "Application Submission Date",
        field: "createdAt",
        sortable: true,
        filter: false,
        pinned: "left",
        width: 200,
        minWidth: 150,
        sort: "asc",
        valueFormatter: ({ value }) => {
          const date = moment(value).format("MM/DD/YYYY")
          const time = moment(value).format("HH:mm:ss A")

          return `${date} ${t("t.at")} ${time}`
        },
      },
      {
        headerName: "Application Number",
        field: "id",
        sortable: false,
        filter: false,
        width: 150,
        minWidth: 120,
        pinned: "left",
        type: "rightAligned",
        cellRenderer: "formatLinkCell",
      },
      {
        headerName: "First Name",
        field: "application.applicant.firstName",
        sortable: true,
        filter: false,
        pinned: "left",
        width: 125,
        minWidth: 100,
      },
      {
        headerName: "Last Name",
        field: "application.applicant.lastName",
        sortable: true,
        filter: "agTextColumnFilter",
        pinned: "left",
        width: 125,
        minWidth: 100,
      },
      {
        headerName: "Household Size",
        field: "application.householdSize",
        sortable: true,
        filter: false,
        width: 125,
        minWidth: 120,
        type: "rightAligned",
      },
      {
        headerName: "Declared Annual Income",
        field: "application.income",
        sortable: true,
        filter: false,
        width: 180,
        minWidth: 150,
        type: "rightAligned",
        cellRenderer: "formatIncomeAnnualCell",
      },
      {
        headerName: "Declared Monthly Income",
        field: "application.income",
        sortable: true,
        filter: false,
        width: 180,
        minWidth: 150,
        type: "rightAligned",
        cellRenderer: "formatIncomeMonthlyCell",
      },
      {
        headerName: "Subsidy or Voucher",
        field: "application.incomeVouchers",
        sortable: true,
        filter: false,
        width: 120,
        minWidth: 100,
        valueFormatter: (data) => (data.value ? t("t.yes") : t("t.no")),
      },
      {
        headerName: "Request ADA",
        field: "application.accessibility",
        sortable: true,
        filter: false,
        width: 120,
        minWidth: 100,
        valueFormatter: (data) => {
          const posiviveValues = Object.entries(data.value).reduce((acc, curr) => {
            if (curr[1]) {
              acc.push(t(`application.ada.${curr[0]}`))
            }

            return acc
          }, [])

          return posiviveValues.length ? posiviveValues.join(", ") : t("t.none")
        },
      },
      {
        headerName: "Preference Claimed",
        field: "application.preferences",
        sortable: true,
        filter: false,
        width: 150,
        minWidth: 100,
        valueFormatter: (data) => {
          const posiviveValues = Object.entries(data.value).reduce((acc, curr) => {
            if (curr[0] !== "none" && curr[1]) {
              acc.push(t(`application.preferences.options.${curr[0]}`))
            }

            return acc
          }, [])

          return posiviveValues.length ? posiviveValues.join(", ") : t("t.none")
        },
      },
      {
        headerName: "Primary DOB",
        field: "application.applicant",
        sortable: false,
        filter: false,
        width: 150,
        minWidth: 100,
        valueFormatter: ({ value }) => `${value.birthMonth}/${value.birthDay}/${value.birthYear}`,
      },
      {
        headerName: "Email",
        field: "application.applicant.emailAddress",
        sortable: false,
        filter: false,
        width: 150,
        minWidth: 100,
      },
      {
        headerName: "Phone",
        field: "application.applicant.phoneNumber",
        sortable: false,
        filter: false,
        width: 150,
        minWidth: 100,
      },
      {
        headerName: "Phone Type",
        field: "application.applicant.phoneNumberType",
        sortable: false,
        filter: false,
        width: 150,
        minWidth: 100,
        valueFormatter: ({ value }) => t(`application.contact.phoneNumberTypes.${value}`),
      },
      {
        headerName: "Additional Phone",
        field: "application.additionalPhoneNumber",
        sortable: false,
        filter: false,
        width: 150,
        minWidth: 100,
        valueFormatter: ({ value }) => (value ? value : t("t.none")),
      },
      {
        headerName: "Additional Phone Type",
        field: "application.additionalPhoneNumberType",
        sortable: false,
        filter: false,
        width: 150,
        minWidth: 100,
        valueFormatter: ({ value }) =>
          value ? t(`application.contact.phoneNumberTypes.${value}`) : t("t.none"),
      },
      {
        headerName: "Residence Street Address",
        field: "application.applicant.address.street",
        sortable: false,
        filter: false,
        width: 175,
        minWidth: 150,
      },
      {
        headerName: "Residence City",
        field: "application.applicant.address.city",
        sortable: false,
        filter: false,
        width: 150,
        minWidth: 120,
      },
      {
        headerName: "Residence State",
        field: "application.applicant.address.state",
        sortable: false,
        filter: false,
        width: 120,
        minWidth: 100,
      },
      {
        headerName: "Residence Zip",
        field: "application.applicant.address.zipCode",
        sortable: false,
        filter: false,
        width: 120,
        minWidth: 100,
      },
      {
        headerName: "Mailing Street Address	",
        field: "application.mailingAddress.street",
        sortable: false,
        filter: false,
        width: 175,
        minWidth: 150,
      },
      {
        headerName: "Mailing City",
        field: "application.mailingAddress.city",
        sortable: false,
        filter: false,
        width: 150,
        minWidth: 120,
      },
      {
        headerName: "Mailing State",
        field: "application.mailingAddress.state",
        sortable: false,
        filter: false,
        width: 120,
        minWidth: 100,
      },
      {
        headerName: "Mailing Zip",
        field: "application.mailingAddress.zipCode",
        sortable: false,
        filter: false,
        width: 120,
        minWidth: 100,
      },
      {
        headerName: "Work Street Address",
        field: "application.applicant.workAddress.street",
        sortable: false,
        filter: false,
        width: 175,
        minWidth: 150,
      },
      {
        headerName: "Work City",
        field: "application.applicant.workAddress.city",
        sortable: false,
        filter: false,
        width: 150,
        minWidth: 120,
      },
      {
        headerName: "Work State",
        field: "application.applicant.workAddress.state",
        sortable: false,
        filter: false,
        width: 120,
        minWidth: 100,
      },
      {
        headerName: "Work Zip",
        field: "application.applicant.workAddress.zipCode",
        sortable: false,
        filter: false,
        width: 120,
        minWidth: 100,
      },
      {
        headerName: "Alt Contact First Name",
        field: "application.alternateContact.firstName",
        sortable: false,
        filter: false,
        width: 125,
        minWidth: 100,
      },
      {
        headerName: "Alt Contact Last Name",
        field: "application.alternateContact.lastName",
        sortable: false,
        filter: false,
        width: 125,
        minWidth: 100,
      },
      {
        headerName: "Alt Contact Relationship",
        field: "application.alternateContact.type",
        sortable: false,
        filter: false,
        width: 125,
        minWidth: 100,
        cellRenderer: "formatAltContactRelationshipCell",
      },
      {
        headerName: "Alt Contact Agency",
        field: "application.alternateContact.agency",
        sortable: false,
        filter: false,
        width: 125,
        minWidth: 100,
        valueFormatter: ({ value }) => {
          console.log(value)
          return value?.length ? value : t("t.none")
        },
      },
      {
        headerName: "Alt Contact Email",
        field: "application.alternateContact.emailAddress",
        sortable: false,
        filter: false,
        width: 150,
        minWidth: 100,
      },
      {
        headerName: "Alt Contact Phone",
        field: "application.alternateContact.phoneNumber",
        sortable: false,
        filter: false,
        width: 150,
        minWidth: 100,
      },

      {
        headerName: "Alt Contact Street Address",
        field: "application.alternateContact.mailingAddress.street",
        sortable: false,
        filter: false,
        width: 150,
        minWidth: 100,
      },
      {
        headerName: "Alt Contact City",
        field: "application.alternateContact.mailingAddress.city",
        sortable: false,
        filter: false,
        width: 150,
        minWidth: 100,
      },
      {
        headerName: "Alt Contact State",
        field: "application.alternateContact.mailingAddress.state",
        sortable: false,
        filter: false,
        width: 150,
        minWidth: 100,
      },
      {
        headerName: "Alt Contact Zip",
        field: "application.alternateContact.mailingAddress.zipCode",
        sortable: false,
        filter: false,
        width: 150,
        minWidth: 100,
      },
    ]

    const householdCols = []
    // householdSize property includes primary applicant, so we have to exclude it
    for (let i = 0; i < maxHouseholdSize - 1; i++) {
      householdCols.push(
        {
          headerName: `Household First Name ${i + 1}`,
          field: "application.householdMembers",
          sortable: false,
          filter: false,
          width: 125,
          minWidth: 100,
          valueFormatter: ({ value }) => (value[i] ? value[i].firstName : ""),
        },
        {
          headerName: `Household Last Name ${i + 1}`,
          field: "application.householdMembers",
          sortable: false,
          filter: false,
          width: 125,
          minWidth: 100,
          valueFormatter: ({ value }) => (value[i] ? value[i].lastName : ""),
        },
        {
          headerName: `Household Relationship ${i + 1}`,
          field: "application.householdMembers",
          sortable: false,
          filter: false,
          width: 125,
          minWidth: 100,
          valueFormatter: ({ value }) =>
            value[i] ? t(`application.form.options.relationship.${value[i].relationship}`) : "",
        },
        {
          headerName: `Household DOB ${i + 1}`,
          field: "application.householdMembers",
          sortable: false,
          filter: false,
          width: 125,
          minWidth: 100,
          valueFormatter: ({ value }) =>
            value[i] ? `${value[i].birthMonth}/${value[i].birthDay}/${value[i].birthYear}` : "",
        },
        {
          headerName: `Household Street Address ${i + 1}`,
          field: "application.householdMembers",
          sortable: false,
          filter: false,
          width: 125,
          minWidth: 100,
          valueFormatter: ({ value }) => (value[i] ? value[i].address.street : ""),
        },
        {
          headerName: `Household City ${i + 1}`,
          field: "application.householdMembers",
          sortable: false,
          filter: false,
          width: 125,
          minWidth: 100,
          valueFormatter: ({ value }) => (value[i] ? value[i].address.city : ""),
        },
        {
          headerName: `Household State ${i + 1}`,
          field: "application.householdMembers",
          sortable: false,
          filter: false,
          width: 125,
          minWidth: 100,
          valueFormatter: ({ value }) => (value[i] ? value[i].address.state : ""),
        },
        {
          headerName: `Household Zip ${i + 1}`,
          field: "application.householdMembers",
          sortable: false,
          filter: false,
          width: 125,
          minWidth: 100,
          valueFormatter: ({ value }) => (value[i] ? value[i].address.zipCode : ""),
        }
      )
    }

    return [...defs, ...householdCols]
  }, [maxHouseholdSize])

  return (
    <Layout>
      <Head>
        <title>{t("nav.siteTitle")}</title>
      </Head>
      <MetaTags title={t("nav.siteTitle")} image={metaImage} description={metaDescription} />
      <PageHeader>{t("applications.applicationsReceived")}</PageHeader>

      <section>
        <article className="flex-row flex-wrap relative max-w-screen-xl mx-auto py-8 px-4">
          <div className="ag-theme-alpine ag-theme-bloom">
            <div className="flex justify-between">
              <div className="w-56">
                <Field name="filter-input" register={register} placeholder="Filter" />
              </div>

              <div className="flex-row">
                <Button className="mx-1" onClick={() => false}>
                  {t("applications.addApplication")}
                </Button>

                <Button className="mx-1" onClick={() => onExport()}>
                  {t("t.export")}
                </Button>
              </div>
            </div>

            <div className="applications-table mt-5">
              <AgGridReact
                gridOptions={gridOptions}
                defaultColDef={defaultColDef}
                columnDefs={columnDefs}
                rowData={applications}
                domLayout={"autoHeight"}
                headerHeight={83}
                rowHeight={58}
                suppressPaginationPanel={true}
                paginationPageSize={8}
                suppressScrollOnNewData={true}
              ></AgGridReact>

              <div className="data-pager">
                <Button
                  className="data-pager__previous data-pager__control"
                  onClick={onBtPrevious}
                  disabled={pageIndex === 1}
                >
                  {t("t.previous")}
                </Button>

                <div className="data-pager__control-group">
                  <span className="data-pager__control">
                    <span className="field-label" id="lbTotalPages">
                      {appsMeta?.totalItems}
                    </span>
                    <span className="field-label">{t("applications.totalApplications")}</span>
                  </span>

                  <span className="field data-pager__control">
                    <label className="field-label font-sans" htmlFor="page-size">
                      {t("t.show")}
                    </label>
                    <select name="page-size" id="page-size" ref={register} defaultValue={8}>
                      {pageSizeOptions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </span>

                  <span className="field data-pager__control">
                    <label className="field-label font-sans" htmlFor="page-jump">
                      {t("t.jumpTo")}
                    </label>
                    <select
                      name="page-jump"
                      id="page-jump"
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setPageIndex(parseInt(e.target.value))
                      }
                      value={pageIndex}
                    >
                      {pageJumpOptions.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </span>
                </div>

                <Button
                  className="data-pager__next data-pager__control"
                  onClick={onBtNext}
                  disabled={appsMeta?.totalPages === pageIndex}
                >
                  {t("t.next")}
                </Button>
              </div>
            </div>
          </div>
        </article>
      </section>
    </Layout>
  )
}

export default ApplicationsList
