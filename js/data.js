'use strict';


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

window.data = {
  createAd
};

