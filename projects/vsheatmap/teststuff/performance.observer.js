const perf = require("perf_hooks")

function print_PerformanceEntries() {
    // Use getEntries() to get a list of all performance entries
    var p = perf.performance.getEntries();
    for (var i = 0; i < p.length; i++) {
        console.log("PerformanceEntry[" + i + "]");
        print_PerformanceEntry(p[i]);
    }
}
function print_PerformanceEntry(perfEntry) {
    var properties = [
        "name",
        "entryType",
        "startTime",
        "duration"];

    for (var i = 0; i < properties.length; i++) {
        // Check each property
        var supported = properties[i] in perfEntry;
        if (supported) {
            var value = perfEntry[properties[i]];
            console.log("... " + properties[i] + " = " + value);
        } else {
            console.log("... " + properties[i] + " is NOT supported");
        }
    }
}


