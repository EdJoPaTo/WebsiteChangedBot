import {js as beautifyJS} from 'js-beautify'

import {cachedGot} from '../got'
import {JavaScriptMission} from '../mission'

const requiredWords = ['function', 'var', 'const']

export async function getJavaScript(entry: JavaScriptMission): Promise<string> {
	const response = await cachedGot(entry.url)
	const {body} = response
	if (!requiredWords.some(o => body.includes(o))) {
		throw new Error('The response body does not seem like JavaScript')
	}

	const beautified = beautifyJS(body, {indent_with_tabs: true, end_with_newline: true})
	return beautified
}
