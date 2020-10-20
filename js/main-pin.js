'use strict';

(() => {
  const mainPin = window.map.pinsContainer.querySelector(`.map__pin--main`);
  const MAIN_PIN_LEFT = mainPin.style.left;
  const MAIN_PIN_TOP = mainPin.style.top;

  const setMainPinAddress = () => {
    const mainPinDiameter = mainPin.offsetWidth;
    const mainPinCoords = window.util.getChildElementCoords(mainPin, window.map.pinsContainer);
    if (window.map.map.classList.contains(`map--faded`)) {
      window.form.addressInput.value = `${Math.round(mainPinCoords.left + mainPinDiameter / 2)}, ${Math.round(mainPinCoords.top + mainPinDiameter / 2)}`;
    } else {
      window.form.addressInput.value = `${Math.round(mainPinCoords.left + mainPinDiameter / 2)}, ${Math.round(mainPinCoords.top + window.map.PIN_HEIGHT)}`;
    }
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

  const onMainPinActivate = (evt) => {
    if (evt.button === 0 || evt.key === `Enter`) {
      window.map.renderPins(window.load.response);
      window.map.map.classList.remove(`map--faded`);
      setMainPinAddress();
      window.form.disableGuestsOptions();
      window.form.form.classList.remove(`ad-form--disabled`);
      disableElements(false, window.form.fieldsets);
      window.form.titleInput.addEventListener(`input`, window.form.checkTitleValidity);
      window.form.nightPriceInput.addEventListener(`input`, window.form.checkNightPriceValidity);
      window.form.typeInput.addEventListener(`change`, window.form.onNightPriceChange);
      window.form.roomsInput.addEventListener(`change`, window.form.checkGuestsNumberValidity);
      window.form.guestsInput.addEventListener(`change`, window.form.checkGuestsNumberValidity);
      window.form.checkInAndOutFieldset.addEventListener(`change`, window.form.checkCheckoutValidity);
      window.form.userPictureInput.addEventListener(`change`, window.form.onPictureLoad);
      window.form.resetButton.addEventListener(`click`, resetForm);
      window.form.form.addEventListener(`submit`, onFormSubmit);
      window.map.filtersContainer.addEventListener(`change`, window.debounce(window.pinsFilter.onFilterChange));
      window.map.pinsContainer.addEventListener(`click`, window.map.renderAdPopup);
      mainPin.removeEventListener(`mousedown`, onMainPinActivate);
      mainPin.removeEventListener(`keydown`, onMainPinActivate);
    }
  };

  const disableElements = (logicalType, elements) => {
    for (let fieldset of elements) {
      fieldset.disabled = logicalType;
    }
    window.form.form.querySelector(`.ad-form-header`).disabled = logicalType;
  };

  const onSuccessPost = () => {
    const newSeccessPopup = window.form.successPopup.cloneNode(true);
    document.body.style.overflow = `hidden`;
    document.addEventListener(`keydown`, window.form.onSuccessPopupClick);
    document.addEventListener(`mouseup`, window.form.onSuccessPopupClick);
    window.form.form.appendChild(newSeccessPopup);
    window.form.form.reset();
    window.form.userLoadedPicture.src = `img/muffin-grey.svg`;
    mainPin.style.left = MAIN_PIN_LEFT;
    mainPin.style.top = MAIN_PIN_TOP;
    setMainPinAddress();
    window.map.deletePins();
    window.map.deleteAdpopup();
    window.map.map.classList.add(`map--faded`);
    disableElements(true, window.form.fieldsets);
    window.form.form.classList.add(`ad-form--disabled`);
    window.form.titleInput.removeEventListener(`input`, window.form.checkTitleValidity);
    window.form.nightPriceInput.removeEventListener(`input`, window.form.checkNightPriceValidity);
    window.form.typeInput.removeEventListener(`change`, window.form.onNightPriceChange);
    window.form.roomsInput.removeEventListener(`change`, window.form.checkGuestsNumberValidity);
    window.form.guestsInput.removeEventListener(`change`, window.form.checkGuestsNumberValidity);
    window.form.checkInAndOutFieldset.removeEventListener(`change`, window.form.checkCheckoutValidity);
    window.form.userPictureInput.removeEventListener(`change`, window.form.onPictureLoad);
    window.form.form.removeEventListener(`submit`, onFormSubmit);
    window.form.resetButton.removeEventListener(`click`, resetForm);
    window.map.filtersContainer.removeEventListener(`change`, window.pinsFilter.onFilterChange);
    window.map.pinsContainer.removeEventListener(`click`, window.map.renderAdPopup);
    mainPin.addEventListener(`mousedown`, onMainPinActivate);
    mainPin.addEventListener(`keydown`, onMainPinActivate);
  };

  const resetForm = (evt) => {
    evt.preventDefault();
    window.form.form.reset();
    setMainPinAddress();
  };

  const onFormSubmit = (evt) => {
    window.load.load(window.load.POST_URL, `POST`, onSuccessPost, window.map.onErrorGet, new FormData(window.form.form));
    evt.preventDefault();
  };

  setMainPinAddress();
  disableElements(true, window.form.fieldsets);
  mainPin.addEventListener(`mousedown`, onMainPinActivate);
  mainPin.addEventListener(`keydown`, onMainPinActivate);
  mainPin.addEventListener(`mousedown`, onMainPinDown);

  window.mainPin = {
    onSuccessPost,
  };
})();
