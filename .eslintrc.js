/** @format */
Object.defineProperty(exports, '__esModule', { value: true });
const path = require('path');
const fs = require('fs');

let parserOptions = {
  project: './tsconfig.json',
};
if (!fs.existsSync(path.join(process.env.PWD || '.', './tsconfig.json'))) {
  parserOptions = {
    tsconfigRootDir: __dirname,
    project: './tsconfig.json',
    /**
     * parserOptions.createDefaultProgram
     * Default .false
     * This option allows you to request that when the setting is specified,
     * files will be allowed when not included in the projects defined by the provided files.
     * Using this option will incur significant performance costs.
     * This option is primarily included for backwards-compatibility.
     * See the project section above for more information.projecttsconfig.json
     */
    createDefaultProgram: true,
  };
}
module.exports = {
  extends: [
    'airbnb',
    'airbnb-typescript',
    'prettier',
    'prettier/react',
    'prettier/@typescript-eslint',
  ],
  plugins: ['eslint-comments', 'jest', 'unicorn', 'react-hooks'],
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true,
    jest: true,
    jasmine: true,
  },
  parserOptions: {
    ecmaVersion: 7,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      modules: true,
    },
    ...parserOptions,
  },
  rules: {
    'no-console': [1, { allow: ['warn', 'error'] }],
    'no-use-before-define': 0, // 禁止声明定义前使用
    'react/jsx-wrap-multilines': 0, // 多行JSX括在括号中
    'react/prop-types': 0, // 禁用prop-types中的规则
    'react/forbid-prop-types': 0, // 禁止某些propTypes
    'react/sort-comp': 1, // react强制执行组件方法顺序
    'react/jsx-one-expression-per-line': 0, // 每行一个JSX元素
    'generator-star-spacing': 0, // 强制 generator 函数中 * 号周围有空格
    'function-paren-newline': 0, // 强制在函数括号内使用一致的换行
    // 确保导入的模块可以解析
    'import/no-unresolved': [
      2,
      {
        ignore: ['^@/', '^@@/', '^@alipay/bigfish/'],
        caseSensitive: true, // 区分大小写
        commonjs: true,
      },
    ],
    'import/order': 'warn', // import语句的顺序执行约定
    'react/jsx-props-no-spreading': 0, // 强制任何JSX属性 通过更明确值传递，而非扩展符传递
    'react/state-in-constructor': 0, // 强制类必须有constructor
    'react/static-property-placement': 0, // 强制React组件静态属性放置位置
    // 禁止使用在package.json中没有的包
    'import/no-extraneous-dependencies': [
      2,
      {
        optionalDependencies: true,
        devDependencies: [
          '**/tests/**.{ts,js,jsx,tsx}',
          '**/_test_/**.{ts,js,jsx,tsx}',
          '/mock/**/**.{ts,js,jsx,tsx}',
          '**/**.test.{ts,js,jsx,tsx}',
          '**/_mock.{ts,js,jsx,tsx}',
          '**/example/**.{ts,js,jsx,tsx}',
          '**/examples/**.{ts,js,jsx,tsx}',
        ],
      },
    ],
    // 声明的元素必须有交互式的作用
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    // 带有单击处理可见的非交互式元素必须至少具有一个键盘侦听器
    'jsx-a11y/click-events-have-key-events': 0,
    // 静态HTML元素标签语义化，必须带有role
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/anchor-is-valid': 0, // a标签的href必须带参数
    'linebreak-style': 0, // 强制使用一致的换行符风格
    // Too restrictive, writing ugly code to defend against a very unlikely scenario: https://eslint.org/docs/rules/no-prototype-builtins
    'no-prototype-builtins': 'off', // 禁止直接使用 Object.prototypes 的内置属性
    'import/prefer-default-export': 'off', // 如果模块中只有一个导出，则最好使用默认导出而不是命名导出。
    'import/no-default-export': [0, 'camel-case'], // 禁用混合默认导出
    // Too restrictive: https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/destructuring-assignment.md
    'react/destructuring-assignment': 'off',
    'react/jsx-filename-extension': 'off', // 扩展名必须jsx
    'sort-imports': 0, // import 排序
    // Makes no sense to allow type inferrence for expression parameters, but require typing the response
    '@typescript-eslint/no-use-before-define': [
      'error',
      { functions: false, classes: true, variables: true, typedefs: true },
    ],
    // 是否不允许推断类型
    '@typescript-eslint/explicit-function-return-type': [
      'off',
      { allowTypedFunctionExpressions: true },
    ],
    '@typescript-eslint/camelcase': 0, // 驼峰规则
    '@typescript-eslint/no-var-requires': 0, // 禁止使用require语句
    // Common abbreviations are known and readable
    'unicorn/prevent-abbreviations': 'off',
    // 类属性和方法上需要显式的可访问性修饰符
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/interface-name-prefix': 0, // 强制接口名称不以I开头
    '@typescript-eslint/no-non-null-assertion': 0, // 禁止非空断言,!后缀运算符
    '@typescript-eslint/naming-convention': 0, // 强制私有成员以下划线作为前缀
    'import/no-cycle': 0, // 禁止模块导入具有自身依赖路径的模块
    'react/no-array-index-key': 'warn', // 禁止在jsx中使用数组索引当key
    'react-hooks/rules-of-hooks': 'error', // 检查 Hook 的规则
    'react/require-default-props': 0, // 对可选参数，强制声明jsx内defaultProps定义值
    'react/jsx-fragments': 0, // react组件 强制使用简写形式或标准形式
    // Conflict with prettier
    'arrow-body-style': 0, // 箭头函数主体是否必须花括号
    'arrow-parens': 0, // 箭头函数参数中需要括号
    'object-curly-newline': 0, // 对象文字或解构赋值的大括号内强制执行一致的换行符
    'implicit-arrow-linebreak': 0, // 包含隐式返回的箭头函数强制实施一致的位置
    'operator-linebreak': 0, // 使用一致的换行样式
    'eslint-comments/no-unlimited-disable': 0, // 禁止eslint-disable不带规则名称的注释
    'no-param-reassign': 2, // 禁止重新分配功能参数
    'space-before-function-paren': 0, // 要求或禁止函数圆括号之前有一个空格
    'import/extensions': 0, // 确保在导入路径中使用一致文件扩展名
  },
  settings: {
    // support import modules from TypeScript files in JavaScript files
    'import/resolver': {
      node: { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    },
    polyfills: ['fetch', 'Promise', 'URL', 'object-assign'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
};
