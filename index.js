import KEYS from './keys.js';

class VirtualKeyboard {
  constructor() {
    // создаем контейнер для клавиатуры
    this.container = document.createElement('div');
    this.container.classList.add('keyboard-container');

    // создаем текстовое поле
    this.input = document.createElement('input');
    this.input.setAttribute('type', 'text');
    this.input.classList.add('keyboard-text');
    document.body.appendChild(this.input);

    // создаем элементы клавиатуры
    KEYS.forEach((key) => {
      const keyEl = document.createElement('div');
      keyEl.classList.add('key');
      keyEl.textContent = key.key;
      keyEl.dataset.code = key.code;

      keyEl.addEventListener('click', () => {
        this.emit('keydown', key.code);
        this.emit('keyup', key.code);
      });

      this.container.appendChild(keyEl);
    });

    // добавляем контейнер на страницу
    document.body.insertBefore(this.container, this.input);
  }

  on(eventName, callback) {
    this.events = this.events || {};
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(callback);
  }

  emit(eventName, data) {
    if (this.events && this.events[eventName]) {
      this.events[eventName].forEach(callback => callback(data));
    }
  }
}

// создаем экземпляр класса и добавляем на страницу
const virtualKeyboard = new VirtualKeyboard();