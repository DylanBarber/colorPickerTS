"use strict";
// Repeat boolean for checking if a new color should be generated
var repeat = true;
// Create array for history tracking
var historyArray = [];
// Create array for favorites
var favoritesArray = [];
// prevItem for highlighting rows in historyBox when clicked
var prevItem = null;
// For the current highlighted intem in historyBox
var currentItem;
// For storage of the current color
var currentColor;
// For checking if DOM elements should be displayed or not. Displays DOM elements when first color is generated
var appRan = false;
// DOM Elements
var loading = document.getElementById("loading");
var RGBColorTitle = document.getElementById("RGBColorTitle");
var hexColorTitle = document.getElementById("hexColorTitle");
var historyTitle = document.getElementById("historyTitle");
var favoritesTitle = document.getElementById("favoritesTitle");
var historyBox = document.getElementById("historyBox");
var favoritesBox = document.getElementById("favoritesBox");
var startStopButton = document.getElementById("startStop");
var clearHistoryButton = document.getElementById("clearHistoryButton");
var addToFavoritesButton = document.getElementById("addToFavoritesButton");
var clearFavoritesButton = document.getElementById("clearFavoritesButton");
var addCurrentColorButton = document.getElementById("addCurrentColorButton");
var displayDOMOnStart = function () {
    loading.classList.add("invisible");
    historyTitle.classList.remove("invisible");
    favoritesTitle.classList.remove("invisible");
    historyBox.classList.remove("invisible");
    favoritesBox.classList.remove("invisible");
    startStopButton.classList.remove("invisible");
    clearHistoryButton.classList.remove("invisible");
    addToFavoritesButton.classList.remove("invisible");
    clearFavoritesButton.classList.remove("invisible");
    addCurrentColorButton.classList.remove("invisible");
    appRan = true;
};
// Function to obtain random number from 0-255 for RGB values
var getRandomNum = function () {
    return Math.round(Math.random() * 255);
};
var changeColorTitlesText = function (red, green, blue) {
    RGBColorTitle.textContent = "Red: " + red + ", Green: " + green + ", Blue: " + blue;
    hexColorTitle.textContent = "Hex: " + rgbToHex(red, green, blue);
};
// Function that converts RGB to hex
var rgbToHex = function (red, green, blue) {
    var convert = function (color) {
        var hex = Number(color).toString(16);
        if (hex.length < 2) {
            hex = "0" + hex;
        }
        return hex;
    };
    var hexValue = "#" + convert(red) + convert(green) + convert(blue);
    return hexValue.toUpperCase();
};
// Function that obtains the color value of a clicked item in color list
var colorItemOnClick = function (e) {
    if (prevItem) {
        prevItem.classList.remove("highlightedItem");
    }
    currentItem = e;
    var red = parseInt(currentItem.dataset.red, 10);
    var green = parseInt(currentItem.dataset.green, 10);
    var blue = parseInt(currentItem.dataset.blue, 10);
    endMainLoop();
    changeBgColor(red, green, blue);
    currentColor = { red: red, green: green, blue: blue };
    changeTitleColor(red, green, blue);
    changeColorTitlesText(red, green, blue);
    e.classList.add("highlightedItem");
    prevItem = e;
};
// Function that changes the background color (Only used for colorItemOnClick because repeat is set to false)
var changeBgColor = function (red, green, blue) {
    document.body.style.backgroundColor = "rgb(" + red + ", " + green + ", " + blue + ")";
    rgbToHex(red, green, blue);
};
// Function that ends main loop
var endMainLoop = function () {
    if (repeat === true) {
        repeat = false;
    }
};
// Changes the color title to either black or white based on the current background color (Passed in color)
var changeTitleColor = function (red, green, blue) {
    if (red * 0.299 + green * 0.587 + blue * 0.114 > 186) {
        RGBColorTitle.style.color = "#000000";
        hexColorTitle.style.color = "#000000";
        historyTitle.style.color = "#000000";
        favoritesTitle.style.color = "#000000";
    }
    else {
        RGBColorTitle.style.color = "#ffffff";
        hexColorTitle.style.color = "#ffffff";
        historyTitle.style.color = "#ffffff";
        favoritesTitle.style.color = "#ffffff";
    }
};
var foregroundTextColor = function (red, green, blue) {
    if (red * 0.299 + green * 0.587 + blue * 0.114 > 186) {
        return "#000000";
    }
    else {
        return "#ffffff";
    }
};
// Re-render functions for historyBox and favoritesBox
var renderHistory = function () {
    historyBox.innerHTML = "<ul> " + historyArray.map(function (color, index) { return "<li style=\"background-color: rgb(" + color.red + "," + color.green + "," + color.blue + "); color: " + foregroundTextColor(color.red, color.green, color.blue) + ";\" data-red=" + color.red + " data-green=" + color.green + " data-blue=" + color.blue + " id='" + index + "' onclick=colorItemOnClick(this)>Red: " + color.red + ", Green: " + color.green + ", Blue: " + color.blue; }) + " </ul>";
};
var renderFavorites = function () {
    favoritesBox.innerHTML = "<ul> " + favoritesArray.map(function (color, index) { return "<li style=\"background-color: rgb(" + color.red + "," + color.green + "," + color.blue + "); color: " + foregroundTextColor(color.red, color.green, color.blue) + ";\" data-red=" + color.red + " data-green=" + color.green + " data-blue=" + color.blue + " id='" + index + "' onclick=colorItemOnClick(this)>Red: " + color.red + ", Green: " + color.green + ", Blue: " + color.blue; }) + " </ul>";
};
// Event Listeners
// For starting / stopping the color generation loop
startStopButton.addEventListener("click", function () {
    if (!repeat) {
        repeat = !repeat;
        mainLoop();
        return;
    }
    repeat = !repeat;
});
// For clearing the history box and historyArray
clearHistoryButton.addEventListener("click", function () {
    historyBox.innerHTML = "";
    historyArray = [];
    prevItem = null;
    currentItem = null;
});
// For adding the highlighted color from history to favorites
addToFavoritesButton.addEventListener("click", function () {
    if (currentItem !== null) {
        var targetArr = currentItem.textContent.split(",");
        var red = parseInt(targetArr[0].split(" ")[1], 10);
        var green = parseInt(targetArr[1].split(" ")[2], 10);
        var blue = parseInt(targetArr[2].split(" ")[2], 10);
        favoritesArray.push({
            red: red,
            // tslint:disable-next-line: object-literal-sort-keys
            green: green,
            blue: blue
        });
        // Map over all colors in the favorites array and display them in the favoritesBox
        renderFavorites();
    }
});
// For clearing the favorites box and favoritesArray
clearFavoritesButton.addEventListener("click", function () {
    favoritesBox.innerHTML = "";
    favoritesArray = [];
});
// For adding current background color to the favoritesArray
addCurrentColorButton.addEventListener("click", function () {
    favoritesArray.push(currentColor);
    renderFavorites();
});
// Main loop that will loop over newly generated colors
var mainLoop = function () {
    setTimeout(function () {
        // call displayDOMOnStart to display DOM elements
        if (!appRan) {
            displayDOMOnStart();
        }
        if (repeat === true) {
            // Generate new color values
            var red = getRandomNum();
            var green = getRandomNum();
            var blue = getRandomNum();
            // Set background color based on generated values
            changeBgColor(red, green, blue);
            // Change the RGBColorTitle with changeTitleColor function
            changeTitleColor(red, green, blue);
            // Update the RGBColorTitle with the current background color
            changeColorTitlesText(red, green, blue);
            // Push current color to the history array
            historyArray.push({
                red: red,
                // tslint:disable-next-line: object-literal-sort-keys
                green: green,
                blue: blue
            });
            // Update currentColor with the current color
            currentColor = {
                red: red,
                // tslint:disable-next-line: object-literal-sort-keys
                green: green,
                blue: blue
            };
            // Map over all colors in the history array and display them in the historyBox
            renderHistory();
            // Map over all colors in the favorites array and display them in the favoritesBox
            renderFavorites();
            // Call mainLoop for for looping
            mainLoop();
        }
    }, 1500);
};
// Run mainLoop for the first time
mainLoop();
