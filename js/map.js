'use strict';

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
const filtersContainer = map.querySelector(`.map__filters`);
const typeFilter = filtersContainer.querySelector(`#housing-type`);
const priceFilter = filtersContainer.querySelector(`#housing-price`);
const roomsFilter = filtersContainer.querySelector(`#housing-rooms`);
const guestsFilter = filtersContainer.querySelector(`#housing-guests`);
const checkboxFilterList = filtersContainer.querySelectorAll(`.map__checkbox`);

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
  pinsArr.slice(0, PINS_ON_MAP).forEach((element, i) => {
    fragment.appendChild(renderPin(i, pinsArr));
  });
  pinsContainer.appendChild(fragment);
};

const deletePins = () => {
  const pins = pinsContainer.querySelectorAll(`.map__pin:not(.map__pin--main)`);
  for (let pin of pins) {
    pin.remove();
  }
};

const deleteFeatures = (featuresArr, adFeatures, newCard) => {
  featuresArr.forEach((element) => {
    if (!adFeatures.includes(element, 0)) {
      newCard.querySelector(`.popup__feature--${element}`).remove();
    }
  });
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
  photosArr.slice(1).forEach((element) => {
    const newImg = templateImg.cloneNode(false);
    newImg.src = element;
    fragment.appendChild(newImg);
  });
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

  const closePopup = () => {
    pinsContainer.querySelector(`.error`).remove();
    closeButton.removeEventListener(`click`, onPopupCloseClick);
    document.removeEventListener(`keyup`, onPopupEscapeDown);
  };

  const onPopupEscapeDown = (evt) => {
    window.util.isKeyPressed(evt, closePopup, `Escape`);
  };

  const onPopupCloseClick = (evt) => {
    window.util.isMouseMainButtonClick(evt, closePopup);
  };

  const onReload = () => {
    closePopup();
    if (window.load.loadType === `GET`) {
      window.load.load(window.load.GET_URL, `GET`, window.map.renderPins, window.map.onErrorGet);
    } else {
      window.load.load(window.load.POST_URL, `POST`, window.mainPin.onSuccessPost, window.map.onErrorGet, new FormData(window.form.form));
    }
    tryButton.removeEventListener(`click`, onReload);
  };

  newError.querySelector(`.error__message`).textContent = errorMessage;

  tryButton.addEventListener(`click`, onReload);

  closeButton.classList.add(`error__button`);
  closeButton.textContent = `Закрыть`;
  closeButton.addEventListener(`click`, onPopupCloseClick);
  document.addEventListener(`keyup`, onPopupEscapeDown);
  newError.appendChild(closeButton);

  pinsContainer.appendChild(newError);
};

const onSuccessGet = (response) => {
  window.load.response = response;
};

const closeAdPopup = (popup) => {
  popup.removeEventListener(`click`, onAdPopupCloseClick);
  document.removeEventListener(`keyup`, onAdPopupEscapeDown);
  popup.remove();
};

const onAdPopupEscapeDown = (popup) => {
  return (evt) => {
    window.util.isKeyPressed(evt, closeAdPopup.bind(null, popup), `Escape`);
  };
};

const onAdPopupCloseClick = (popup) => {
  return (evt) => {
    window.util.isMouseMainButtonClick(evt, closeAdPopup.bind(null, popup));
  };
};

const deleteAdpopup = () => {
  if (map.querySelector(`.map__card`)) {
    map.querySelector(`.map__card`).remove();
  }
};

const onAdPopupOpen = (evt) => {
  if ((evt.target.classList.contains(`map__pin`) || evt.target.closest(`.map__pin:not(.map__pin--main)`)) && !evt.target.classList.contains(`map__pin--main`)) {
    let currentPin;
    currentPin = (evt.target.classList.contains(`map__pin`)) ? evt.target : evt.target.closest(`.map__pin:not(.map__pin--main)`);
    const ad = window.load.response.find((currentAd) => {
      return (`${currentAd.location.x - PIN_WIDTH / 2}px` === currentPin.style.left && `${currentAd.location.y - PIN_HEIGHT}px` === currentPin.style.top);
    });
    let adPopup;
    deleteAdpopup();
    map.appendChild(renderCardPopup(ad));
    adPopup = map.querySelector(`.map__card`);
    adPopup.querySelector(`.popup__close`).addEventListener(`click`, onAdPopupCloseClick(adPopup));
    document.addEventListener(`keyup`, onAdPopupEscapeDown(adPopup));
  }
};

window.load.load(window.load.GET_URL, `GET`, onSuccessGet, onErrorGet);

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
  typeFilter,
  priceFilter,
  filtersContainer,
  roomsFilter,
  guestsFilter,
  checkboxFilterList,
  onAdPopupOpen,
  deleteAdpopup
};
