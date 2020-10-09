'use strict';

(() => {

  const POST_URL = ``;
  const GET_URL = `https://21.javascript.pages.academy/keksobooking/data`;
  const TIMEOUT = 10000;
  const SUCCESS_STATUS = 200;

  const load = (url, requestType, onSuccessCallback, onErrorCallback, data = ``) => {
    const xhr = new XMLHttpRequest();
    xhr.responseType = `json`;
    xhr.timeout = TIMEOUT;
    xhr.open(requestType, url);
    xhr.send(data);

    xhr.addEventListener(`load`, () => {
      if (xhr.status === SUCCESS_STATUS) {
        if (data) {
          onSuccessCallback();
        } else {
          onSuccessCallback(xhr.response);
        }
      } else {
        onErrorCallback(`Ошибка. Статус ответа: ${xhr.status} ${xhr.statusText}`);
      }
    });

    xhr.addEventListener(`timeout`, () => {
      onErrorCallback(`Сервер не ответил за ${xhr.timeout} мс. Объявления не отрисовались`);
    });

    xhr.addEventListener(`error`, () => {
      onErrorCallback(`Произошла ошибка соединения`);
    });
  };

  window.load = {
    load,
    POST_URL,
    GET_URL,
  };
})();
