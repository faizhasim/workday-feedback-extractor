
const readXlsxFile = require('read-excel-file/node');

readXlsxFile(process.argv[2]).then((allRows) => {
	const [, ...rows] = allRows;
	const grouped = rows
		.map(([title, date, from, question, feedback, isConfidential]) => ({title, date: date.toISOString(), from, question, feedback, isConfidential}))
		.reduce((acc, value) => {
			const { title } = value;
			acc[title] = acc[title] ?? [];
			acc[title] = [
				value,
				...acc[title],
			]
			return acc;
		}, {})
	console.log(`data = `, grouped)
	// console.log(grouped)
})
