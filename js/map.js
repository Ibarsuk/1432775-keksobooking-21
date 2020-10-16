'use strict';

(() => {
  const PIN_HEIGHT = 70;
  const PIN_WIDTH = 50;
  const MAP_MIN_Y = 130;
  const MAP_MAX_Y = 630;
  const PINS_ON_MAP = 5;
  const templatePin = document.querySelector(`#pin`).content.querySelector(`.map__pin`);
  const pinsContainer = document.querySelector(`.map__pins`);
  const templateCardPopup = document.querySelector(`#card`).content.querySelector(`.map__card`);
  const templateErrorPopup = document.querySelector(`#error`).content.querySelector(`.error`);
  const map = document.querySelector(`.map`);
  const filtersContainer = map.querySelector(`.map__filters-container`);
  const typeFilter = filtersContainer.querySelector(`#housing-type`);

  const renderPin = (index, pinsArr) => {
    const newPin = templatePin.cloneNode(true);
    const newPinImg = newPin.querySelector(`img`);
    newPin.style = `left: ${pinsArr[index].location.x - PIN_WIDTH / 2}px; top: ${pinsArr[index].location.y - PIN_HEIGHT}px;`;
    newPinImg.src = pinsArr[index].author.avatar;
    newPinImg.alt = pinsArr[index].offer.title;
    return newPin;
  };

  const renderPins = (pinsArr) => {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < PINS_ON_MAP; i++) {
      try {
        fragment.appendChild(renderPin(i, pinsArr));
      } catch (err) {
        break;
      }
    }
    pinsContainer.appendChild(fragment);
  };

  const deletePins = () => {
    const pins = pinsContainer.querySelectorAll(`.map__pin:not(.map__pin--main)`);
    for (let pin of pins) {
      pin.remove();
    }
  };

  const deleteFeatures = (featuresArr, adFeatures, newCard) => {
    for (let i = 0; i < featuresArr.length; i++) {
      if (!adFeatures.includes(featuresArr[i], 0)) {
        newCard.querySelector(`.popup__feature--${featuresArr[i]}`).remove();
      }
    }
  };

  const insertPhotos = (newCard, photosArr) => {
    const oldImg = newCard.querySelector(`.popup__photo`);
    if (photosArr.length === 0) {
      oldImg.remove();
      return;
    }
    const templateImg = oldImg.cloneNode(true);
    oldImg.src = photosArr[0];
    const fragment = document.createDocumentFragment();
    for (let i = 1; i < photosArr.length; i++) {
      const newImg = templateImg.cloneNode(false);
      newImg.src = photosArr[i];
      fragment.appendChild(newImg);
    }
    newCard.querySelector(`.popup__photos`).appendChild(fragment);
  };

  const renderCardPopup = (ad) => {
    const newCardPopup = templateCardPopup.cloneNode(true);
    const adFeaturesArr = ad.offer.features;
    const adPhotosArr = ad.offer.photos;
    newCardPopup.querySelector(`.popup__title`).textContent = ad.offer.title;
    newCardPopup.querySelector(`.popup__text--address`).textContent = ad.offer.address;
    newCardPopup.querySelector(`.popup__text--price`).textContent = `${ad.offer.price}₽/ночь`;
    newCardPopup.querySelector(`.popup__type`).textContent = window.util.offersTypes[ad.offer.type];
    newCardPopup.querySelector(`.popup__text--capacity`).textContent = `${ad.offer.rooms} комнаты для ${ad.offer.guests} гостей`;
    newCardPopup.querySelector(`.popup__text--time`).textContent = `Заезд после ${ad.offer.checkin}, выезд до ${ad.offer.checkout}`;
    deleteFeatures(window.util.possibleFeatures, adFeaturesArr, newCardPopup);
    newCardPopup.querySelector(`.popup__description`).textContent = ad.offer.description;
    insertPhotos(newCardPopup, adPhotosArr);
    newCardPopup.querySelector(`.popup__avatar`).src = ad.author.avatar;
    return newCardPopup;
  };

  const onErrorGet = (errorMessage) => {
    const newError = templateErrorPopup.cloneNode(true);
    const tryButton = newError.querySelector(`.error__button`);
    const closeButton = document.createElement(`button`);

    const closePopup = (evt) => {
      if (evt.button === 0 || evt.key === `Escape`) {
        pinsContainer.querySelector(`.error`).remove();
        closeButton.removeEventListener(`click`, closePopup);
        document.removeEventListener(`keyup`, closePopup);
      }
    };

    const tryAgain = (evt) => {
      closePopup(evt);
      if (window.load.loadType === `GET`) {
        window.load.load(window.load.GET_URL, `GET`, window.map.renderPins, window.map.onErrorGet);
      } else {
        window.load.load(window.load.POST_URL, `POST`, window.mainPin.onSuccessPost, window.map.onErrorGet, new FormData(window.form.form));
      }
      tryButton.removeEventListener(`click`, tryAgain);
    };

    newError.querySelector(`.error__message`).textContent = errorMessage;

    tryButton.addEventListener(`click`, tryAgain);

    closeButton.classList.add(`error__button`);
    closeButton.textContent = `Закрыть`;
    closeButton.addEventListener(`click`, closePopup);
    document.addEventListener(`keyup`, closePopup);
    newError.appendChild(closeButton);

    pinsContainer.appendChild(newError);
  };

  const onSuccessGet = (response) => {
    window.load.response = response;
  };

  window.load.load(window.load.GET_URL, `GET`, onSuccessGet, onErrorGet);

  // window.map.map.appendChild(window.map.renderCardPopup(window.data.pins[0]));

  window.map = {
    renderPins,
    renderCardPopup,
    deletePins,
    map,
    pinsContainer,
    MAP_MIN_Y,
    MAP_MAX_Y,
    PIN_HEIGHT,
    PIN_WIDTH,
    typeFilter
  };
})();
