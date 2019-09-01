import moment from 'moment-timezone'

export const formatDate = (date, timeZone, format) => {
  if (!date.isValid()) {
    return ''
  }
  return date.tz(timeZone).format(format)
}

export const parseInput = (input, timezone, fallback) => {
  if (input === '') {
    return moment('')
  }
  const date = moment(input)
  if (date.isValid()) {
    return moment.tz(date, timezone)
  }
  return moment(fallback)
}
