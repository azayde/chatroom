import request from '@/utils/request'

// 更改给好友的备注昵称或自己在群组中的昵称
export const updateNickNameService = (data) => {
  return request.put('/setting/update/nick_name', data)
}

// 更改好友或群组的置顶状态
export const updatePinService = (data) => {
  return request.put('/setting/update/pin', data)
}

// 更改好友或群组的免打扰状态
export const updateDisturbService = (data) => {
  return request.put('/setting/update/disturb', data)
}

// 更改好友或群组的显示状态
export const updateShowService = (data) => {
  return request.put('/setting/update/show', data)
}
