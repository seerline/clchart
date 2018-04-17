function _makeid () {
  var text = ''
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (var i = 0; i < 20; i++) { text += possible.charAt(Math.floor(Math.random() * possible.length)) }

  return text
}
function _setMenusChecked (id, checked) {
  var dom = document.getElementById(id)
  if (dom) {
    dom.checked = checked
  }
}
function _setDomTxt (id, txt) {
  var dom = document.getElementById(id)
  if (dom) {
    dom.innerHTML = txt
  }
}
function _setMenusActive (menuId, activeDom) {
  var dom = document.getElementById(menuId)
  var menuItems = dom.getElementsByTagName('li')
  for (let i = 0; i < menuItems.length; i++) {
    const element = menuItems[i]
    element.className = element.className.replace(' active', '')
  }
  if (activeDom) {
    activeDom.className = activeDom.className + ' active'
  }
}
function ListMenus (parentId, arr) {
  this.menus = arr
  this.parentDom = document.getElementById(parentId)
  this.labeId = _makeid()
  this.checkId = _makeid()
  this.menusId = _makeid()
  this.active = arr[0]
  this.callback = function () {}

  this.createMenus = function (callback) {
    this.callback = callback || function () {}
    var itemHtml = this.createMenuItems()
    var html = `
      <div class="menu-container">
        <label class="menu-label menu-item active" for="${this.checkId}" id="${this.labeId}">${this.menus[0].label}</label>
        <input class="menu-check" type="checkbox" name="${this.checkId}" id="${this.checkId}">
        <ul class="menus" id="${this.menusId}">
          ${itemHtml}
        </ul>
      </div>
    `
    this.parentDom.innerHTML = html
    this.addListenr()
  }

  this.createMenuItems = function () {
    var html = ''
    for (let i = 0; i < this.menus.length; i++) {
      const ele = this.menus[i]
      html += `<li data-type="${ele.type}" data-fc="${ele.fc}" class="menu-item">${ele.label}</li>`
    }
    return html
  }

  this.addListenr = function () {
    this.menuDom = document.getElementById(this.menusId)
    const self = this;
    this.menuDom.addEventListener('click', function (e) {
      var activeMenuDom = e.target
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
