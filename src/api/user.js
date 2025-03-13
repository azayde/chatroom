import request from '@/utils/request'

// 发送邮箱验证码
export const sendEmailService = (email) => {
  return request.post('/email/send', email)
}

// 注册接口
export const userRegisterService = ({ email, password, code }) => {
  return request.post('/user/register', { email, password, code })
}

// 登录接口
export const userLoginService = ({ email, password }) => {
  return request.post('/user/login', { email, password })
}

// 删除用户
export const deleteUserService = () => {
  return request.delete('user/deleteUser')
}

// 判断该邮箱是否已注册
export const emailExist = (email) => {
  return request.get('/email/exist', email)
}

// 创建账号
export const accountRegisterServie = ({ name, gender, signature }) => {
  return request.post('/account/create', { name, gender, signature })
}

// 获取用户的所有账号
export const getAccountService = () => {
  return request.get('/account/infos/account')
}

// 获取账号的token
export const getAccountTokenService = (params) => {
  return request.get('/account/token', { params })
}

// 删除账号
export const deleteAccountService = (id) => {
  return request.delete('/account/delete', id)
}

// 更新账号信息
export const updateAccountService = ({ name, gender, signature }) => {
  return request.put('/account/update', { name, gender, signature })
}

// 更改账户头像并将其保存在服务器中
export const updateAvatarService = (file) => {
  return request.put('/file/avatar/account', file)
}
// 根据名称模糊查找账号
export const searchAccountByName = (name) => {
  return request.get('/account/infos/name', { params: { name } })
}

// 根据ID查找账号信息
export const getAccountInfoById = (id) => {
  return request.get('/account/infos/name', { params: { id } })
}
