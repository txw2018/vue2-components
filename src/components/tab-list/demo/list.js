function createData (title) {
  return new Array(10).fill(title)
}
export default [
  {
    title: '拼团',
    list: createData('拼团')
  },
  {
    title: '特价',
    list: createData('特价')
  },
  {
    title: '促销',
    list: createData('促销')
  },
  {
    title: '套餐',
    list: createData('套餐')
  },
  {
    title: '满赠',
    list: createData('满赠')
  }
]
