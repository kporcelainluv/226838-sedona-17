"use strict";

var modalSent = document.querySelector(".modal-sent");
var modalSentButton = document.querySelector(".modal-sent__button");
var modalError = document.querySelector(".modal-error");
var modalErrorButton = document.querySelector(".modal-error__button");
modalSentButton.addEventListener("click", function(event) {
  modalSent.classList.add("visually-hidden");
});
modalErrorButton.addEventListener("click", function(event) {
  modalError.classList.add("visually-hidden");
});
