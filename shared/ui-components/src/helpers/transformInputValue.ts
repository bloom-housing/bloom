const transformInputValue = {
  onChange: (e: React.ChangeEvent<HTMLInputElement>): number => {
    const output = parseInt(e.target.value, 10)
    return isNaN(output) ? 0 : output
  },
  value: (val: any) => (isNaN(val) ? "" : val.toString()),
}

export { transformInputValue as default, transformInputValue }
