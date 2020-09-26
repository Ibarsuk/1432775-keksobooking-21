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

document.querySelector(`.map`).classList.remove(`map--faded`);
renderPinsArr();
renderPins(pins);
map.appendChild(renderCardPopup(pins[0]));


