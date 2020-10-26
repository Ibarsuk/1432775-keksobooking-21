'use strict';

const mainPin = window.map.pinsContainer.querySelector(`.map__pin--main`);
const MAIN_PIN_LEFT = mainPin.style.left;
const MAIN_PIN_TOP = mainPin.style.top;

const setMainPinAddress = () => {
  const mainPinDiameter = mainPin.offsetWidth;
  const mainPinCoords = window.util.getChildElementCoords(mainPin, window.map.pinsContainer);
  window.form.addressInput.value = (window.map.map.classList.contains(`map--faded`)) ? `${Math.round(mainPinCoords.left + mainPinDiameter / 2)}, ${Math.round(mainPinCoords.top + mainPinDiameter / 2)}` : `${Math.round(mainPinCoords.left + mainPinDiameter / 2)}, ${Math.round(mainPinCoords.top + window.map.PIN_HEIGHT)}`;
};

const onMainPinDown = (downEvt) => {

  let isMouseOutside = false;
  let outsideDirection = ``;

  let startCoords = {
    x: downEvt.clientX,
    y: downEvt.clientY
  };

  const onMouseMove = (moveEvt) => {

    const shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    const mouseCoords = {
      x: moveEvt.pageX - window.util.getCoords(window.map.pinsContainer).left,
      y: moveEvt.pageY - window.util.getCoords(window.map.pinsContainer).top
    };

    const nextStepCoords = {
      x: mainPin.offsetLeft - shift.x,
      y: mainPin.offsetTop - shift.y
    };

    if (mouseCoords.y < window.map.MAP_MIN_Y - mainPin.offsetWidth || mouseCoords.y > window.map.MAP_MAX_Y + mainPin.offsetWidth || mouseCoords.x < 0 || mouseCoords.x > window.map.pinsContainer.offsetWidth) {
      isMouseOutside = true;
    }

    if (mouseCoords.y < window.map.MAP_MIN_Y - mainPin.offsetWidth) {
      outsideDirection = `top`;
      return;
    } else if (mouseCoords.y > window.map.MAP_MAX_Y + mainPin.offsetWidth) {
      outsideDirection = `bottom`;
      return;
    } else if (mouseCoords.x < 0 || mouseCoords.x > window.map.pinsContainer.offsetWidth) {
      outsideDirection = `left`;
      return;
    }

    if (isMouseOutside && mouseCoords.x > 0 && mouseCoords.x < window.map.pinsContainer.offsetWidth && outsideDirection === `top`) {
      mainPin.style.left = `${mouseCoords.x - mainPin.offsetWidth / 2}px`;
      mainPin.style.top = `${mouseCoords.y}px`;
      isMouseOutside = false;
      return;
    } else if (isMouseOutside && mouseCoords.x > 0 && mouseCoords.x < window.map.pinsContainer.offsetWidth && outsideDirection === `bottom`) {
      mainPin.style.left = `${mouseCoords.x - mainPin.offsetWidth / 2}px`;
      mainPin.style.top = `${mouseCoords.y - mainPin.offsetHeight}px`;
      isMouseOutside = false;
      return;
    } else if (isMouseOutside && mouseCoords.y > window.map.MAP_MIN_Y - mainPin.offsetWidth && mouseCoords.y < window.map.MAP_MAX_Y + mainPin.offsetWidth && outsideDirection === `left`) {
      mainPin.style.left = `${mouseCoords.x - mainPin.offsetWidth / 2}px`;
      mainPin.style.top = `${mouseCoords.y - mainPin.offsetHeight / 2}px`;
      isMouseOutside = false;
      return;
    }

    if (nextStepCoords.x > window.map.pinsContainer.offsetWidth - mainPin.offsetWidth / 2 ||
        nextStepCoords.x < 0 - mainPin.offsetWidth / 2 ||
        nextStepCoords.y > window.map.MAP_MAX_Y ||
        nextStepCoords.y < window.map.MAP_MIN_Y - window.map.PIN_HEIGHT) {
      return;
    } else {
      mainPin.style.left = `${nextStepCoords.x}px`;
      mainPin.style.top = `${nextStepCoords.y}px`;
    }

    setMainPinAddress();
  };

  const onMouseUp = () => {
    document.removeEventListener(`mousemove`, onMouseMove);
    document.removeEventListener(`mouseup`, onMouseUp);
  };

  document.addEventListener(`mousemove`, onMouseMove);
  document.addEventListener(`mouseup`, onMouseUp);
};

