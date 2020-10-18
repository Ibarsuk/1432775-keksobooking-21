'use strict';

(() => {
  const onFilterChange = () => {

    let filteredAds = window.load.response;

    const onTypeFilterChange = () => {
      filteredAds = filteredAds.filter((ad) => {
        if (window.map.typeFilter.value !== `any`) {
          return window.map.typeFilter.value === ad.offer.type;
        } else {
          return true;
        }
      });
    };

    const onPriceFilterChange = () => {
      filteredAds = filteredAds.filter((ad) => {
        if (window.map.priceFilter.value === `middle`) {
          return (ad.offer.price >= 10000 && ad.offer.price <= 50000);
        } else if (window.map.priceFilter.value === `low`) {
          return ad.offer.price < 10000;
        } else if (window.map.priceFilter.value === `high`) {
          return ad.offer.price > 50000;
        } else {
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

    for (let i = 0; i < filtersList.length; i++) {
      if (filtersList[i].name.value !== `any`) {
        filtersList[i].function();
      }
    }

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
})();
