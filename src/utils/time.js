// 最新消息时间渲染
const formatTime = (timestamp) => {
  if (!timestamp) return ''

  const date = new Date(timestamp)
  const now = new Date()

  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  if (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  ) {
    return `${hours}:${minutes}`
  }
  if (now.getDate() - date.getDate() === 1) {
    return '昨天'
  }
  const getWeekDay = (date) =>
    ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]
  const sameWeek =
    now.getFullYear() === date.getFullYear() &&
    Math.abs(now.getWeek() - date.getWeek()) === 0
  if (sameWeek) {
    return `周${getWeekDay(date)}`
  }
  return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
}
//  扩展Date原型计算周数（ISO周）
Date.prototype.getWeek = function () {
  const date = new Date(this)
  date.setHours(0, 0, 0, 0)
  date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7))
  const week1 = new Date(date.getFullYear(), 0, 4)
  return Math.round(
    ((date - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7 + 1
  )
}

export { formatTime }
