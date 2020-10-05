'use strict';

const templatePin = document.querySelector(`#pin`).content.querySelector(`.map__pin`);
const pinsContainer = document.querySelector(`.map__pins`);
const PIN_HEIGHT = 70;
const PIN_WIDTH = 50;
const MAP_MIN_Y = 130;
const MAP_MAX_Y = 630;

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

const createAd = (userId, adTitle, adPrice, adType, adRooms, adGuests, adCheckin, adCheckout, adFeaturesArr = [], adDescription, adPhotosArr = []) => {
  const ad = {};
  ad.author = {avatar: `img/avatars/user0${Number(userId)}.png`};
  ad.location = {
    x: getRandomInt(0 + PIN_WIDTH / 2, pinsContainer.offsetWidth - PIN_WIDTH / 2),
    y: getRandomInt(MAP_MIN_Y, MAP_MAX_Y),
  };
  ad.offer = {
    title: String(adTitle),
    address: String(`${ad.location.x}, ${ad.location.y}`),
    price: Number(adPrice),
    type: String(adType),
    rooms: Number(adRooms),
    guests: Number(adGuests),
    checkin: String(adCheckin),
    checkout: String(adCheckout),
    features: adFeaturesArr,
    description: String(adDescription),
    photos: adPhotosArr
  };
  return ad;
};

const pins = [];
const renderPinsArr = () => {
  pins.push(createAd(1, `Лучший дом`, 8000, `house`, 4, 12, `12:00`, `14:00`, [`wifi`, `dishwasher`, `parking`, `washer`, `conditioner`], `Описание`, [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`]));
  pins.push(createAd(2, `Теплый подвальчик`, 2500, `bungalow`, 1, 2, `13:00`, `14:00`, [], ``, [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`]));
  pins.push(createAd(3, `Огромные апартаменты`, 9000, `palace`, 5, 15, `12:00`, `13:00`, [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`], `Описание`, [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`]));
  pins.push(createAd(4, `Небольшая комнатка`, 5700, `flat`, 1, 2, `14:00`, `14:00`, [`wifi`, `dishwasher`, `parking`], `Описание`, []));
  pins.push(createAd(5, `Квартира в центре`, 4000, `flat`, 2, 3, `12:00`, `13:00`, [`parking`, `washer`, `conditioner`], ``, [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`]));
  pins.push(createAd(6, `Очень дешево, ага`, 7500, `flat`, 3, 6, `13:00`, `14:00`, [`parking`, `washer`, `elevator`], `Описание`, [`http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`]));
  pins.push(createAd(7, `Крутой вид из окна`, 4800, `flat`, 2, 4, `12:00`, `14:00`, [`wifi`, `dishwasher`], `Описание`, [`http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`]));
  pins.push(createAd(8, `Койка под потолком`, 3000, `bungalow`, 1, 1, `14:00`, `13:00`, [`wifi`, `elevator`], `Описание`, [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`]));
};

const offersTypes = {
  flat: `Квартира `,
  bungalow: `Бунгало `,
  house: `Дом `,
  palace: `Дворец `
};

const minPrices = [
  {
    type: `flat`,
    minPrice: 1000
  },
  {
    type: `bungalow`,
    minPrice: 0
  },
  {
    type: `house`,
    minPrice: 5000
  },
  {
    type: `palace`,
    minPrice: 10000
  }
];

const possibleFeatures = [
  `wifi`,
  `dishwasher`,
  `parking`,
  `washer`,
  `elevator`,
  `conditioner`
];

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
  for (let i = 0; i < pinsArr.length; i++) {
    fragment.appendChild(renderPin(i, pinsArr));
  }
  pinsContainer.appendChild(fragment);
};

const templateCardPopup = document.querySelector(`#card`).content.querySelector(`.map__card`);
const map = document.querySelector(`.map`);

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
  newCardPopup.querySelector(`.popup__type`).textContent = offersTypes[ad.offer.type];
  newCardPopup.querySelector(`.popup__text--capacity`).textContent = `${ad.offer.rooms} комнаты для ${ad.offer.guests} гостей`;
  newCardPopup.querySelector(`.popup__text--time`).textContent = `Заезд после ${ad.offer.checkin}, выезд до ${ad.offer.checkout}`;
  deleteFeatures(possibleFeatures, adFeaturesArr, newCardPopup);
  newCardPopup.querySelector(`.popup__description`).textContent = ad.offer.description;
  insertPhotos(newCardPopup, adPhotosArr);
  newCardPopup.querySelector(`.popup__avatar`).src = ad.author.avatar;
  return newCardPopup;
};

const form = document.querySelector(`.ad-form`);
const mainPin = pinsContainer.querySelector(`.map__pin--main`);
const addressInput = form.querySelector(`#address`);
const titleInput = form.querySelector(`#title`);
const nightPriceInput = form.querySelector(`#price`);
const typeInput = form.querySelector(`#type`);
const roomsInput = form.querySelector(`#room_number`);
const guestsInput = form.querySelector(`#capacity`);

