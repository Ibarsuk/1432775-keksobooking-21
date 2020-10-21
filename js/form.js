'use strict';


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

const checkTitleValidity = () => {
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
  for (let i = 0; i < window.util.minPrices.length; i++) {
    if (typeInput.value === window.util.minPrices[i].type) {
      minPrice = window.util.minPrices[i].minPrice;
      currentType = window.util.offersTypes[window.util.minPrices[i].type];
    }
  }
  return {
    minPrices: minPrice,
    currentTypes: currentType
  };
};

const checkNightPriceValidity = () => {
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
    checkNightPriceValidity();
  }
};

const disableGuestsOptions = () => {
  for (let option of guestsInput.children) {
    option.disabled = (Number(option.value) > Number(roomsInput.value) || option.value === `0` || roomsInput.value === `100`);
  }
};

const checkGuestsNumberValidity = () => {
  disableGuestsOptions();
  if (roomsInput.value === `100` && guestsInput.value !== `0`) {
    form.querySelector(`#capacity option[value="0"]`).disabled = false;
    guestsInput.setCustomValidity(`100 комнат не для гостей`);
  } else if (roomsInput.value !== `100` && guestsInput.value === `0`) {
    guestsInput.setCustomValidity(`А для кого?`);
  } else if (roomsInput.value === `100` && guestsInput.value === `0`) {
    form.querySelector(`#capacity option[value="0"]`).disabled = false;
    guestsInput.setCustomValidity(``);
  } else if (Number(guestsInput.value) > Number(roomsInput.value)) {
    guestsInput.setCustomValidity(`${roomsInput.value} гостя максимум для ${roomsInput.value} комнат`);
  } else {
    guestsInput.setCustomValidity(``);
  }
  guestsInput.reportValidity();
};

const checkCheckoutValidity = () => {
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

const onSuccessPopupClick = (evt) => {
  if (evt.button === 0 || evt.key === `Escape`) {
    form.querySelector(`.success`).remove();
    document.body.style.overflow = `visible`;
    document.removeEventListener(`keydown`, onSuccessPopupClick);
    document.removeEventListener(`mouseup`, onSuccessPopupClick);
  }
};

window.form = {
  checkTitleValidity,
  checkNightPriceValidity,
  onNightPriceChange,
  checkGuestsNumberValidity,
  disableGuestsOptions,
  onSuccessPopupClick,
  checkCheckoutValidity,
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
  housePictureInput
};
