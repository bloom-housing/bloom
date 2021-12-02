export default (req, res) => {
  res.status(200).json({
    coverage: global.__coverage__ || null,
  })
}