const getCoords = (element) => {
  const box = element.getBoundingClientRect();
  return {
    top: box.top + pageYOffset,
    left: box.left + pageXOffset
  };
};

const setMainPinAddress = () => {
  const mainPinDiameter = mainPin.offsetWidth;
  const mainPinCoords = getCoords(mainPin);
  if (map.classList.contains(`map--faded`)) {
    addressInput.value = `${Math.round(mainPinCoords.left + mainPinDiameter / 2)}, ${Math.round(mainPinCoords.top + mainPinDiameter / 2)}`;
  } else {
    addressInput.value = `${Math.round(mainPinCoords.left + mainPinDiameter / 2)}, ${Math.round(mainPinCoords.top + PIN_HEIGHT)}`;
  }
};

const onMainPinActivate = (evt) => {
  if (evt.button === 0 || evt.key === `Enter`) {
    renderPinsArr();
    renderPins(pins);
    map.classList.remove(`map--faded`);
    setMainPinAddress();
    disableGuestsOptions();
    form.classList.remove(`ad-form--disabled`);
    disableElements(false, fieldsets);
    titleInput.addEventListener(`input`, checkTitleValidity);
    nightPriceInput.addEventListener(`input`, checkNightPriceValidity);
    typeInput.addEventListener(`change`, onNightPriceChange);
    roomsInput.addEventListener(`change`, checkGuestsNumberValidity);
    guestsInput.addEventListener(`change`, checkGuestsNumberValidity);
    mainPin.removeEventListener(`mousedown`, onMainPinActivate);
    mainPin.removeEventListener(`keydown`, onMainPinActivate);
  }
};

mainPin.addEventListener(`mousedown`, onMainPinActivate);
mainPin.addEventListener(`keydown`, onMainPinActivate);

const fieldsets = form.querySelectorAll(`.ad-form__element`);
const disableElements = (logicalType, elements) => {
  for (let fieldset of elements) {
    fieldset.disabled = logicalType;
  }
  form.querySelector(`.ad-form-header`).disabled = logicalType;
};

const checkTitleValidity = () => {
  const minLength = titleInput.minLength;
  const maxLength = titleInput.maxLength;
  const currentLength = titleInput.value.length;
  if (currentLength < minLength) {
    titleInput.setCustomValidity(`Минимум ${minLength} симв.`);
  } else if (currentLength > maxLength) {
    titleInput.setCustomValidity(`Максимум ${minLength} симв.`);
  } else {
    titleInput.setCustomValidity(``);
  }
  titleInput.reportValidity();
};

const getMinPriceAndType = () => {
  let minPrice = 0;
  let currentType = ``;
  for (let i = 0; i < minPrices.length; i++) {
    if (typeInput.value === minPrices[i].type) {
      minPrice = minPrices[i].minPrice;
      currentType = offersTypes[minPrices[i].type];
    }
  }
  return {
    minPrices: minPrice,
    currentTypes: currentType
  };
};

const checkNightPriceValidity = () => {
  const minPrice = getMinPriceAndType().minPrices;
  const currentType = getMinPriceAndType().currentTypes;
  if (Number(nightPriceInput.value) < minPrice) {
    nightPriceInput.setCustomValidity(`Минимальная цена для ${currentType} - ${minPrice}`);
  } else if (Number(nightPriceInput.value) > nightPriceInput.max) {
    nightPriceInput.setCustomValidity(`Максимальная цена - ${nightPriceInput.max}`);
  } else {
    nightPriceInput.setCustomValidity(``);
  }
  nightPriceInput.reportValidity();
};

const onNightPriceChange = () => {
  nightPriceInput.placeholder = `${getMinPriceAndType().minPrices}`;
  if (nightPriceInput.value.length > 0) {
    checkNightPriceValidity();
  }
};

const disableGuestsOptions = () => {
  for (let option of guestsInput.children) {
    option.disabled = (Number(option.value) > Number(roomsInput.value) || option.value === `0` || roomsInput.value === `100`);
  }
};

const checkGuestsNumberValidity = () => {
  disableGuestsOptions();
  if (roomsInput.value === `100` && guestsInput.value !== `0`) {
    form.querySelector(`#capacity option[value="0"]`).disabled = false;
    guestsInput.setCustomValidity(`100 комнат не для гостей`);
  } else if (roomsInput.value !== `100` && guestsInput.value === `0`) {
    guestsInput.setCustomValidity(`А для кого?`);
  } else if (roomsInput.value === `100` && guestsInput.value === `0`) {
    form.querySelector(`#capacity option[value="0"]`).disabled = false;
    guestsInput.setCustomValidity(``);
  } else if (Number(guestsInput.value) > Number(roomsInput.value)) {
    guestsInput.setCustomValidity(`${roomsInput.value} гостя максимум для ${roomsInput.value} комнат`);
  } else {
    guestsInput.setCustomValidity(``);
  }
  guestsInput.reportValidity();
};

setMainPinAddress();
disableElements(true, fieldsets);

map.appendChild(renderCardPopup(pins[0]));
