<script>
import { getScroller, getScrollTop, setScrollTop } from '@/helpers/dom'
import { BindEventMixin } from '@/mixins/bind-event'
export default {
  name: 'tab-list',
  props: {
    value: {
      type: Array,
      default: () => ([])
    }
  },
  mixins: [
    BindEventMixin(function (bind) {
      if (!this.scroller) {
        this.scroller = getScroller(this.$el)
      }

      bind(this.scroller, 'scroll', this.onScroll)
    })
  ],
  data () {
    return {
      data: this.value,
      active: 0,
      clickIndex: 0
    }
  },
  watch: {
    value: {
      immediate: true,
      handler (newVal) {
        this.data = newVal
        this.$nextTick(() => {
          this.calculateHeight()
        })
      }
    },
    clickIndex (newVal) {
      this.active = newVal
    }
  },
  created () {
    this.listHeight = []
    this.clickStatus = false
  },
  methods: {
    genCard (value) {
      return <div class="card">{ value }</div>
    },
    changeTab (index) {
      this.clickIndex = index
      this.clickStatus = true
      this.scrollTo(index)
    },
    scrollTo (index) {
      setScrollTop(this.scroller, this.listHeight[index])
    },
    onScroll () {
      const childrenArr = [...this.$refs.listRef.children]
      const scrollTop = getScrollTop(this.scroller)
      for (let i = 0; i < childrenArr.length; i++) {
        const height1 = this.listHeight[i]
        const height2 = this.listHeight[i + 1]
        if (scrollTop >= height1 && scrollTop < height2) {
          if (this.clickStatus) {
            i = this.clickIndex
          }
          this.active = i
          break
        }
      }
    },
    calculateHeight () {
      let height = 0
      this.listHeight.push(height)
      const childrenArr = [...this.$refs.listRef.children]
      for (let i = 0; i < childrenArr.length; i++) {
        height += childrenArr[i].clientHeight
        this.listHeight.push(height)
      }
      console.log(this.listHeight)
    }
  },
  render () {
    const { data } = this
    return (
      <div class="tab-list">
        <ul class="tab">
          {data.map((item, index) => (
            <li
              onClick={() => this.changeTab(index)}
              class={{ active: this.active === index }}
              key={item.title}>
              {item.title}
            </li>
          ))}
        </ul>
        <ul class="list" ref="listRef">
          {
            data.map(item => (
              <li class="item">
                {item.list.map(value => this.genCard(value))}
              </li>
            ))
          }
        </ul>
      </div>
    )
  }
}
</script>

<style scoped lang="scss">
.tab-list{
  .tab{
    display: flex;
    justify-content: space-between;
    position: sticky;
    top: 0;
    background: #ffffff;
    box-shadow:0 2px 5px 1px rgba(0,0,0,0.5);
    li{
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20%;

    }
    .active{
      color: red;
    }
  }
  .list{
    .card{
      height: 100px;
      display: flex;
      justify-content: center;
      align-items: center;
        &:first-child{
        color: red;
      }
    }
  }
}

</style>
