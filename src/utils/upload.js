import config from '../../package.json';

export const getFileUrl = (filename) => {
  if (!filename || filename === 'null') {
    return null;
  }

  return `${config.backend.httpEndpoint}/upload/${filename}`;
};