const activatePage = () => {
  window.map.renderPins(window.load.response);
  window.map.map.classList.remove(`map--faded`);
  setMainPinAddress();
  window.form.disableGuestsOptions();
  window.form.form.classList.remove(`ad-form--disabled`);
  disableElements(false, window.form.fieldsets);
  window.form.titleInput.addEventListener(`input`, window.form.onTitleValidityCheck);
  window.form.nightPriceInput.addEventListener(`input`, window.form.onNightPriceValidityCheck);
  window.form.typeInput.addEventListener(`change`, window.form.onNightPriceChange);
  window.form.roomsInput.addEventListener(`change`, window.form.onGuestsNumberValidityCheck);
  window.form.guestsInput.addEventListener(`change`, window.form.onGuestsNumberValidityCheck);
  window.form.checkInAndOutFieldset.addEventListener(`change`, window.form.onCheckoutValidityCheck);
  window.form.userPictureInput.addEventListener(`change`, window.form.onPictureLoad(window.form.userAvatarPicture));
  window.form.housePictureInput.addEventListener(`change`, window.form.onPictureLoad(window.form.userHousePicture));
  window.form.resetButton.addEventListener(`click`, onPageReset);
  window.form.form.addEventListener(`submit`, onFormSubmit);
  window.map.filtersContainer.addEventListener(`change`, window.debounce(window.pinsFilter.onFilterChange));
  window.map.pinsContainer.addEventListener(`click`, window.map.onAdPopupOpen);
  mainPin.removeEventListener(`mousedown`, onMainPinClick);
  mainPin.removeEventListener(`keydown`, onMainPinEnterdown);
};

const onMainPinClick = (evt) => {
  window.util.isMouseMainButtonClick(evt, activatePage);
};

const onMainPinEnterdown = (evt) => {
  window.util.isKeyPressed(evt, activatePage, `Enter`);
};

const disableElements = (logicalType, elements) => {
  for (let fieldset of elements) {
    fieldset.disabled = logicalType;
  }
  window.form.form.querySelector(`.ad-form-header`).disabled = logicalType;
};

const onPageReset = () => {
  window.form.form.reset();
  window.map.filtersContainer.reset();
  window.form.resetPreview();
  mainPin.style.left = MAIN_PIN_LEFT;
  mainPin.style.top = MAIN_PIN_TOP;
  setMainPinAddress();
  window.map.deletePins();
  window.map.deleteAdpopup();
  window.map.map.classList.add(`map--faded`);
  disableElements(true, window.form.fieldsets);
  window.form.form.classList.add(`ad-form--disabled`);
  window.form.titleInput.removeEventListener(`input`, window.form.onTitleValidityСheck);
  window.form.nightPriceInput.removeEventListener(`input`, window.form.onNightPriceValidityСheck);
  window.form.typeInput.removeEventListener(`change`, window.form.onNightPriceChange);
  window.form.roomsInput.removeEventListener(`change`, window.form.onGuestsNumberValidityСheck);
  window.form.guestsInput.removeEventListener(`change`, window.form.onGuestsNumberValidityСheck);
  window.form.checkInAndOutFieldset.removeEventListener(`change`, window.form.onCheckoutValidityСheck);
  window.form.userPictureInput.removeEventListener(`change`, window.form.onPictureLoad);
  window.form.form.removeEventListener(`submit`, onFormSubmit);
  window.form.resetButton.removeEventListener(`click`, onPageReset);
  window.map.filtersContainer.removeEventListener(`change`, window.pinsFilter.onFilterChange);
  window.map.pinsContainer.removeEventListener(`click`, window.map.onAdPopupOpen);
  mainPin.addEventListener(`mousedown`, onMainPinClick);
  mainPin.addEventListener(`keydown`, onMainPinEnterdown);
};

const onSuccessPost = () => {
  const newSeccessPopup = window.form.successPopup.cloneNode(true);
  document.body.style.overflow = `hidden`;
  document.addEventListener(`keydown`, window.form.onSuccessPopupEscapeDown);
  document.addEventListener(`mouseup`, window.form.onSuccessPopupClick);
  window.form.main.appendChild(newSeccessPopup);
  onPageReset();
};

const onFormSubmit = (evt) => {
  window.load.load(window.load.POST_URL, `POST`, onSuccessPost, window.map.onErrorGet, new FormData(window.form.form));
  evt.preventDefault();
};

setMainPinAddress();
disableElements(true, window.form.fieldsets);
mainPin.addEventListener(`mousedown`, onMainPinClick);
mainPin.addEventListener(`keydown`, onMainPinEnterdown);
mainPin.addEventListener(`mousedown`, onMainPinDown);

window.mainPin = {
  onSuccessPost,
};
