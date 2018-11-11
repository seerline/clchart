'use strict'

function _makeid () {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < 20; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)) }

  return text
}
function _setMenusChecked (id, checked) {
  const dom = document.getElementById(id)
  if (dom) {
    dom.checked = checked
  }
}
function _setDomTxt (id, txt) {
  const dom = document.getElementById(id)
  if (dom) {
    dom.innerHTML = txt
  }
}
function _setMenusActive (menuId, activeDom) {
  const dom = document.getElementById(menuId)
  const menuItems = dom.getElementsByTagName('li')
  for (let i = 0; i < menuItems.length; i++) {
    const element = menuItems[i]
    element.className = element.className.replace(' active', '')
  }
  if (activeDom) {
    activeDom.className = activeDom.className + ' active'
  }
}
function ListMenus (parentId, menus, lang, activeIdx = 0, icon) {
  this.menus = menus
  this.lang = lang
  this.icon = icon
  this.parentDom = document.getElementById(parentId)
  this.labeId = _makeid()
  this.checkId = _makeid()
  this.menusId = _makeid()
  this.active = menus[activeIdx]
  this.callback = function () {}

  this.createMenus = function (callback) {
    this.callback = callback || function () {}
    const itemHtml = this.createMenuItems()
    const ele = this.active
    const dataStr = this.createDataSet(ele)
    const html = `
      <div class="menu-container">
        <label ${dataStr} class="menu-label menu-item active" for="${this.checkId}" id="${this.labeId}">
          ${this.getLabelByLanguage(ele, this.lang)}
          ${this.getIcon()}
        </label>
        <input class="menu-check" type="checkbox" name="${this.checkId}" id="${this.checkId}">
        <ul class="menus" id="${this.menusId}">
          ${itemHtml}
        </ul>
      </div>
    `
    this.parentDom.innerHTML = html
    this.addListenr()
  }

  this.getIcon = function () {
    if (this.icon) {
      return `<i class="${this.icon}"></i>`
    }
    return ''
  }

  this.createMenuItems = function () {
    let html = ''
    for (let i = 0; i < this.menus.length; i++) {
      const ele = this.menus[i]
      const dataStr = this.createDataSet(ele)
      html += `<li data-idx="${i}" ${dataStr} class="menu-item">${this.getLabelByLanguage(ele, this.lang)}</li>`
    }
    return html
  }

  this.getLabelByLanguage = function (ele, lang) {
    if (!ele) {
      return ''
    }
    if (ele[`label_${lang}`]) {
      return ele[`label_${lang}`]
    }
    return ele.label
  }

  this.createDataSet = function (ele) {
    let str = ' '
    for (const key in ele) {
      if (ele.hasOwnProperty(key)) {
        str += `data-${key}="${ele[key]}" `
      }
    }
    return str
  }

  this.setLanguage = function (lang) {
    this.lang = lang
    this.reset()
  }

  this.reset = function () {
    const items = this.parentDom.getElementsByClassName('menu-item') || []
    for (let i = 0; i < items.length; i++) {
      const ele = items[i]
      const data = ele.dataset || {}
      const label = this.getLabelByLanguage(data, this.lang)
      ele.innerHTML = label
    }
  }

  this.addListenr = function () {
    this.menuDom = document.getElementById(this.menusId)
    const self = this
    this.menuDom.addEventListener('click', function (e) {
      const activeMenuDom = e.target
      if (!activeMenuDom) {
        return
      }
      self.active = activeMenuDom.dataset
      _setMenusChecked(self.checkId, false)
      _setMenusActive(self.menusId, activeMenuDom)
      _setDomTxt(self.labeId, activeMenuDom.innerHTML)
      self.callback(self.active)
    })
  }
}
window.ListMenus = ListMenus
