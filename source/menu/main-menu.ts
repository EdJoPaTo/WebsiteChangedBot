import {MenuTemplate} from 'telegraf-inline-menu/next-gen'

import {backButtons} from './back-buttons'
import {Context} from './context'

import {menu as addMenu} from './add'
import {menu as listMenu} from './list'

export const mainMenu = new MenuTemplate<Context>({
	text: 'Hello World!'
})

mainMenu.submenu('List', 'list', listMenu)
mainMenu.submenu('Add', 'add', addMenu)

mainMenu.manualRow(backButtons)