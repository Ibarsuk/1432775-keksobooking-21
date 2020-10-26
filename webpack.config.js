const path = require("path");

module.exports = {
  entry: [
    "./js/util.js",
    "./js/debounce.js",
    "./js/form.js",
    "./js/load.js",
    "./js/map.js",
    "./js/pins-filter.js",
    "./js/main-pin.js"
  ],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "js"),
    iife: true
  },
  devtool: false
};
