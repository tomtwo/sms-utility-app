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

export async function sendSMSMessage(sender, receiver, content) {
  const res = await axios({
    url: urljoin(API_URL, 'send'),
    method: 'post',
    headers: {
      'x-api-key': API_KEY,
    },
    data: {
      sender, receiver, content
    }
  });

  console.log('got res>>', res.data);

  return res.data;
}
