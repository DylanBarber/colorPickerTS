// Repeat boolean for checking if a new color should be generated
let repeat = true;

// Create array for history tracking
let historyArray: IColorObject[] = [];

// Create array for favorites
let favoritesArray: IColorObject[] = [];

// prevItem for highlighting rows in historyBox when clicked
let prevItem: HTMLElement | null = null;

// For the current highlighted intem in historyBox
let currentItem: HTMLElement | null;

// For storage of the current color
let currentColor: IColorObject;

// Interface for current color
interface IColorObject {
  red: number;
  green: number;
  blue: number;
}

// For checking if DOM elements should be displayed or not. Displays DOM elements when first color is generated
let appRan = false;

// DOM Elements
const loading = document.getElementById("loading")!;
const RGBColorTitle = document.getElementById("RGBColorTitle")!;
const hexColorTitle = document.getElementById("hexColorTitle")!;
const historyTitle = document.getElementById("historyTitle")!;
const favoritesTitle = document.getElementById("favoritesTitle")!;
const historyBox = document.getElementById("historyBox")!;
const favoritesBox = document.getElementById("favoritesBox")!;
const startStopButton = document.getElementById("startStop")!;
const clearHistoryButton = document.getElementById("clearHistoryButton")!;
const addToFavoritesButton = document.getElementById("addToFavoritesButton")!;
const clearFavoritesButton = document.getElementById("clearFavoritesButton")!;
const addCurrentColorButton = document.getElementById("addCurrentColorButton")!;

const displayDOMOnStart = () => {
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
const getRandomNum = (): number => {
  return Math.round(Math.random() * 255);
};

const changeColorTitlesText = (red: number, green: number, blue: number): void => {
  RGBColorTitle.textContent = `Red: ${red}, Green: ${green}, Blue: ${blue}`;
  hexColorTitle.textContent = `Hex: ${rgbToHex(red, green, blue)}`;
};

// Function that converts RGB to hex
const rgbToHex = (red: number, green: number, blue: number): string => {
  const convert = (color: number): string => {
    let hex = Number(color).toString(16);
    if (hex.length < 2) {
      hex = "0" + hex;
    }
    return hex;
  };
  const hexValue = `#${convert(red)}${convert(green)}${convert(blue)}`;
  return hexValue.toUpperCase();

};

// Function that obtains the color value of a clicked item in color list
const colorItemOnClick = (e: any): void => {
  if (prevItem) {
    prevItem.classList.remove("highlightedItem");
  }
  currentItem = e;
  const red = parseInt(currentItem!.dataset.red!, 10);
  const green = parseInt(currentItem!.dataset.green!, 10);
  const blue = parseInt(currentItem!.dataset.blue!, 10);
  endMainLoop();
  changeBgColor(red, green, blue);
  currentColor = { red, green, blue };
  changeTitleColor(red, green, blue);
  changeColorTitlesText(red, green, blue);
  e.classList.add("highlightedItem");
  prevItem = e;
};

// Function that changes the background color (Only used for colorItemOnClick because repeat is set to false)
const changeBgColor = (red: number, green: number, blue: number): void => {
  document.body.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
  rgbToHex(red, green, blue);
};

// Function that ends main loop
const endMainLoop = (): void => {
  if (repeat === true) {
    repeat = false;
  }
};

// Changes the color title to either black or white based on the current background color (Passed in color)
const changeTitleColor = (red: number, green: number, blue: number): void => {
  if (red * 0.299 + green * 0.587 + blue * 0.114 > 186) {
    RGBColorTitle.style.color = "#000000";
    hexColorTitle.style.color = "#000000";
    historyTitle.style.color = "#000000";
    favoritesTitle.style.color = "#000000";
  } else {
    RGBColorTitle.style.color = "#ffffff";
    hexColorTitle.style.color = "#ffffff";
    historyTitle.style.color = "#ffffff";
    favoritesTitle.style.color = "#ffffff";
  }
};

const foregroundTextColor = (red: number, green: number, blue: number): string => {
  if (red * 0.299 + green * 0.587 + blue * 0.114 > 186) {
    return "#000000";
  } else {
    return "#ffffff";
  }
};

// Re-render functions for historyBox and favoritesBox
const renderHistory = (): void => {
  historyBox.innerHTML = `<ul> ${historyArray.map((color, index) => `<li style="background-color: rgb(${color.red},${color.green},${color.blue}); color: ${foregroundTextColor(color.red, color.green, color.blue)};" data-red=${color.red} data-green=${color.green} data-blue=${color.blue} id='${index}' onclick=colorItemOnClick(this)>Red: ${color.red}, Green: ${color.green}, Blue: ${color.blue}`)} </ul>`;
};

const renderFavorites = (): void => {
  favoritesBox.innerHTML = `<ul> ${favoritesArray.map((color, index) => `<li style="background-color: rgb(${color.red},${color.green},${color.blue}); color: ${foregroundTextColor(color.red, color.green, color.blue)};" data-red=${color.red} data-green=${color.green} data-blue=${color.blue} id='${index}' onclick=colorItemOnClick(this)>Red: ${color.red}, Green: ${color.green}, Blue: ${color.blue}`)} </ul>`;
};

// Event Listeners

// For starting / stopping the color generation loop
startStopButton.addEventListener("click", () => {
  if (!repeat) {
    repeat = !repeat;
    mainLoop();
    return;
  }
  repeat = !repeat;
});

// For clearing the history box and historyArray
clearHistoryButton.addEventListener("click", () => {
  historyBox.innerHTML = "";
  historyArray = [];
  prevItem = null;
  currentItem = null;
});

// For adding the highlighted color from history to favorites
addToFavoritesButton.addEventListener("click", () => {
  if (currentItem !== null) {
    const targetArr = currentItem.textContent!.split(",");
    const red = parseInt(targetArr[0].split(" ")[1], 10);
    const green = parseInt(targetArr[1].split(" ")[2], 10);
    const blue = parseInt(targetArr[2].split(" ")[2], 10);
    favoritesArray.push({
      red,
      // tslint:disable-next-line: object-literal-sort-keys
      green,
      blue,
    });
    // Map over all colors in the favorites array and display them in the favoritesBox
    renderFavorites();
  }
});

// For clearing the favorites box and favoritesArray
clearFavoritesButton.addEventListener("click", () => {
  favoritesBox.innerHTML = "";
  favoritesArray = [];
});

// For adding current background color to the favoritesArray
addCurrentColorButton.addEventListener("click", () => {
  favoritesArray.push(currentColor);
  renderFavorites();
});

// Main loop that will loop over newly generated colors
const mainLoop = () => {
  setTimeout(() => {
    // call displayDOMOnStart to display DOM elements
    if (!appRan) {
      displayDOMOnStart();
    }

    if (repeat === true) {
      // Generate new color values
      const red = getRandomNum();
      const green = getRandomNum();
      const blue = getRandomNum();

      // Set background color based on generated values
      changeBgColor(red, green, blue);

      // Change the RGBColorTitle with changeTitleColor function
      changeTitleColor(red, green, blue);

      // Update the RGBColorTitle with the current background color
      changeColorTitlesText(red, green, blue);

      // Push current color to the history array
      historyArray.push({
        red,
        // tslint:disable-next-line: object-literal-sort-keys
        green,
        blue,
      });

      // Update currentColor with the current color
      currentColor = {
        red,
        // tslint:disable-next-line: object-literal-sort-keys
        green,
        blue,
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
