
const timeout = ms => promise => new Promise(((resolve, reject) => {
  setTimeout(() => {
    reject(new Error('timeout'));
  }, ms);
  promise.then(resolve, reject);
}));

const checkStatus = response => {
  const {status} = response;

  if (status >= 200 && status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  error.message = 1;
  return error;
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default async function request(url, options) {
  try {
    const response =
        await fetch(url, {...options, mode: 'cors', credentials: 'include'});

    const data = await response.text();

    return data;
  } catch (error) {
  }
}
