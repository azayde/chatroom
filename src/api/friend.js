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

// 通过姓名模糊查询好友（好友姓名或昵称）
export const searchFriendByName = (params) => {
  return request.get('/setting/friend/name', { params })
}

// 删除好友（双向删除）
export const deleteFriendService = (data) => {
  return request.delete('/setting/friend/delete', data)
}

// export const deleteFriendService = (id) => {
//   return request.delete('/setting/friend/delete', {data: {relation_id: id}})
// }
