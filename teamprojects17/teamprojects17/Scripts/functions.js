function getRanges() {
    var ranges = $("input[name='week-range']").val();
    ranges = ranges.split(",");
    var finalRanges = [];
    for (var i = 0; i < ranges.length; i++) {
        finalRanges.push(ranges[i].split(" - "));
    }
    return finalRanges;
}