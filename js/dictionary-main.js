// dictionary-main.js

// Храним текущее состояние приложения
let currentCategory = "scriptwriting";
let currentLetter = null;

// Находим нужные элементы в DOM
const categoryButtons = document.querySelectorAll(
  ".dictionary__category-button",
);
const categoryTitle = document.getElementById("current-category-title");
const letterInputs = document.querySelectorAll(
  '.letter-picker input[type="radio"]',
);
const contentContainer = document.getElementById("dictionary-content");

// Элементы для живого поиска
const searchInput = document.getElementById("dictionary-search-input");
const searchResults = document.getElementById("dictionary-search-results");

// ==========================================
// ОСНОВНАЯ ЛОГИКА ОТРИСОВКИ КОНТЕНТА
// ==========================================

function renderContent() {
  contentContainer.innerHTML = "";

  if (!currentLetter) {
    contentContainer.innerHTML = `<p class="dictionary__empty">Выберите букву для отображения терминов</p>`;
    return;
  }

  const categoryData = dictionaryData[currentCategory];
  const terms = categoryData?.terms[currentLetter] || [];

  if (terms.length === 0) {
    contentContainer.innerHTML = `
      <div class="dictionary__letter">${currentLetter}</div>
      <p class="dictionary__empty">В этой категории нет терминов на букву "${currentLetter}"</p>
    `;
    return;
  }

  let termsHTML = terms
    .map(
      (item) => `
    <li class="dictionary__item" id="term-${item.title.replace(/\s+/g, "-")}">
      <div class="dictionary__definition-title">${item.title}</div>
      <div class="dictionary__definition-subtitle">Определение</div>
      <p class="dictionary__definition-text">${item.definition}</p>
      <div class="dictionary__definition-subtitle">Польза</div>
      <p class="dictionary__definition-text">${item.benefit}</p>
      <div class="dictionary__definition-subtitle">Мини-кейс</div>
      <p class="dictionary__definition-text">${item.case}</p>
    </li>
  `,
    )
    .join("");

  contentContainer.innerHTML = `
    <div class="dictionary__letter">${currentLetter}</div>
    <ul class="dictionary__list">${termsHTML}</ul>
  `;
}

function updateCategoryUI(categoryKey) {
  categoryButtons.forEach((btn) => {
    if (btn.getAttribute("data-category") === categoryKey) {
      btn.classList.add("dictionary__category-button--active");
    } else {
      btn.classList.remove("dictionary__category-button--active");
    }
  });
  categoryTitle.textContent = dictionaryData[categoryKey].title;
}

function resetLetters() {
  letterInputs.forEach((input) => {
    input.checked = false;
  });
}

// ==========================================
// ОБРАБОТЧИКИ КЛИКОВ И ИНТЕРФЕЙСА
// ==========================================

categoryButtons.forEach((button) => {
  button.addEventListener("click", (e) => {
    currentCategory = e.target.getAttribute("data-category");
    updateCategoryUI(currentCategory);
    currentLetter = null;
    resetLetters();
    renderContent();
  });
});

letterInputs.forEach((input) => {
  input.addEventListener("change", (e) => {
    if (e.target.checked) {
      currentLetter = e.target.value;
      renderContent();
    }
  });
});

// ==========================================
// ЛОГИКА СТРОГОГО ЖИВОГО ПОИСКА (НАЧАЛО СЛОВА)
// ==========================================

searchInput.addEventListener("input", (e) => {
  const query = e.target.value.toLowerCase().trim();

  // Если инпут пустой — сбрасываем интерфейс
  if (query.length < 1) {
    searchResults.classList.add("--hidden");
    searchResults.innerHTML = "";
    currentLetter = null;
    resetLetters();
    renderContent();
    return;
  }

  const matches = [];

  Object.keys(dictionaryData).forEach((categoryKey) => {
    const categoryTerms = dictionaryData[categoryKey].terms;

    Object.keys(categoryTerms).forEach((letter) => {
      categoryTerms[letter].forEach((term) => {
        const titleLower = term.title.toLowerCase();

        // СТРОГАЯ ПРОВЕРКА: Термин должен НАЧИНАТЬСЯ на введённые буквы
        if (titleLower.startsWith(query)) {
          matches.push({
            ...term,
            category: categoryKey,
            letter: letter,
          });
        }
      });
    });
  });

  // Так как мы ищем строго с начала слова, простая алфавитная сортировка выдачи
  matches.sort((a, b) => a.title.localeCompare(b.title));

  renderSearchResults(matches.slice(0, 5));
});

function renderSearchResults(matches) {
  searchResults.innerHTML = "";

  if (matches.length === 0) {
    searchResults.innerHTML = `<li class="dictionary__search-no-results" style="padding: 10px 15px; color: #888;">Ничего не найдено</li>`;
    searchResults.classList.remove("--hidden");
    contentContainer.innerHTML = `<p class="dictionary__empty">По вашему запросу ничего не найдено</p>`;
    return;
  }

  matches.forEach((item) => {
    const li = document.createElement("li");
    li.className = "dictionary__search-item";

    const catTitle = dictionaryData[item.category].title;
    li.innerHTML = `<span class="term-name">${item.title}</span> <span class="term-cat" style="font-size: 0.85em; color: #888;">(${catTitle})</span>`;

    li.addEventListener("click", () => {
      currentCategory = item.category;
      currentLetter = item.letter;

      updateCategoryUI(currentCategory);

      letterInputs.forEach((input) => {
        input.checked = input.value === currentLetter;
      });

      renderContent();

      searchInput.value = "";
      searchResults.classList.add("--hidden");

      const targetElement = document.getElementById(
        `term-${item.title.replace(/\s+/g, "-")}`,
      );
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });

    searchResults.appendChild(li);
  });

  searchResults.classList.remove("--hidden");
}

document.addEventListener("click", (e) => {
  if (!e.target.closest(".dictionary__search")) {
    searchResults.classList.add("--hidden");
  }
});

// ==========================================
// ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
// ==========================================
resetLetters();
renderContent();
