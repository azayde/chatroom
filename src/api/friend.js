import request from '@/utils/request'

// 获取当前账户所有好友
export const getFriendListService = () => {
  return request.get('/setting/friend/list')
}

// 同意好友申请
export const acceptApplicationService = (id) => {
  return request.put('/application/accept', id)
}

// 拒绝好友申请
export const refuseApplicationService = ({ id, refuse }) => {
  return request.put('/application/refuse', { id, refuse })
}

// 申请者删除申请
export const deleteApplicationService = (id) => {
  return request.delete('/application/delete', id)
}

// 创建申请
export const createApplicationService = (data) => {
  return request.post('/application/create', data)
}
