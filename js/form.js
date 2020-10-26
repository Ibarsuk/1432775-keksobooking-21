'use strict';

const ROOMS_INPUT_MAX_VALUE = `100`;
const GUEST_INPUT_MIN_VALUE = `0`;
const form = document.querySelector(`.ad-form`);
const addressInput = form.querySelector(`#address`);
const titleInput = form.querySelector(`#title`);
const nightPriceInput = form.querySelector(`#price`);
const typeInput = form.querySelector(`#type`);
const roomsInput = form.querySelector(`#room_number`);
const guestsInput = form.querySelector(`#capacity`);
const checkoutInput = form.querySelector(`#timeout`);
const checkinInput = form.querySelector(`#timein`);
const userPictureInput = form.querySelector(`#avatar`);
const housePictureInput = form.querySelector(`#images`);
const fieldsets = form.querySelectorAll(`.ad-form__element`);
const checkInAndOutFieldset = document.querySelector(`.ad-form__element--time`);
const successPopup = document.querySelector(`#success`).content.querySelector(`.success`);
const resetButton = form.querySelector(`.ad-form__reset`);
const userAvatarPicture = form.querySelector(`.ad-form-header__preview img`);
const userHousePicture = form.querySelector(`.ad-form-header__preview--house-picture img`);
const main = document.querySelector(`main`);

const onTitleValidityCheck = () => {
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
  window.util.minPrices.forEach((element) => {
    if (typeInput.value === element.type) {
      minPrice = element.minPrice;
      currentType = window.util.offersTypes[element.type];
    }
  });
  return {
    minPrices: minPrice,
    currentTypes: currentType
  };
};

const onNightPriceValidityCheck = () => {
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
    onNightPriceValidityCheck();
  }
};

const disableGuestsOptions = () => {
  for (let option of guestsInput.children) {
    option.disabled = (Number(option.value) > Number(roomsInput.value) || option.value === GUEST_INPUT_MIN_VALUE || roomsInput.value === ROOMS_INPUT_MAX_VALUE);
  }
};

const onGuestsNumberValidityCheck = () => {
  disableGuestsOptions();
  if (roomsInput.value === ROOMS_INPUT_MAX_VALUE && guestsInput.value !== GUEST_INPUT_MIN_VALUE) {
    form.querySelector(`#capacity option[value="0"]`).disabled = false;
    guestsInput.setCustomValidity(`100 комнат не для гостей`);
  } else if (roomsInput.value !== ROOMS_INPUT_MAX_VALUE && guestsInput.value === GUEST_INPUT_MIN_VALUE) {
    guestsInput.setCustomValidity(`А для кого?`);
  } else if (roomsInput.value === ROOMS_INPUT_MAX_VALUE && guestsInput.value === GUEST_INPUT_MIN_VALUE) {
    form.querySelector(`#capacity option[value="0"]`).disabled = false;
    guestsInput.setCustomValidity(``);
  } else if (Number(guestsInput.value) > Number(roomsInput.value)) {
    guestsInput.setCustomValidity(`${roomsInput.value} гостя максимум для ${roomsInput.value} комнат`);
  } else {
    guestsInput.setCustomValidity(``);
  }
  guestsInput.reportValidity();
};

const onCheckoutValidityCheck = () => {
  if (checkinInput.value !== checkoutInput.value) {
    checkoutInput.setCustomValidity(`Если заезд после ${checkinInput.value}, то выезд до ${checkinInput.value}`);
  } else {
    checkoutInput.setCustomValidity(``);
  }
  checkoutInput.reportValidity();
};

const onPictureLoad = (img) => {
  const FILE_TYPES = [`gif`, `jpg`, `jpeg`, `png`];
  return function (evt) {
    const selectedFile = evt.target.files[0];

    const isRightType = FILE_TYPES.some(function (item) {
      return selectedFile.type.toLowerCase().endsWith(item);
    });

    if (isRightType) {
      const reader = new FileReader();

      reader.addEventListener(`load`, () => {
        img.src = reader.result;
      });

      reader.readAsDataURL(selectedFile);
    }
  };
};

const resetPreview = () => {
  userAvatarPicture.src = `img/muffin-grey.svg`;
  userHousePicture.src = `img/muffin-grey.svg`;
};

const deleteSuccessPopup = () => {
  main.querySelector(`.success`).remove();
  document.body.style.overflow = `visible`;
  document.removeEventListener(`keydown`, onSuccessPopupEscapeDown);
  document.removeEventListener(`mouseup`, onSuccessPopupClick);
};

const onSuccessPopupClick = (evt) => {
  window.util.isMouseMainButtonClick(evt, deleteSuccessPopup);
};

const onSuccessPopupEscapeDown = (evt) => {
  window.util.isKeyPressed(evt, deleteSuccessPopup, `Escape`);
};

window.form = {
  onTitleValidityCheck,
  onNightPriceValidityCheck,
  onNightPriceChange,
  onGuestsNumberValidityCheck,
  disableGuestsOptions,
  onSuccessPopupClick,
  onSuccessPopupEscapeDown,
  onCheckoutValidityCheck,
  onPictureLoad,
  resetPreview,
  addressInput,
  fieldsets,
  form,
  titleInput,
  nightPriceInput,
  typeInput,
  roomsInput,
  guestsInput,
  checkoutInput,
  checkinInput,
  checkInAndOutFieldset,
  successPopup,
  resetButton,
  userPictureInput,
  userAvatarPicture,
  userHousePicture,
  housePictureInput,
  main
};
