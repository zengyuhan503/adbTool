import { fetch, ResponseType } from '@tauri-apps/api/http';
import qs from 'qs';

const isAbsoluteURL = (url: string): boolean => {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
};

const combineURLs = (baseURL: string, relativeURL: string): string => {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};

const buildFullPath = (baseURL: string, requestedURL: string) => {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};

const buildURL = (url: string, params: any): string => {
  if (!params) {
    return url;
  }
  const serializedParams = qs.stringify(params);
  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }
  return url;
};

const server = '';
const baseURL = `${server}/api/v1`;

const BODY_TYPE = {
  Form: 'Form',
  Json: 'Json',
  Text: 'Text',
  Bytes: 'Bytes',
};

const commonOptions = {
  timeout: 60,
  responseType: ResponseType.JSON,
};

const http = (url: string, options: any = {}) => {
  const params = { ...options.params };
  if (!options.headers) options.headers = {};
  // todo 可以往 headers 中添加 token 或 cookie 等信息

  if (options?.body) {
    if (options.body.type === BODY_TYPE.Form) {
      options.headers['Content-Type'] = 'multipart/form-data';
    }
  }

  options = { ...commonOptions, ...options };

  return fetch(buildURL(buildFullPath(baseURL, url), params), options)
    .then(({ status, data }) => {
      if (status >= 200 && status < 400) {
        return { data };
      }
      return Promise.reject({ status, data });
    })
    .catch((err) => {
      console.error(err);
      return Promise.reject(err);
    });
};

export default http;
