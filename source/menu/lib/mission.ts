import {Formatter} from 'telegram-format'

import {ContentReplace} from '../../hunter'
import { Mission } from '../../mission'

export function basicInfo(format: Formatter, mission: Mission): string {
	let text = ''
	text += format.bold('Url')
	text += ': '
	text += format.escape(mission.url)
	text += '\n'

	text += format.bold('Type')
	text += ': '
	text += format.escape(mission.type)
	text += '\n'

	return text
}

export function singleReplacerLines(format: Formatter, replacer: ContentReplace): string {
	const {source, flags, replaceValue} = replacer
	const regex = '/' + source + '/' + flags
	let text = ''

	text += format.escape('- ')
	text += format.monospace(regex)
	text += '\n'

	text += '  '
	text += format.bold('Replace With')
	text += ': '
	text += format.monospace(replaceValue)
	text += '\n'

	return text
}