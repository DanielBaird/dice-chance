
cRes = {'': 1}

dwDie = [1,2,2,3,3,4].sort()

cRes = addRoll(cRes, dwDie)
cRes = addRoll(cRes, dwDie)
cRes = rerollOne(cRes, dwDie)
// printCounts(cRes)
// printResults(cRes)
const sss = calcSuccessChances(cRes)
printSuccesses(sss)

// --------------------------------------------------------
// --------------------------------------------------------
function addRoll(results, die) {
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
	return sss
}
// --------------------------------------------------------
function printSuccesses(sss) {
	sss.forEach( (chance, result) =>
		console.log(widen(result, 3) + ' or better: ' + widen((chance * 100).toFixed(2), 6) + ' %')
	)
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
