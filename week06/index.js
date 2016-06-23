module.exports = function add(str) {
  var result = 0;

  function sum(arr) {
    return arr.reduce(function (sum, current) {
      var val = parseInt(current, 10);
      if (val < 0)
        throw new TypeError('negatives not allowed')
      else
        return sum + val;
    }, result);
  }

  function spliter(input, delimiters) {

    delimiters.forEach(function (el) {
      input = input.split(el).join(',');
    });

    return input.split(',')
  }

  if (str == '') return 0;

  if (str.slice(0, 2) == '//') {
    var arr = str.split('\n');
    var delimiters = arr[0].match(/[^\/\/\[|\]|\/]+/g);
    result = sum(spliter(arr[1], delimiters));
  }
  else
    result = sum(str.replace('\n', ',').split(','));

  if (result >= 1000) return 0;

  return result;
}
