export const getExpiryDateValue = (expireIn) => {
  const now = new Date();
  const newDate = now.getTime() + expireIn * 1000;
  return new Date(newDate);
};

export const setCookie = (name, value, options) => {
  const opts = {
    path: '/',
    ...options,
  };

  if (navigator.cookieEnabled) {
    const cookieName = encodeURIComponent(name);
    const cookieVal = encodeURIComponent(value);
    let cookieText = `${cookieName}=${cookieVal}`;

    if (opts.expiryIn && typeof opts.expiryIn === 'number') {
      const result = getExpiryDateValue(opts.expiryIn);
      cookieText += `; expires=${result.toUTCString()}`;
    }

    if (opts.path) {
      cookieText += `; path=${opts.path}`;
    }
    if (opts.domain) {
      cookieText += `; domain=${opts.domain}`;
    }
    if (opts.secure) {
      cookieText += '; secure';
    }

    /* eslint-disable immutable/no-mutation */
    document.cookie = cookieText;
  }
};

export const getCookie = (name) => {
  if (document.cookie !== '') {
    const cookies = document.cookie.split(/; */);

    /* eslint-disable no-restricted-syntax */
    for (const cookie of cookies) {
      const [cookieName, cookieVal] = cookie.split('=');
      if (cookieName === decodeURIComponent(name)) {
        return decodeURIComponent(cookieVal);
      }
    }
  }

  return undefined;
};

export const deleteCookie = (name, options) => {
  const opts = {
    path: '/',
    ...options,
  };

  const cookieName = encodeURIComponent(name);
  let cookieText = `${cookieName}=`;
  if (opts.path) {
    cookieText += `; path=${opts.path}`;
  }
  cookieText += '; expires=1970-01-01 00:00:00 GMT';

  /* eslint-disable immutable/no-mutation */
  document.cookie = cookieText;
};

export const isCookieExpired = (name) => {
  const now = new Date();
  const comparedDate = getCookie(name);
  if (now > comparedDate) {
    return true;
  }
  return false;
};
