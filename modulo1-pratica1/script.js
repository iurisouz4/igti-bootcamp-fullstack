window.addEventListener("load", init);
var preview = null;

function init() {
  preview = document.querySelector("#preview");

  Array.from(document.getElementsByClassName("slider")).forEach((slider) => {
    slider.addEventListener("input", function (event) {
      var r = document.querySelector("#RedSlider").value;
      var g = document.querySelector("#GreenSlider").value;
      var b = document.querySelector("#BlueSlider").value;
      preview.style.background = "rgb(" + r + "," + g + "," + b + ")";
      document.querySelector("#RedText").value = r;
      document.querySelector("#GreenText").value = g;
      document.querySelector("#BlueText").value = b;
    });
  });
}
