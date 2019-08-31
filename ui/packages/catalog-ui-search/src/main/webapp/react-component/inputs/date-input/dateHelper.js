import user from '../../../component/singletons/user-instance'
import moment from 'moment-timezone'

export const getDateFormat = () => {
  return user
    .get('user')
    .get('preferences')
    .get('dateTimeFormat')['datetimefmt']
}

export const getTimeZone = () => {
  return user
    .get('user')
    .get('preferences')
    .get('timeZone')
}

export const formatDate = date => {
  return moment(date)
    .tz(getTimeZone())
    .format(getDateFormat())
}
