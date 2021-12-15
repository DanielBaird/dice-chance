
cRes = {'': 1}

dwDie = [1,2,2,3,3,4].sort()

rolls = []

const TITLE = Symbol('title')

for (let rollCount = 1; rollCount <= 4; rollCount++) {
	rolls[rollCount] = addRoll({'': 1}, dwDie, rollCount)
	rolls[rollCount][TITLE] = '' + rollCount + ' dice'
}

// cRes = addRoll(cRes, dwDie)
// cRes = addRoll(cRes, dwDie)
// cRes = addRoll(cRes, dwDie)
// cRes = addRoll(cRes, dwDie)
// cRes = rerollOne(cRes, dwDie)
// printCounts(cRes)
// printResults(cRes)
// const sss = calcSuccessChances(rolls[1])
rolls.forEach( (r, index) => {
	printSuccesses( calcSuccessChances(r) )
})

sssList = rolls.map( r => calcSuccessChances(r) )

printSuccessTable(sssList)
// --------------------------------------------------------
// --------------------------------------------------------
function addRoll(results, die, rollsToAdd=1) {

	if (rollsToAdd > 1) {
		for (let r=1; r<rollsToAdd; r++) {
			results = addRoll(results, die)
		}
	}

	newRes = {}
	for (const [roll, count] of Object.entries(results)) {
		let rollList = roll.split(',').map(r => +r)
		if (rollList.length === 1 && rollList[0] === 0) {
			rollList = []
		}
		die.forEach( (side) => {
			const newRoll = [+side, ...rollList].sort().join(',')
			if (!newRes[newRoll]) {
				newRes[newRoll] = 0
			}
			newRes[newRoll] = newRes[newRoll] + results[roll]
		})
	}
	return newRes
}
// --------------------------------------------------------
function rerollOne(results, die) {
	newRes = {}
	for (const [roll, count] of Object.entries(results)) {
		let rollList = roll.split(',').map(r => +r)
		if (rollList.length === 1 && rollList[0] === 0) {
			rollList = []
		}

		const rerollables = die.slice(0, Math.ceil(die.length/2))
		if (rerollables.includes(rollList[0])) {
			rollList.shift()
			die.forEach( (side) => {
				const newRoll = [+side, ...rollList].sort().join(',')
				if (!newRes[newRoll]) {
					newRes[newRoll] = 0
				}
				newRes[newRoll] = newRes[newRoll] + results[roll]
			})
		} else {
			die.forEach( () => {
				const newRoll = [...rollList].sort().join(',')
				if (!newRes[newRoll]) {
					newRes[newRoll] = 0
				}
				newRes[newRoll] = newRes[newRoll] + results[roll]
			})
		}
	}
	return newRes
}
// --------------------------------------------------------
function printCounts(results) {
	const aRes = Object.entries(results)
	aRes.sort((a, b) => {
		const aTotal = a[0].split(',').reduce((t, c) => t + +c, 0)
		const bTotal = b[0].split(',').reduce((t, c) => t + +c, 0)
		return aTotal - bTotal
	})
	aRes.forEach(r => {
		console.log(r[1] + ': ' + r[0])
	})
}
// --------------------------------------------------------
function printResults(results) {
	const totals = {}
	const aRes = Object.entries(results)
	aRes.forEach(r => {
		const rSum = r[0].split(',').reduce((t, c) => t + +c, 0)
		if (totals[rSum] === undefined) {
			totals[rSum] = 0
		}
		totals[rSum] += r[1]
	})
	for (const t in totals) {
		console.log(t, '|'.repeat(totals[t]))
	}
}
// --------------------------------------------------------
function calcSuccessChances(results) {
	const sss = []
	const totals = {}
	let rollCount = 0
	const aRes = Object.entries(results)
	aRes.forEach(r => {
		const rSum = r[0].split(',').reduce((t, c) => t + +c, 0)
		if (totals[rSum] === undefined) {
			totals[rSum] = 0
		}
		totals[rSum] += r[1]
		rollCount += r[1]
	})

	runningRollCount = 0

	Object.keys(totals).reverse().forEach( (r) => {
		runningRollCount += totals[r]
		const successChance = runningRollCount / rollCount
		sss[r] = successChance
	})
	if (results[TITLE]) {
		sss[TITLE] = results[TITLE]
	}
	return sss
}
// --------------------------------------------------------
function printSuccesses(sss, rollInfo="---") {
	console.log(rollInfo)
	sss.forEach( (chance, result) =>
		console.log(widen(result, 3) + ' or better: ' + widen((chance * 100).toFixed(2), 6) + ' %')
	)
}
// --------------------------------------------------------
function printSuccessTable(sssList) {
	const nCols = sssList.length
	const nRows = sssList.reduce( (rows, s) => Math.max(rows, s.length), 0 )

	sssList.sort( (s1, s2) => s1.length - s2.length )

	console.log({nRows, nCols})

	console.log(widen('', 15) + sssList.map(s => widen(s[TITLE], 13)).join(''))

	for (let r = 1; r < nRows; r++) {
		console.log([
			widen(widen(r, 3) + ' or better: ', 15),
			...(sssList.map( s => widen((s[r] * 100).toFixed(2) + ' %', 13)))
		].join(''))
	}

	// console.log(rollInfo)
	// sss.forEach( (chance, result) =>
	// 	console.log(widen(result, 3) + ' or better: ' + widen((chance * 100).toFixed(2), 6) + ' %')
	// )
}
// --------------------------------------------------------
function widen(str, width, pad=' ') {
	let result = '' + str
	while (result.length < width) {
		result = pad + result
	}
	return result
}
// --------------------------------------------------------
// --------------------------------------------------------
