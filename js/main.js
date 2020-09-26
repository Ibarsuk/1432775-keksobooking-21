'use strict';

const template = document.querySelector(`#pin`).content.querySelector(`.map__pin`);
const pinsContainer = document.querySelector(`.map__pins`);
const PIN_HEIGHT = 70;
const PIN_WIDTH = 50;

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

const createAd = (user, adTitle, adPrice, adType, adRooms, adGuests, adCheckin, adCheckout, adFeaturesArr = [], adDescription, adPhotosArr = []) => {
  const ad = {};
  ad.author = {avatar: `img/avatars/user0${Number(user)}.png`};
  ad.location = {
    x: getRandomInt(0 + PIN_HEIGHT / 2, pinsContainer.offsetWidth - PIN_HEIGHT / 2),
    y: getRandomInt(130, 630),
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
  pins.push(createAd(1, `Лучший дом`, 8000, `house`, 4, 12, `12:00`, `14:00`, [`wifi`, `dishwasher`, `parking`, `washer`, `conditioner`], ``, [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`]));
  pins.push(createAd(2, `Теплый подвальчик`, 2500, `bungalow`, 1, 2, `13:00`, `14:00`, [], ``, [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`]));
  pins.push(createAd(3, `Огромные апартаменты`, 9000, `palace`, 5, 15, `12:00`, `13:00`, [`wifi`, `dishwasher`, `parking`, `washer`, `elevator`, `conditioner`], ``, [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`]));
  pins.push(createAd(4, `Небольшая комнатка`, 5700, `flat`, 1, 2, `14:00`, `14:00`, [`wifi`, `dishwasher`, `parking`], ``, []));
  pins.push(createAd(5, `Квартира в центре`, 4000, `flat`, 2, 3, `12:00`, `13:00`, [`parking`, `washer`, `conditioner`], ``, [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`, `http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`]));
  pins.push(createAd(6, `Очень дешево, ага`, 7500, `flat`, 3, 6, `13:00`, `14:00`, [`parking`, `washer`, `elevator`], ``, [`http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`]));
  pins.push(createAd(7, `Крутой вид из окна`, 4800, `flat`, 2, 4, `12:00`, `14:00`, [`wifi`, `dishwasher`], ``, [`http://o0.github.io/assets/images/tokyo/hotel2.jpg`, `http://o0.github.io/assets/images/tokyo/hotel3.jpg`]));
  pins.push(createAd(8, `Койка под потолком`, 3000, `bungalow`, 1, 1, `14:00`, `13:00`, [`wifi`, `elevator`], ``, [`http://o0.github.io/assets/images/tokyo/hotel1.jpg`]));
};

const renderPin = (index, pinsArr) => {
  const newPin = template.cloneNode(true);
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

document.querySelector(`.map`).classList.remove(`map--faded`);
renderPinsArr(8);
renderPins(pins);
