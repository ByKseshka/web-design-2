import { Dashboard }          from './js/Dashboard.js';
import { ProfileWidget }      from './js/ProfileWidget.js';
import { MapWinrateWidget }   from './js/MapWinrateWidget.js';
import { CryptoWidget }       from './js/CryptoWidget.js';
import { WeatherWidget }      from './js/WeatherWidget.js';
import { ToDoWidget }         from './js/ToDoWidget.js';
import { QuoteWidget }        from './js/QuoteWidget.js';

// 1. Дашборд
const dashboard = new Dashboard('#dashboard');

// 2. Регистрация типов
dashboard
  .registerType('profile', (cfg) => new ProfileWidget(cfg))
  .registerType('maps',    (cfg) => new MapWinrateWidget(cfg))
  .registerType('crypto',  (cfg) => new CryptoWidget(cfg))
  .registerType('weather', (cfg) => new WeatherWidget(cfg))
  .registerType('todo',    (cfg) => new ToDoWidget(cfg))
  .registerType('quote',   (cfg) => new QuoteWidget(cfg));

// 3. === Меню «Добавить виджет» ===
const addToggle = document.getElementById('add-toggle');
const addList   = document.getElementById('add-list');

function openMenu()  {
  addList.hidden = false;
  addToggle.setAttribute('aria-expanded', 'true');
}
function closeMenu() {
  addList.hidden = true;
  addToggle.setAttribute('aria-expanded', 'false');
}
function toggleMenu() {
  addList.hidden ? openMenu() : closeMenu();
}

addToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleMenu();
});

// Закрытие по клику вне меню
document.addEventListener('click', (e) => {
  if (!addList.hidden && !e.target.closest('.add-menu')) {
    closeMenu();
  }
});

// Закрытие по Esc
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !addList.hidden) closeMenu();
});

// 4. === Делегирование добавления виджетов ===
document.addEventListener('click', (e) => {
  const item = e.target.closest('[data-add]');
  if (!item) return;

  const type = item.dataset.add;
  if (!type) return;

  dashboard.addWidget(type);
  closeMenu();   // после выбора закрыть меню
});

// 5. Кнопка «Очистить всё»
document.getElementById('clear-all').addEventListener('click', () => {
  dashboard.clear();
});

// 6. Стартовый набор
dashboard.addWidget('profile');
dashboard.addWidget('maps');
dashboard.addWidget('crypto');
dashboard.addWidget('weather');
dashboard.addWidget('todo');
dashboard.addWidget('quote');

// 7. Отладка
window.dashboard = dashboard;