import request from '@/utils/request'

// 上传文件  传入数据的格式multipart/form-data
export const publishFileSerivce = (data) => {
  return request.post('/file/publish', data)
}

// 删除文件（数据库和服务器中的）
export const deleteFileService = (file_id) => {
  return request.delete('/file/delete', file_id)
}

// 根据关系id查询文件
export const getFileByRelationId = (relation_id) => {
  return request.post('/file/getFiles', relation_id)
}

// 根据文件id获取文件
export const getFileByFileId = (file_id) => {
  return request.post('/file/details', file_id)
}

// 发送文件类消息 传入数据的格式multipart/form-data
export const sendFileService = (formData) => {
  return request.post('/message/file', formData)
}
// 获取当前账号pin的所有好友和群组列表
export const getChatPinListService = () => {
  return request.get('/setting/pins')
}
// 获取当前账户首页显示的好友和群组列表
export const getChatShowListService = () => {
  return request.get('/setting/shows')
}

// 获取指定关系指定时间戳之前的消息
export const getChatListByLastTime = (params) => {
  return request.get('/message/list/time', {
    params
  })
}

// 获取所有关系指定时间戳之后的信息
// export const getOfferChatListBy

// 更改消息pin状态
export const updatePinMsg = (data) => {
  return request.put('/message/update/pin', data)
}
// 更改消息置顶状态
export const updateTopMsg = (data) => {
  return request.put('/message/update/top', data)
}

// 撤回消息
export const revokeMsgService = (id) => {
  return request.put('/message/update/revoke', id)
}

// 获取指定关系的置顶消息（一条）
export const getTopMsgService = (params) => {
  return request.get('/message/info/top', { params })
}

// 获取指定关系中的pin消息
export const getPinMsgService = (params) => {
  return request.get('/message/list/pin', { params })
}
