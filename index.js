import KEYS from "./keys.js";

class KeyboardKey {
  constructor(key, keyboard) {
    this.isServiceKey = key.group === "service";

    this.keyboard = keyboard;
    this.key = key;
    this.el = document.createElement("div");
    this.el.classList.add("key");
    this.el.textContent = this.keyText;
    this.el.dataset.code = key.code;
    this.shift = false;
    if (key.group === "service") {
      this.el.classList.add("service");
    }
    this.el.addEventListener("click", (e) => {
      keyboard.emit("keydown", {
        ...e,
        code: this.key.code,
        key: this.keyText,
      });
      keyboard.emit("keyup", {
        ...e,
        code: this.key.code,
        key: this.keyText,
      });

      this.el.classList.add("active");
      setTimeout(() => {
        this.el.classList.remove("active");
      }, 200);
    });

    keyboard.container.appendChild(this.el);
    keyboard.on("layout", () => {
      this.renderText();
    });
    keyboard.on("shift", (event) => {
      this.shift = event.shiftKey;
      this.renderText();
    });
  }
  get isUppercase() {
    return this.shift || this.keyboard.caps;
  }
  get layout() {
    return this.keyboard.layout;
  }
  get keyText() {
    if (this.isUppercase && this.layout === "En") {
      return this.isServiceKey ? this.key.key : this.key.shiftKeyEN;
    }
    if (this.isUppercase && this.layout === "Ru") {
      return this.isServiceKey ? this.key.key : this.key.shiftKeyRu;
    }
    if (this.layout === "En") {
      return this.isServiceKey ? this.key.key : this.key.key;
    }
    if (this.layout === "Ru") {
      return this.isServiceKey ? this.key.key : this.key.keyRu;
    }
  }
  renderText() {
    this.el.innerText = this.keyText;
  }
}

class VirtualKeyboard {
  constructor() {
    // создаем контейнер для клавиатуры и текстового поля
    this.layouts = ["Ru", "En"];
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("keyboard-wrapper");

    this.description = document.createElement("div");
    this.description.classList.add("keyboard-description");
    this.description.innerText =
      "Клавиатура была создана в Windows10 \n Для смены раскладки клавиатуры нажми ALT+SHIFT для Windows, OPTION+SHIFT для MacOs ";

    this.wrapper.append(this.description);
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
      new KeyboardKey(key, this);
    });

    // добавляем контейнер клавиатуры на страницу
    this.wrapper.appendChild(this.container);

    // добавляем общий блок на страницу
    document.body.appendChild(this.wrapper);

    // добавляем обработчик события keydown на документе
    document.addEventListener("keydown", (event) => {
      this.emit("keydown", event);
    });
    this.on("keydown", (event) => this.keydown(event));
    // добавляем обработчик события keyup на документе
    document.addEventListener("keyup", (event) => {
      const keyEl = this.container.querySelector(`[data-code="${event.code}"]`);
      if (keyEl) {
        keyEl.classList.remove("active");
      }
      if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
        this.emit("shift", event);
      }
    });
  }

  keydown(event) {
    if (event.altKey && event.shiftKey) {
      event?.preventDefault();
      this.layout === this.layouts[0]
        ? (this.layout = this.layouts[1])
        : (this.layout = this.layouts[0]);
      this.emit("layout");
      return;
    }
    switch (event.code) {
      case "ShiftLeft":
      case "ShiftRight":
        this.emit("shift", event);
      case "ControlLeft":
      case "ControlRight":
      case "Alt":
      case "AltLeft":
      case "AltRight":
      case "Delete":
        break;
      case "Tab":
        this.insertText(`    `, event);
        break;
      case "Space":
        this.insertText(` `, event);
        break;
      case "Enter":
        this.insertText("\n", event);
        break;
      case "ArrowUp":
        this.insertText("↑", event);
        break;
      case "ArrowDown":
        this.insertText("↓", event);
        break;
      case "ArrowLeft":
        this.insertText("←", event);
        break;
      case "ArrowRight":
        this.insertText("→", event);
        break;
      case "Backspace":
        this.deleteChar(event);
        break;
      case "CapsLock":
        this.caps = !this.caps;
        console.log(this.caps);
        this.emit("shift", event);
        break;
      default:
        event && event.preventDefault && event.preventDefault();
        this.insertText(event.key);
    }
    const keyEl = this.container.querySelector(`[data-code="${event.code}"]`);
    if (keyEl) {
      keyEl.classList.add("active");
    }
  }
  get layout() {
    const layout = window.localStorage.getItem("layout");
    return layout ? layout : "Ru";
  }

  set layout(layout) {
    window.localStorage.setItem("layout", layout);
  }

  get caps() {
    const caps = window.localStorage.getItem("caps");
    return !!JSON.parse(caps);
  }

  set caps(caps) {
    window.localStorage.setItem("caps", caps);
  }

  on(eventName, callback) {
    this.events = this.events || {};
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(callback);
  }

  deleteChar(event) {
    event && event.preventDefault && event.preventDefault();
    this.input.innerText = this.input.innerText.slice(0, -1);
  }

  insertText(text, event) {
    event && event.preventDefault && event.preventDefault();
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
