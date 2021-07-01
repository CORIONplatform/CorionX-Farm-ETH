import { BigNumber } from '@ethersproject/bignumber'
import Vue from 'vue'

function removeTrailingZeros(str: string): string {
  if (str === '0') return str
  if (str.slice(-1) === '0') return removeTrailingZeros(str.substr(0, str.length - 1))
  if (str.slice(-1) === '.') return str.substr(0, str.length - 1)
  return str
}
function numstrToBN(input: string, dec: number): BigNumber {
  const spl = input.split('.')
  if (spl[1]) spl[1] = spl[1].substr(0, dec)
  return BigNumber.from(spl.join('') + '000000000000000000'.substr(0, dec - (spl[1] || '').length))
}
function BNToNumstr(bn: BigNumber | string, dec: number, prec: number): string {
  const str = bn.toString()
  if (str === '0') return str
  if (isNaN(Number(str))) return 'NaN'
  if (str.length <= dec) return removeTrailingZeros(('0.' + '000000000000000000'.substr(0, dec - str.length) + str).substr(0, dec - str.length + prec + 2))
  else return removeTrailingZeros([str.substr(0, str.length - dec), str.slice(-dec)].join('.').substr(0, str.length - dec + prec + 1))
}
function fmtDate(seconds: number): string {
  return Intl.DateTimeFormat('en-GB', { hour: 'numeric', hour12: false, minute: 'numeric', month: 'short', day: 'numeric' }).format(seconds * 1000)
}
function fmtDateNumeric(seconds: number): string {
  return Intl.DateTimeFormat('ru-RU', { dateStyle: 'short', timeStyle: 'short', timeZone: 'UTC' }).format(seconds * 1000)
}
function wait(time = 3000) {
  return new Promise((resolve) => setTimeout(resolve, time))
}
Vue.prototype.$niceUtils = {
  removeTrailingZeros,
  numstrToBN,
  BNToNumstr,
  fmtDate,
  fmtDateNumeric,
  wait,
}
