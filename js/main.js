const burger = document.querySelector(".burger");
const nav = document.querySelector(".nav");
const body = document.body;
const dropdownLink = document.querySelector(
  ".nav__item--dropdown > .nav__link",
);

// Функция для управления состоянием меню
const toggleMenu = () => {
  const isOpening = !nav.classList.contains("nav--open");

  burger.classList.toggle("burger--active");
  nav.classList.toggle("nav--open");
  body.classList.toggle("no-scroll");

  // Если мы закрываем основное меню, то заодно закрываем и все открытые рубрики внутри
  if (!isOpening) {
    const activeDropdowns = document.querySelectorAll(".nav__item.is-active");
    activeDropdowns.forEach((item) => item.classList.remove("is-active"));
  }
};

// Событие клика на бургер
burger.addEventListener("click", (e) => {
  e.stopPropagation(); // Чтобы клик не "всплывал" к документу
  toggleMenu();
});

// Событие клика на "Рубрики"
dropdownLink.addEventListener("click", function (e) {
  // Проверяем ширину экрана (лучше использовать твой брейкпоинт)
  if (window.innerWidth <= 850) {
    e.preventDefault();
    e.stopPropagation(); // Чтобы клик не закрыл всё меню
    this.parentElement.classList.toggle("is-active");
  }
});

// Закрытие меню при клике на любую ссылку (кроме выпадашки)
// Это важно для одностраничных переходов
const navLinks = document.querySelectorAll(
  ".nav__link:not(.nav__item--dropdown > .nav__link)",
);
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (nav.classList.contains("nav--open")) {
      toggleMenu();
    }
  });
});

// Дополнительно: закрываем меню при клике вне его области (по фону)
document.addEventListener("click", (e) => {
  const isClickInsideMenu = nav.contains(e.target);
  const isClickOnBurger = burger.contains(e.target);

  if (
    nav.classList.contains("nav--open") &&
    !isClickInsideMenu &&
    !isClickOnBurger
  ) {
    toggleMenu();
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const pageLinks = document.querySelectorAll(".rubric__page-link");

  const currentPath = window.location.pathname;

  pageLinks.forEach((link) => {
    const linkPath = link.pathname;
    if (currentPath === linkPath) {
      link.classList.add("rubric__page-link--active");
    } else {
      link.classList.remove("rubric__page-link--active");
    }
  });
});
