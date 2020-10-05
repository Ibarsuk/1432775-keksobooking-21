'use strict';

(() => {
  const createAd = (userId, adTitle, adPrice, adType, adRooms, adGuests, adCheckin, adCheckout, adFeaturesArr = [], adDescription, adPhotosArr = []) => {
    const ad = {};
    ad.author = {avatar: `img/avatars/user0${Number(userId)}.png`};
    ad.location = {
      x: window.util.getRandomInt(0 + window.map.PIN_WIDTH / 2, window.map.pinsContainer.offsetWidth - window.map.PIN_WIDTH / 2),
      y: window.util.getRandomInt(window.map.MAP_MIN_Y, window.map.MAP_MAX_Y),
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

  window.data = {
    createAd,
    renderPinsArr,
    pins
  };
})();
