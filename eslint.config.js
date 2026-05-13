import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      // iframe 组件必须添加 sandbox 属性
      "react/iframe-missing-sandbox": "error",
      // 禁止 jsx 中使用无用的引号
      "react/jsx-curly-brace-presence": ["error", "never"],
      // 必须使用 <></> 而不是 React.Fragment
      "react/jsx-fragments": ["error", "syntax"],
      // 数组中的 jsx 必须有 key
      "react/jsx-key": [
        "error",
        {
          checkFragmentShorthand: true,
        },
      ],
      // 禁止在 jsx 中使用像注释的字符串
      "react/jsx-no-comment-textnodes": "error",
      // 禁止出现重复的 props
      "react/jsx-no-duplicate-props": "error",
      // 禁止出现 href="javascript:void(0)"
      "react/jsx-no-script-url": "error",
      // 禁止使用未定义的组件
      "react/jsx-no-undef": "error",
      // 禁止无意义的 Fragment 组件
      "react/jsx-no-useless-fragment": "error",
      // 组件的名称必须符合 PascalCase
      "react/jsx-pascal-case": "error",
      // 修复 React 被误报为未使用的变量的问题（仅在开启 no-unused-vars 时有效，在 eslint:recommended 已启用）
      "react/jsx-uses-react": "error",
      // 修复 no-unused-vars 不检查 jsx 的问题
      "react/jsx-uses-vars": "error",
      // 禁止在使用了 dangerouslySetInnerHTML 的组件内添加 children
      "react/no-danger-with-children": "error",
      // 禁止使用已废弃的 api
      "react/no-deprecated": "error",
      // 禁止在 componentDidUpdate 里使用 setState
      "react/no-did-update-set-state": "error",
      // 禁止直接修改 this.state
      "react/no-direct-mutation-state": "error",
      // 禁止使用 findDOMNode
      "react/no-find-dom-node": "error",
      // 禁止使用 isMounted,它是已废弃的语法
      "react/no-is-mounted": "error",
      // 禁止在 jsx 中使用命名空间
      "react/no-namespace": "error",
      // 禁止在 React.PureComponent 中使用 shouldComponentUpdate
      "react/no-redundant-should-component-update": "error",
      // 禁止使用 ReactDOM.render 的返回值
      "react/no-render-return-value": "error",
      // 禁止使用字符串 ref
      "react/no-string-refs": "error",
      // 禁止在函数组件中使用 this
      "react/no-this-in-sfc": "error",
      // 禁止组件的属性或生命周期大小写错误
      "react/no-typos": "error",
      // 禁止在组件的内部存在未转义的 >, ", ' 或 }
      "react/no-unescaped-entities": "error",
      // 禁止出现 HTML 中的属性，如 class
      "react/no-unknown-property": "error",
      // 禁止使用不安全的生命周期方法 componentWillMount, componentWillReceiveProps, componentWillUpdate
      "react/no-unsafe": [
        "error",
        {
          checkAliases: true,
        },
      ],
      // 禁止在组件内使用不稳定的组件
      "react/no-unstable-nested-components": "error",
      // 必须使用 Class 的形式创建组件
      "react/prefer-es6-class": ["error", "always"],
      // render 方法中必须有返回值
      "react/require-render-return": "error",
      // 组件内方法必须按照一定规则排序
      "react/sort-comp": "error",
      // 类的静态属性必须使用 static 关键字定义
      "react/static-property-placement": "error",
      // style 属性的取值必须是 object
      "react/style-prop-object": "error",
      // img, br 标签中禁止有 children
      "react/void-dom-elements-no-children": "error",
      // 允许在 JSX 中缺少 React
      "react/react-in-jsx-scope": "off",
      // 允许将 children 作为一个 prop
      "react/no-children-prop": "off",
      // 允许组件缺少 displayName
      "react/display-name": "off",
      // 允许空函数
      "@typescript-eslint/no-empty-function": "off",
      // 允许使用 any
      "@typescript-eslint/no-explicit-any": "off",
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
])
