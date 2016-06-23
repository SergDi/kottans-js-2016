import test from 'ava';
import add from './index.js'

test('return 0 on empty string', t => {
  t.is(add(''), 0)
});

test('return value if value', t => {
  t.is(add('5'), 5)
});

test('return sum if string', t => {
  t.is(add('5,1'), 6)
});

test('return sum if 1\n2,3', t => {
  t.is(add('1\n2,3'), 6)
});

test('return sum if //;\n1;2', t => {
  t.is(add('//;\n1;2'), 3)
});

test('if negative number ruturn exception', t => {
  t.throws(()=>{add('-5')},"negatives not allowed")
});

test('if negative 1\n2,-3 ruturn exception', t => {
  t.throws(()=>{add('1\n2,-3')},"negatives not allowed")
});

test('if negative //;\n1;-2 ruturn exception', t => {
  t.throws(()=>{add('//;\n1;-2')},"negatives not allowed")
});


test('Numbers bigger than 1000 should be ignored', t => {
  t.is(add('2,1001'), 0)
});

test('return sum if “//[delimiter]\n"', t => {
  t.is(add('//[***]\n1***2***3'), 6)
});

test('return sum if “//[delim1][delim2]\n"', t => {
  t.is(add('//[*][%]\n1*2%3'), 6)
});
