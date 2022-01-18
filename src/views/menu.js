const childrenRoutes = []
const pages = require.context('../components', true, /\.vue$/)
pages.keys().forEach(page => {
  if (page.includes('/demo/')) {
    const pageModule = pages(page)
    const module = (pageModule.default || pageModule)
    const path = module.__file
    const pageName = path.slice(15, -15)
    childrenRoutes.push(`/${pageName}`)
  }
})
export default {
  render () {
    return (
        <div style="height:50px;line-height:50px">
          {childrenRoutes.map((route) => {
            return <router-link tag="div" to={route}>{route.slice(1)}</router-link>
          })}
        </div>
    )
  }
}
