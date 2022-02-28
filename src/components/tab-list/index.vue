<script>
export default {
  name: 'tab-list',
  props: {
    value: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      data: this.value,
      active: 0
    }
  },
  watch: {
    value (newVal) {
      this.data = newVal
      console.log(123)
    }
  },
  methods: {
    genCard (value) {
      return <div class="card">{ value }</div>
    },
    changeTab (index) {
      this.active = index
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
    }
  }
}

</style>
