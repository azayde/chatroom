import request from '@/utils/request'

// 获取该账号所有的群聊信息
export const getGroupListService = () => {
  return request.get('/group/list')
}

// 获取群聊中所有成员的信息
export const getGroupMemberService = (relation_id) => {
  return request.get('/group/members', { params: { relation_id } })
}

// 创建群聊
export const createGroupService = (data) => {
  return request.post('/group/create', data)
}

// 解散群聊
export const dissolveGroupService = (relation_id) => {
  return request.post('/group/dissolve', { relation_id })
}

// 更改群聊消息(multipart/form-data)
export const updateGroupInfoService = (data) => {
  return request.post('/group/update', data)
}

// 邀请好友加入群聊
export const inviteMemberService = (data) => {
  return request.post('/group/invite', data)
}

// 退出群聊
export const quitGroupService = (relation_id) => {
  return request.post('/group/quit', { relation_id })
}

// 根据名称模糊查找本账号加入的群聊
// export const searchGroupByName = (params) => {
//   return request.get('/group/name', { params })
// }
export const searchGroupByName = (name) => {
  return request.get('/group/name', { params: { name } })
}

// 创建群通知
export const createNotifyService = (data) => {
  return request.post('/notify/create', data)
}

// 更新群通知
export const updateNotifyService = (data) => {
  return request.put('/notify/update', data)
}

// 获取群中所有的群通知
export const getAllNotifyService = (relation_id) => {
  return request.get('/notify/get', { params: { relation_id } })
}

// 删除群通知
export const deleteNotifyService = ({ id, relation_id }) => {
  return request.delete('/notify/delete', { data: { id, relation_id } })
}
