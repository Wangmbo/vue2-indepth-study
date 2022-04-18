class Collapse extends HTMLElement {
  constructor() {
    super()
    const shadow = this.attachShadow({mode: 'open'})
    const tmp1 = document.getElementById('collapse-temp')
    let clone = tmp1.content.cloneNode(true)
    let style = document.createElement('style')
    // :host 影子的根元素
    style.textContent = `
      :host {
        display: flex;
        border: 3px solid #ebebeb;
        border-radius: 4px;
        width: 100%;
      }
    `
    shadow.appendChild(style)
    shadow.appendChild(clone)
    
    let slot = shadow.querySelector('slot')
    slot.addEventListener('slotchange', (e) => {
      this.slotList =  e.target.assignedElements()
      console.log(this.slotList)
      this.render()
    })
  }
  static get observedAttributes() { // 监控属性的变化
    return ['active']
  }
  connectedCallback() {
    console.log('插入到dom时执行的回调')
  }
  // update
  attributeChangedCallback(key, oldValue, newValue) {
    if(key === 'active') {
      this.activeList = JSON.parse(newValue)
      this.render()
    }
  }
  adoptedCallback() {
    console.log('将组件移动到iframe会执行')
  }
  disconnectedCallback() {
    console.log('移除掉dom时执行的回调')
  }
  render() {
    // 插槽变化和属性变化，重新渲染
    if(this.slotList && this.activeList) {
      // console.log(this.slotList, this.activeList)
      this.slotList.forEach(child => {
        child.setAttribute('active', JSON.stringify(this.activeList))
      })
    }
  }
}

export default Collapse