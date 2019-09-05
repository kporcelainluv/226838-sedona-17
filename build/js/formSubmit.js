"use strict";

var submitFormBtn = document.querySelector(".form-feedback__submit-btn");
var modalSubmitted = document.querySelector(".modal-sent");
var formInput = document.querySelector(".form-feedback__input--contact");
var modalErrored = document.querySelector(".modal-error");
submitFormBtn.addEventListener("click", function(e) {
  e.preventDefault();

  if (formInput.value.length > 0) {
    modalSubmitted.classList.remove("visually-hidden");
  } else {
    modalErrored.classList.remove("visually-hidden");
  }
});
