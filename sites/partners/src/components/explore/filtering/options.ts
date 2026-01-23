// central place for all your dropdown / multiselect options
export interface MultiSelectFieldItem {
  value: string
  label: string
}

export const dropdownOptions = {
  householdSizes: [
    { value: "all", label: "All household sizes" },
    { value: "1", label: "1 Person" },
    { value: "2", label: "2 People" },
    { value: "3", label: "3 People" },
    { value: "4", label: "4 People" },
    { value: "5+", label: "5+ People" },
  ] as MultiSelectFieldItem[],

  amiLevels: [
    { value: "all", label: "All AMI levels" },
    { value: "0", label: "0%" },
    { value: "20", label: "20%" },
    { value: "30", label: "30%" },
    { value: "35", label: "35%" },
    { value: "40", label: "40%" },
    { value: "45", label: "45%" },
    { value: "50", label: "50%" },
    { value: "55", label: "55%" },
    { value: "60", label: "60%" },
    { value: "70", label: "70%" },
    { value: "80", label: "80%" },
    { value: "100", label: "100%" },
  ] as MultiSelectFieldItem[],

  voucherStatuses: [
    { value: "all", label: "Any voucher status" },
    { value: "voucher", label: "Has a voucher" },
    { value: "none", label: "No voucher or subsidy" },
  ] as MultiSelectFieldItem[],

  accessibilityTypes: [
    { value: "all", label: "All accessibility types" },
    { value: "none", label: "None requested" },
    { value: "mobility", label: "Requested mobility" },
    { value: "vision", label: "Requested vision" },
    { value: "hearing", label: "Requested hearing" },
    { value: "vision-hearing", label: "Requested vision/hearing" },
    { value: "mobility-vision", label: "Requested mobility/vision" },
    { value: "mobility-hearing", label: "Requested mobility/hearing" },
  ] as MultiSelectFieldItem[],

  races: [
    { value: "all", label: "All races" },
    { value: "black", label: "Black/African American" },
    { value: "asian", label: "Asian" },
    { value: "white", label: "White" },
    { value: "pacific_islander", label: "Native Hawaiian/Other Pacific Islander" },
    { value: "native_american", label: "American Indian/Alaskan Native" },
    { value: "other", label: "Other/Multiracial" },
    { value: "no_response", label: "No Response" },
  ] as MultiSelectFieldItem[],

  ethnicities: [
    { value: "all", label: "All ethnicities" },
    { value: "hispanic", label: "Hispanic/Latino" },
    { value: "nonhispanic", label: "Not Hispanic/Latino" },
  ] as MultiSelectFieldItem[],

  counties: [
    { value: "all", label: "All counties" },
    { value: "alameda", label: "Alameda" },
    { value: "contra_costa", label: "Contra Costa" },
    { value: "marin", label: "Marin" },
    { value: "napa", label: "Napa" },
    { value: "san_francisco", label: "San Francisco" },
    { value: "san_mateo", label: "San Mateo" },
    { value: "santa_clara", label: "Santa Clara" },
    { value: "solano", label: "Solano" },
    { value: "sonoma", label: "Sonoma" },
  ] as MultiSelectFieldItem[],
}
