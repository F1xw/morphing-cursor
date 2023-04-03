class MorphingCursor {
  #cursor;
  #currentInteractableElement;

  constructor() {
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }

  handleMouseMove(e) {
    let interactable = e.target.closest("[interactable]"),
      interacting = interactable !== null;
    let x, y;
    let keyframes;

    if (interacting && this.#cursor.getAttribute("state") === "idle" ) {
      this.#currentInteractableElement = interactable;
      let clientRect = interactable.getBoundingClientRect();
      x = clientRect.x;
      y = clientRect.y;

      keyframes = {
        transform: `translate(${x}px, ${y}px)`,
        width: interactable.offsetWidth + "px",
        height: interactable.offsetHeight + "px",
        borderRadius: getComputedStyle(interactable).borderRadius,
      };
    } else {
      this.#currentInteractableElement = null;
      x = e.clientX - this.#cursor.offsetWidth / 2;
      y = e.clientY - this.#cursor.offsetHeight / 2;

      keyframes = {
        transform: `translate(${x}px, ${y}px)`,
        width: "40px",
        height: "40px",
        borderRadius: "20px",
      };
    }
    this.#cursor.animate(keyframes, {
      duration: 500,
      fill: "forwards",
      easing: "ease",
    });
  }

  handleScroll(e) {
    if (this.#currentInteractableElement === null) return;

    let x, y;
    let keyframes;

    let clientRect = this.#currentInteractableElement.getBoundingClientRect();
    x = clientRect.x;
    y = clientRect.y;

    keyframes = {
      transform: `translate(${x}px, ${y}px)`,
      width: this.#currentInteractableElement.offsetWidth + "px",
      height: this.#currentInteractableElement.offsetHeight + "px",
      borderRadius: getComputedStyle(this.#currentInteractableElement)
        .borderRadius,
    };
    this.#cursor.animate(keyframes, {
      fill: "forwards",
      easing: "ease",
    });
  }

  #addCursorToBody() {
    let el = document.createElement("div");
    el.setAttribute("state", "idle");
    el.id = "morphingCursor";
    document.body.appendChild(el);
    document.body.setAttribute("cursor-enabled", true);
    this.#cursor = el;
  }

  register(options) {
    if (!("ontouchstart" in window) || options?.skipTouchCheck) {
      this.#addCursorToBody();
      document.addEventListener("mousemove", this.handleMouseMove);
      document.addEventListener("scroll", this.handleScroll);
      document.addEventListener("mousedown", () => {
        this.#cursor.setAttribute("state", "active");
      });
      document.addEventListener("mouseup", () => {
        this.#cursor.setAttribute("state", "idle");
      });
    }
  }
}
