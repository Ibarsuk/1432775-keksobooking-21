'use strict';

const MAIN_MOUSE_BUTTON_CODE = 0;

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

const getChildElementCoords = (child, parent) => {
  const childCoords = getCoords(child);
  const parentCoords = getCoords(parent);
  return {
    left: childCoords.left - parentCoords.left,
    top: childCoords.top - parentCoords.top
  };
};

const isMouseMainButtonClick = (evt, cb) => {
  if (evt.button === MAIN_MOUSE_BUTTON_CODE) {
    cb();
  }
};

const isKeyPressed = (evt, cb, keyName) => {
  if (evt.key === keyName) {
    cb();
  }
};

window.util = {
  getRandomInt,
  getCoords,
  getChildElementCoords,
  isMouseMainButtonClick,
  isKeyPressed,
  offersTypes,
  minPrices,
  possibleFeatures
};
