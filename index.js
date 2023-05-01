import KEYS from "./keys.js";

class VirtualKeyboard {
  constructor() {
    // создаем контейнер для клавиатуры и текстового поля
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("keyboard-wrapper");

    // создаем текстовое поле
    this.input = document.createElement("div");
    this.input.type = "text";
    this.input.contentEditable = true;
    this.input.classList.add("keyboard-input");

    // добавляем текстовое поле на страницу
    this.wrapper.appendChild(this.input);
    // создаем контейнер для клавиатуры
    this.container = document.createElement("div");
    this.container.classList.add("keyboard-container");

    // создаем элементы клавиатуры
    KEYS.forEach((key) => {
      const keyEl = document.createElement("div");
      keyEl.classList.add("key");
      keyEl.textContent = key.key;
      keyEl.dataset.code = key.code;

      keyEl.addEventListener("click", () => {
        this.input.innerText += key.key;
        this.emit("keydown", key.code);
        this.emit("keyup", key.code);
      });

      this.container.appendChild(keyEl);
    });

    // добавляем контейнер клавиатуры на страницу
    this.wrapper.appendChild(this.container);

    // добавляем общий блок на страницу
    document.body.appendChild(this.wrapper);

    // добавляем обработчик события keydown на документе
    document.addEventListener("keydown", (event) => {
      switch (event.key.code) {
        case "Tab":
          this.insertText("\t");
          break;
        case "Enter":
          this.insertText("\n");
          break;
        case "ArrowUp":
          this.moveCursor("up");
          break;
        case "ArrowDown":
          this.moveCursor("down");
          break;
        case "ArrowLeft":
          this.moveCursor("left");
          break;
        case "ArrowRight":
          this.moveCursor("right");
          break;
        case "Backspace":
          this.deleteChar("back");
      }
      const keyEl = this.container.querySelector(`[data-code="${event.code}"]`);
      if (keyEl) {
        keyEl.classList.add("active");
      }
    });

    // добавляем обработчик события keyup на документе
    document.addEventListener("keyup", (event) => {
      const keyEl = this.container.querySelector(`[data-code="${event.code}"]`);
      if (keyEl) {
        keyEl.classList.remove("active");
      }
    });
  }

  on(eventName, callback) {
    this.events = this.events || {};
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(callback);
  }
  insertText(text) {
    /*this.input.insertAdjacentText('beforeend', text);*/
    this.input.innerText += text;
  }

  emit(eventName, data) {
    if (this.events && this.events[eventName]) {
      this.events[eventName].forEach((callback) => callback(data));
    }
  }
}

// создаем экземпляр класса и добавляем на страницу
const virtualKeyboard = new VirtualKeyboard();
