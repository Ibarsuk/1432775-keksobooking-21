'use strict';

const MAX_LOW_PRICE = 10000;
const MIN_HIGH_PRICE = 50000;

const onFilterChange = () => {

  let filteredAds = window.load.response;

  const onTypeFilterChange = () => {
    filteredAds = filteredAds.filter((ad) => {
      return (window.map.typeFilter.value !== `any`) ? window.map.typeFilter.value === ad.offer.type : true;
    });
  };

  const onPriceFilterChange = () => {
    filteredAds = filteredAds.filter((ad) => {
      switch (window.map.priceFilter.value) {
        case `middle`:
          return (ad.offer.price >= MAX_LOW_PRICE && ad.offer.price <= MIN_HIGH_PRICE);
        case `low`:
          return ad.offer.price < MAX_LOW_PRICE;
        case `high`:
          return ad.offer.price > MIN_HIGH_PRICE;
        default:
          return true;
      }
    });
  };

  const onRoomsFilterChange = () => {
    filteredAds = filteredAds.filter((ad) => {
      return (ad.offer.rooms === Number(window.map.roomsFilter.value));
    });
  };

  const onGuestsFilterChange = () => {
    filteredAds = filteredAds.filter((ad) => {
      return (ad.offer.guests === Number(window.map.guestsFilter.value));
    });
  };

  const checkboxFilter = (checkbox) => {
    filteredAds = filteredAds.filter((ad) => {
      return ad.offer.features.includes(checkbox.value);
    });
  };

  const filtersList = [
    {
      name: window.map.typeFilter,
      function: onTypeFilterChange
    },
    {
      name: window.map.priceFilter,
      function: onPriceFilterChange
    },
    {
      name: window.map.roomsFilter,
      function: onRoomsFilterChange
    },
    {
      name: window.map.guestsFilter,
      function: onGuestsFilterChange
    }
  ];

  filtersList.forEach((element) => {
    if (element.name.value !== `any`) {
      element.function();
    }
  });

  for (let checkbox of window.map.checkboxFilterList) {
    if (checkbox.checked) {
      checkboxFilter(checkbox);
    }
  }

  window.map.deletePins();
  window.map.renderPins(filteredAds);
};

window.pinsFilter = {
  onFilterChange
};
