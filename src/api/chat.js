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
