// import { PerformanceObserver, performance } from "perf_hooks"; 
const p = require("perf_hooks")


class Perf {
    // name: string
    // markStart: string
    // markEnd: string
    // measure: string
    constructor(name) {
        this.name = name;
        this.markStart = `${name}-start`
        this.markEnd = `${name}-end`
        this.measure = `${name}-measure`
    }
    start() {
        p.performance.mark(this.markStart)
    }
    end() {
        p.performance.mark(this.markEnd)
        p.performance.measure(this.measure, this.markStart, this.markEnd);
        // performance.clearMarks(this.markStart)
        // performance.clearMarks(this.markEnd)
    }
}

const obs = new p.PerformanceObserver((list) => {
    // let entry = list.getEntries()[0]
    // console.log(list.getEntries()[0]);
    // performance.clearMarks();
    // observer.disconnect();
    let marks = list.getEntriesByType("mark")
    let measures = list.getEntriesByType("measure")
    /**
    [
  PerformanceMark {
    name: 'dog-end',
    entryType: 'mark',
    startTime: 2029.7560000009835,
    duration: 0,
    detail: null
  }
]
[
  PerformanceMeasure {
    name: 'dog-measure',
    entryType: 'measure',
    startTime: 27.48883300088346,
    duration: 2002.2671670001,
    detail: null
  }
]
     */
    console.log(marks)
    console.log(measures)
    console.log(observer)
});
obs.observe({entryTypes: ['mark', 'measure']})

let dog = new Perf("dog")
dog.start()

setTimeout(() => {
    dog.end()
}, 2000)

// dog.start()
// setTimeout(() => {
//     dog.end()
// }, 3000)

// let dog2 = new Perf("dog2")
// dog2.start()
// setTimeout(() => {
//     dog2.end()
// }, 5000)

// dog2.start()
// setTimeout(() => {
//     dog2.end()
// }, 1000)