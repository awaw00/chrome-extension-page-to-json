import path from 'path';
import qs from 'qs';
import fs from 'fs';

const root = (_path = '.') => path.join(__dirname, '../../', _path);

/**
 * 在开发环境下调用的接口会被拦截并mock：
 * 接口mock查找的目标文件为/mock目录下，与请求接口url对应的js文件
 * 其中，url中的'/'在文件名中以'_'代替
 * 如：调用接口为'/uc/checkUserInfo'，则会查找/mock目录下的uc_checkUserInfo.js文件（大小写敏感）
 * js文件必须导出一个数据对象或一个接受两个参数的方法
 * 方法的参数1为接口请求的body对象，参数2为接口请求的query对象
 * 方法必须返回mock的数据对象
 */
export function getMockData (host, url, body) {
  const [_, path = '', search = ''] = url.match(/^\/([^\?]+)?\??(.*)?$/);

  const mockConfigPath = root('mock/index.js');
  delete require.cache[mockConfigPath];
  const mockConfig = require(mockFilePath);

  if (mockConfig.enable) {
    if (mockConfig.whiteList.indexOf(path) >= 0) {
      return getMockDataFromFile(path, body);
    }
  }

  console.log(host);
  let realApi = '';
  if (/pre-m/i.test(host)) {
    realApiRoot = `http://pre-qf-restapi.mdscj.com${url}`;
  }

  return null;
}

function getMockDataFromFile (path, body) {
  const mockFilePath = root('mock/' + path.replace(/\//g, '_') + '.js');
  console.info(`[mock]find: ${mockFilePath}`);
  const query = qs.parse(search);

  if (fs.existsSync(mockFilePath)) {
    delete require.cache[mockFilePath];
    const mock = require(mockFilePath);
    let mockRes;
    if (typeof mock === 'function') {
      mockRes = mock(body, query);
    } else {
      mockRes = mock;
    }

    console.info(`[mock]matched: ${url} -> ${mockFilePath}`);

    return mockRes;
  }

  console.info(`[mock]mismatch: ${url}`);
  return null;
}
