window.addEventListener("load", init);

var sliderR = null;
var sliderG = null;
var sliderB = null;
var TextR = null;
var TextG = null;
var TextB = null;
var preview = null;

function init() {
  console.log("Inicio");
  preview = document.querySelector("#preview");
  registerEvents();
}

function registerEvents() {
  sliderR = document.querySelector("#RedSlider");
  sliderG = document.querySelector("#GreenSlider");
  sliderB = document.querySelector("#BlueSlider");
  TextR = document.querySelector("#RedText");
  TextG = document.querySelector("#GreenText");
  TextB = document.querySelector("#BlueText");

  sliderR.addEventListener("input", setColor);
  sliderG.addEventListener("input", setColor);
  sliderB.addEventListener("input", setColor);
  TextR.addEventListener("input", setTextColor);
  TextG.addEventListener("input", setTextColor);
  TextB.addEventListener("input", setTextColor);
}

function setTextColor() {
  console.log(preview.style.background);
  sliderR.value = TextR.value;
  sliderG.value = TextG.value;
  sliderB.value = TextB.value;
  preview.style.background =
    "rgb(" + sliderR.value + "," + sliderG.value + "," + sliderB.value + ")";
}

function setColor() {
  console.log(preview.style.background);
  TextR.value = sliderR.value;
  TextG.value = sliderG.value;
  TextB.value = sliderB.value;
  preview.style.background =
    "rgb(" + sliderR.value + "," + sliderG.value + "," + sliderB.value + ")";
}
