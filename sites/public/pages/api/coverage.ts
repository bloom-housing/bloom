// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalAny: any = global

export default (req, res) => {
  res.status(200).json({
    coverage: globalAny.__coverage__ || null,
  })
}
