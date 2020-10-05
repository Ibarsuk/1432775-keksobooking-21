'use strict';

(() => {
  const mainPin = window.map.pinsContainer.querySelector(`.map__pin--main`);

  const setMainPinAddress = () => {
    const mainPinDiameter = mainPin.offsetWidth;
    const mainPinCoords = window.util.getCoords(mainPin);
    if (window.map.map.classList.contains(`map--faded`)) {
      window.form.addressInput.value = `${Math.round(mainPinCoords.left + mainPinDiameter / 2)}, ${Math.round(mainPinCoords.top + mainPinDiameter / 2)}`;
    } else {
      window.form.addressInput.value = `${Math.round(mainPinCoords.left + mainPinDiameter / 2)}, ${Math.round(mainPinCoords.top + window.map.PIN_HEIGHT)}`;
    }
  };

  const onMainPinActivate = (evt) => {
    if (evt.button === 0 || evt.key === `Enter`) {
      window.data.renderPinsArr();
      window.map.renderPins(window.data.pins);
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

  setMainPinAddress();
  disableElements(true, window.form.fieldsets);
  mainPin.addEventListener(`mousedown`, onMainPinActivate);
  mainPin.addEventListener(`keydown`, onMainPinActivate);
})();
