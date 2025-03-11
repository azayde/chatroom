import request from '@/utils/request'

// 获取该账号所有的群聊信息
export const getGroupListService = () => {
  return request.get('/group/list')
}

// 获取群聊中所有成员的信息
export const getGroupMemberService = (id) => {
  return request.get('/group/members', { params: { id } })
}
