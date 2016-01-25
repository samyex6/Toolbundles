// I'll put those common functions I wrote here.

// Well this is redundant, just realised JS has Array.split()
var explode = function(delimiter, string) {
    var part = '', result = [];
    for(var i = 0; i < string.length; i++) {
        if(string[i] != delimiter) {
            part += string[i];
        } else {
            result.push(part);
            part = '';
        }
    }
    result.push(part);
    return result;
};

// Find the left most possible space and fill in the value
// For example, if we need to fill up 2 blocks with value v
// from vertical index 2 then the transition will be like:
// var a = [[[], [0     , 0, 0], [], [], []],
//          [[], [1     , 0, 0], [], [], []],
//          [[], [0 -> v, 2, 0], [], [], []],
//          [[], [0 -> v, 2, 3], [], [], []]];
// Use jQuery or change $.each to foreach
var fillMatrix = function(matrix, value, hour, day, duration, currentIndex) {
    if('undefined' === typeof matrix[hour][day][currentIndex] || !matrix[hour][day].length) {
        $.each(matrix, function(i) {
            matrix[i][day].push(i < hour || i > duration * 2 ? 0 : value);
        });
    } else {
        var counter = 1;
        $.each(matrix, function(i, row) {
            if(i <= hour) return;
            if(i >= hour + duration * 2) return false;
            counter = !row[day][currentIndex] ? counter + 1 : 0;
        });
        if(counter < duration * 2) return fillMatrix(matrix, hour, day, duration, currentIndex + 1);
        for(var j = 0; j < duration * 2; j++)
            matrix[hour + j][day][currentIndex] = value;
    }
    return matrix;
};