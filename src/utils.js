import axios from 'axios';
import urljoin from 'url-join';
import { API_URL, API_KEY } from 'react-native-dotenv'; // loaded from .env

// debounce: https://davidwalsh.name/javascript-debounce-function
export function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

async function makeAPIRequest({ method, url, data }) {
  const res = await axios({
    url: urljoin(API_URL, url),
    method: method,
    headers: {
      'x-api-key': API_KEY,
    },
    data: data
  });

  return res.data;
}

export async function sendSMSMessage(sender, receiver, content) {
  const res = await makeAPIRequest({
    method: 'post',
    url: '/send',
    data: {
      sender, receiver, content
    }
  });

  if (!res.success) {
    throw new Error(res.message);
  }

  return res.data;
}

export async function getSMSBalance(sender, receiver, content) {
  const res = await makeAPIRequest({
    method: 'get',
    url: '/balance'
  });

  console.log('got sms>', res);

  if (!res.success) {
    throw new Error(res.message);
  }

  return res.data && res.data.value;
}
