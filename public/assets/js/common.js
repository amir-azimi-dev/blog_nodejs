const $ = document;
const hamburgerBtn = $.getElementById("hamburger");
const hamburgerMenu = $.querySelector(".hamburger-menu-container");
const fixedCover = $.querySelector(".fixed-cover");
const userElem = $.querySelector(".avatar-container");
const usernameElem = $.querySelector("#avatar-name");
const informationElem = $.getElementById("information");

hamburgerBtn.addEventListener("click", () => {
    hamburgerMenu.classList.toggle("active");
    fixedCover.classList.toggle("active");
});

userElem.addEventListener("click", () => informationElem.classList.toggle("active"));
usernameElem.addEventListener("click", () => informationElem.classList.toggle("active"));