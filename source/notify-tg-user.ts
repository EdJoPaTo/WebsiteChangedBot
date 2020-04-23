import { Telegram, Extra } from 'telegraf'
import { Mission } from './mission'

let telegram: Telegram

export function init(tg: Telegram): void {
	telegram = tg
}

export async function notifyChange(mission: Mission, change: boolean | undefined): Promise<void> {
	if (change === false) {
		return
	}

	const user = mission.issuer.slice(2)
	let text = ''
	text += mission.type + ' changed on'
	text += '\n'
	text += mission.url

	await telegram.sendMessage(user, text)
}

export async function notifyError(mission: Mission, error: any): Promise<void> {
	console.error('MISSION ERROR', mission, error)

	const user = mission.issuer.slice(2)
	let text = ''

	text += 'Something went wrong'
	text += '\n```\n' + JSON.stringify(mission, undefined, '  ') + '\n```\n'
	text += '\n```\n' + JSON.stringify(error, undefined, '  ') + '\n```\n'

	await telegram.sendMessage(user, text, Extra.markdown() as any)
}