class CollapseItem extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' })
    const tmp = document.getElementById('collapse-item-temp')
    const clone = tmp.content.cloneNode(true)
    let style = document.createElement('style')
    style.textContent = `
      :host {
        width: 100%;
      }
      .title {
        background: #f1f1f1;
        line-height: 35px;
      }
      .content {
        font-size: 14px
      }
    `
    shadow.appendChild(style)
    shadow.appendChild(clone)

    this.titleEle = shadow.querySelector('.title')

    this.isShow = false

    this.titleEle.addEventListener('click', () => {
      // 子组件通信到父组件
      // 如何将isShow状态通知到父组件
      // console.log(document.querySelector('my-collapse'))
      document.querySelector('my-collapse').dispatchEvent(new CustomEvent('change-name', {
        detail: {
          name: this.getAttribute('name'),
          isShow: this.isShow
        }
      }))
    })
  }

  static get observedAttributes() { // 监控属性的变化
    return ['active', 'title', 'name']
  }

  attributeChangedCallback(key, old, newVal) {
    switch (key) {
      case 'active':
        console.log(newVal, 'active')
        this.activeList = JSON.parse(newVal)
        break;
      case 'title':
        this.titleEle.innerHTML = newVal
        break;
      case 'name':
        this.name = newVal
        // console.log(this.name)
        break;
      default:
        break;
    }
    // console.log(this.activeList);
    // console.log(this.name);
    if(this.activeList && this.name) {
      this.isShow = this.activeList.includes(this.name)
      // console.log(isShow, 'isShow')
      this.shadowRoot.querySelector('.content').style.display = this.isShow ? 'block' : 'none'
    }
  }
}

export default CollapseItem