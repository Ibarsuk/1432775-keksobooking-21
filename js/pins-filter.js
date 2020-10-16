'use strict';

(() => {
  const onTypeFilterChange = () => {
    const typeFiltered = window.load.response.filter((ad) => {
      if (window.map.typeFilter.value !== `any`) {
        return window.map.typeFilter.value === ad.offer.type;
      } else {
        return true;
      }
    });

    window.map.deletePins();

    window.map.renderPins(typeFiltered);
  };

  window.pinsFilter = {
    onTypeFilterChange
  };
})();
