document.addEventListener("DOMContentLoaded", () => {
  const track = document.getElementById("heroTrack");
  const dots = document.querySelectorAll("#heroPagination .hero__dot");
  const sliderContainer = document.querySelector(".hero__slider");

  // Если элементов нет на странице, мягко выходим из скрипта, чтобы не плодить ошибки
  if (!track || dots.length === 0) return;

  let currentIdx = 0;
  const totalSlides = dots.length;
  let autoplayTimer = null;
  const AUTOPLAY_DELAY = 5000; // Время в миллисекундах (6 секунд)

  // Функция переключения слайда
  function updateSlider(index) {
    // Гарантированно очищаем активный класс у всех точек
    dots.forEach((dot) => dot.classList.remove("hero__dot--active"));

    // Обновляем текущий индекс
    currentIdx = index;

    // Добавляем класс активной точке
    dots[currentIdx].classList.add("hero__dot--active");

    // Двигаем ленту слайдера
    track.style.transform = `translateX(-${currentIdx * 100}%)`;
  }

  // Функция запуска автоплея
  function startAutoplay() {
    // На всякий случай очищаем старый таймер, чтобы они не дублировались
    stopAutoplay();

    autoplayTimer = setInterval(() => {
      // Магическая формула: прибавляем 1, а остаток от деления (%) на общее число слайдов
      // сбросит счетчик в 0, когда мы дойдем до конца (0 -> 1 -> 2 -> 0 -> 1...)
      const nextIdx = (currentIdx + 1) % totalSlides;
      updateSlider(nextIdx);
    }, AUTOPLAY_DELAY);
  }

  // Функция остановки автоплея
  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  // Навешиваем клики на точки
  dots.forEach((dot) => {
    dot.addEventListener("click", (e) => {
      const index = parseInt(e.currentTarget.dataset.index, 10);
      updateSlider(index);

      // КРИТИЧЕСКИ ВАЖНО: когда пользователь кликнул сам, мы сбрасываем таймер
      // и запускаем его заново. Иначе слайд переключился бы сам через мгновение
      startAutoplay();
    });
  });

  // Умная фича: если пользователь навел мышку на слайдер (например, читает текст
  // или собирается кликнуть), мы ставим автоплей на паузу. Убрал мышку — листаем дальше.
  if (sliderContainer) {
    sliderContainer.addEventListener("mouseenter", stopAutoplay);
    sliderContainer.addEventListener("mouseleave", startAutoplay);
  }

  // Явный и обязательный запуск автопрокрутки при загрузке страницы
  startAutoplay();
});
