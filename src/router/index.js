import { createRouter, createWebHistory } from 'vue-router'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 登录注册
    { path: '/login', component: () => import('@/views/login/LoginPage.vue') },
    // 主页面
    {
      path: '/',
      component: () => import('@/views/layout/LayoutPage.vue'),
      redirect: '/chat',
      children: [
        {
          path: '/chat',
          component: () => import('@/views/home/HomePage.vue'),
          // component: () => import('@/views/layout/LayoutPage.vue'),
          children: [
            {
              path: '/chat/chatroom',
              component: () => import('@/views/chat/ChatPage.vue')
            },
            {
              path: '/chat/friend',
              component: () => import('@/views/friend/FriendsPage.vue')
            },
            {
              path: '/chat/group',
              component: () => import('@/views/group/GroupPage.vue')
            },
            {
              path: '/chat/user',
              component: () => import('@/views/user/UserPage.vue')
            }
          ]
        },
        {
          path: '/account',
          component: () => import('@/views/account/AccountPage.vue')
        }
      ]
    }
  ]
})

export default router
