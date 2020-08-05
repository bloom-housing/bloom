// data - form data object
export function getCheckboxValues({ keys, data }: Props): any[] {
  return Object.entries(data)
    .filter((item) => keys.includes(item[0]) && item[1] === true)
    .map((item) => item[0])
}

interface Props {
  keys: string[]
  data: Record<string, any>
}
