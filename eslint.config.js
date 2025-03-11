// eslint.config.js
// import globals from 'globals'
import pluginJs from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import pluginPrettier from 'eslint-plugin-prettier' // 新增

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,vue}'] },
  {
    languageOptions: {
      globals: {
        ElMessage: 'readonly',
        ElMessageBox: 'readonly',
        ElLoading: 'readonly'
      }
    }
  },
  pluginJs.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    plugins: {
      prettier: pluginPrettier // 注册 Prettier 插件
    },
    rules: {
      'prettier/prettier': [
        'warn',
        {
          singleQuote: true, // 单引号
          semi: false, // 无分号
          printWidth: 80, // 每行宽度至多80字符
          trailingComma: 'none', // 不加对象|数组最后逗号
          endOfLine: 'auto' // 换行符号不限制（win mac 不一致）
        }
      ],
      'vue/multi-word-component-names': [
        'warn',
        {
          ignores: ['index'] // vue组件名称多单词组成（忽略index.vue）
        }
      ],
      'vue/no-setup-props-destructure': ['off'], // 关闭 props 解构的校验
      // 💡 添加未定义变量错误提示，create-vue@3.6.3 关闭，这里加上是为了支持下一个章节演示。
      'no-undef': 'error'
    }
  },
  {
    "env": {
      "browser": true
    }
  }
]
