import arrayReduceGroupBy from 'array-reduce-group-by'

import {runSequentiallyWithDelayInBetween} from '../async'
import {Store} from '../store'

import {Directions} from './directions'
import {getCurrent} from './get-content'
import {getDomainFromUrl, generateFilename} from './url-logic'
import {Mission, ContentReplace} from './mission'

export * from './mission'
export * from './url-logic'

export async function checkMany<TMission extends Mission>(directions: ReadonlyArray<Directions<TMission>>, delayMsBetweenSameDomain: number): Promise<void> {
	const groupedByDomain = directions
		.reduce(arrayReduceGroupBy(o => getDomainFromUrl(o.mission.url)), {})

	await Promise.all(Object.values(groupedByDomain)
		.map(async group => checkGroup(group, delayMsBetweenSameDomain))
	)
}

async function checkGroup<TMission extends Mission>(directions: ReadonlyArray<Directions<TMission>>, delayMsBetweenSameDomain: number): Promise<void> {
	await runSequentiallyWithDelayInBetween(checkOne, directions, delayMsBetweenSameDomain)
}

async function checkOne<TMission extends Mission>(directions: Directions<TMission>): Promise<void> {
	try {
		const change = await hasChanged(directions.mission, directions.store)
		await directions.notifyChange(directions.issuer, directions.mission, change)
	} catch (error: unknown) {
		await directions.notifyError(directions.issuer, directions.mission, error)
	}
}

export async function hasChanged(mission: Mission, store: Store<string>): Promise<boolean | undefined> {
	const newRaw = await getCurrent(mission)
	const newReplaced = replaceAll(newRaw, mission.contentReplace)

	const filename = generateFilename(mission.url, mission.type)
	const lastContent = await store.get(filename)

	if (lastContent !== newReplaced) {
		await store.set(filename, newReplaced)
	}

	if (lastContent === undefined) {
		return undefined
	}

	if (lastContent !== newReplaced) {
		return true
	}

	return false
}

function replaceAll(content: string, replacers?: readonly ContentReplace[]): string {
	if (!replacers) {
		return content
	}

	let current = content
	for (const {source, flags, replaceValue} of replacers) {
		const regex = new RegExp(source, flags)
		current = current.replace(regex, replaceValue)
	}

	return current
}
