// central place for all your dropdown / multiselect options
export interface MultiSelectFieldItem {
  value: string
  label: string
}

export const dropdownOptions = {
  householdSizes: [
    { value: "1", label: "1 person" },
    { value: "2", label: "2 people" },
    { value: "3", label: "3 people" },
    { value: "4+", label: "4+ people" },
  ] as MultiSelectFieldItem[],

  amiLevels: [
    { value: "30", label: "30% AMI" },
    { value: "50", label: "50% AMI" },
    { value: "80", label: "80% AMI" },
    { value: "100", label: "100% AMI" },
    { value: "120", label: "120% AMI" },
  ] as MultiSelectFieldItem[],

  voucherStatuses: [
    { value: "yes", label: "Has voucher" },
    { value: "no", label: "No voucher" },
  ] as MultiSelectFieldItem[],

  accessibilityTypes: [
    { value: "mobility", label: "Mobility accessible" },
    { value: "vision", label: "Vision accessible" },
    { value: "hearing", label: "Hearing accessible" },
  ] as MultiSelectFieldItem[],

  races: [
    { value: "white", label: "White" },
    { value: "black", label: "Black or African American" },
    { value: "asian", label: "Asian" },
    { value: "native", label: "Native American" },
    { value: "other", label: "Other" },
  ] as MultiSelectFieldItem[],

  ethnicities: [
    { value: "hispanic", label: "Hispanic or Latino" },
    { value: "nonhispanic", label: "Non-Hispanic/Latino" },
  ] as MultiSelectFieldItem[],

  counties: [
    { value: "alameda", label: "Alameda" },
    { value: "contra_costa", label: "Contra Costa" },
    { value: "san_francisco", label: "San Francisco" },
  ] as MultiSelectFieldItem[],

  cities: [
    { value: "oakland", label: "Oakland" },
    { value: "berkeley", label: "Berkeley" },
    { value: "san_leandro", label: "San Leandro" },
  ] as MultiSelectFieldItem[],
}
