'use strict';

(() => {
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

  const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  };

  const getCoords = (element) => {
    const box = element.getBoundingClientRect();
    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset
    };
  };

  window.util = {
    getRandomInt,
    getCoords,
    offersTypes,
    minPrices,
    possibleFeatures
  };
})();
