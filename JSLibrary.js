// I'll put those common functions I wrote here.

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
}
