const perf = require("perf_hooks")

// Create a Mark

let mark1 = perf.performance.mark("mark1")

mark1.entries
setTimeout(() => {}, 2000)

let myMarks = ["mark1"]

// Get Marks


let entries = perf.performance.getEntries()

console.log("Hello World")

let a = "hello"