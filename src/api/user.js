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

// 获取用户的所有账号
export const getAccountService = () => {
  return request.get('/account/infos/account')
}

// 获取账号的token
export const getAccountTokenService = (params) => {
  return request.get('/account/token', { params })
}

// 删除用户
export const deleteUserService = () => {
  return request.delete('user/deleteUser')
}

// 判断该邮箱是否已注册
export const emailExist = (email) => {
  return request.get('/email/exist', email)
}
