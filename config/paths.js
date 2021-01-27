'use strict';
const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
];

// Resolve file paths in the same order as webpack
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find((extension) =>
    fs.existsSync(resolveFn(`${filePath}.${extension}`)),
  );

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};
// 指定link项目内
const copyProject = '../fe-tool/fig-ssr/node_modules/@kkb/demo';

// config after eject: we're in ./config/
module.exports = {
  appPath: resolveApp('.'),
  appIndexJs: resolveModule(resolveApp, 'src/index'), // 入口
  appIndexDevJs: resolveModule(resolveApp, 'src/indexDev'), // 入口
  appBuild: resolveApp('build'),
  appBuildWindow: resolveApp('build/cdn'),
  appBuildTypings: resolveApp('build/typings'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.ejs'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appTypings: resolveApp('src/typings'),
  appTsConfig: resolveApp('tsconfig.json'),
  appJsConfig: resolveApp('jsconfig.json'),
  appPackageJson: resolveApp('package.json'),
  appNodeModules: resolveApp('node_modules'),
  // link指定项目中
  linkPackageProject: resolveApp(`../${copyProject}/package.json`),
  linkDistProject: resolveApp(`../${copyProject}/build`),
};
