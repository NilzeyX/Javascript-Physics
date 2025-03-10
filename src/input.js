// Input Module - Handles user interactions
import { canvas, charge } from "./constants.js";
import { isPointInBall, launchBall } from "./ball.js";

// Get mouse position relative to canvas
function getMousePos(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

// Get touch position relative to canvas
function getTouchPos(event) {
  const rect = canvas.getBoundingClientRect();
  const touch = event.touches[0] || event.changedTouches[0];
  return {
    x: touch.clientX - rect.left,
    y: touch.clientY - rect.top,
  };
}

// Initialize mouse event listeners
export function initializeMouseEvents() {
  // Mouse down event - start dragging if clicking on ball
  canvas.addEventListener("mousedown", function (event) {
    const mousePos = getMousePos(event);

    if (isPointInBall(mousePos.x, mousePos.y)) {
      charge.active = true;
      charge.startX = mousePos.x;
      charge.startY = mousePos.y;
      charge.currentX = mousePos.x;
      charge.currentY = mousePos.y;

      // Change cursor to indicate charging
      canvas.style.cursor = "crosshair";
    }
  });

  // Mouse move event - update charge direction when active
  canvas.addEventListener("mousemove", function (event) {
    const mousePos = getMousePos(event);

    if (charge.active) {
      charge.currentX = mousePos.x;
      charge.currentY = mousePos.y;
    } else {
      // Change cursor to grab when hovering over the ball
      if (isPointInBall(mousePos.x, mousePos.y)) {
        canvas.style.cursor = "grab";
      } else {
        canvas.style.cursor = "default";
      }
    }
  });

  // Mouse up event - launch ball with velocity based on charge power and direction
  canvas.addEventListener("mouseup", function () {
    if (charge.active) {
      // Launch the ball
      launchBall();

      // Reset charge state
      charge.active = false;
      charge.power = 0;
      canvas.style.cursor = "default";
    }
  });

  // Mouse leave event - cancel charge if pointer leaves canvas
  canvas.addEventListener("mouseleave", function () {
    if (charge.active) {
      // Reset charge state
      charge.active = false;
      charge.power = 0;
      canvas.style.cursor = "default";
    }
  });

  // Touch event handlers for mobile devices
  // Using { passive: false } to ensure preventDefault works on all browsers including Safari
  canvas.addEventListener(
    "touchstart",
    function (event) {
      // Prevent default to avoid scrolling/zooming
      event.preventDefault();

      const touchPos = getTouchPos(event);

      if (isPointInBall(touchPos.x, touchPos.y)) {
        charge.active = true;
        charge.startX = touchPos.x;
        charge.startY = touchPos.y;
        charge.currentX = touchPos.x;
        charge.currentY = touchPos.y;
      }
    },
    { passive: false }
  );

  canvas.addEventListener(
    "touchmove",
    function (event) {
      // Prevent default to avoid scrolling/zooming
      event.preventDefault();

      if (charge.active) {
        const touchPos = getTouchPos(event);
        charge.currentX = touchPos.x;
        charge.currentY = touchPos.y;
      }
    },
    { passive: false }
  );

  canvas.addEventListener(
    "touchend",
    function (event) {
      // Prevent default to avoid scrolling/zooming
      event.preventDefault();

      if (charge.active) {
        // Launch the ball
        launchBall();

        // Reset charge state
        charge.active = false;
        charge.power = 0;
      }
    },
    { passive: false }
  );

  canvas.addEventListener(
    "touchcancel",
    function (event) {
      // Prevent default to avoid scrolling/zooming
      event.preventDefault();

      if (charge.active) {
        // Reset charge state
        charge.active = false;
        charge.power = 0;
      }
    },
    { passive: false }
  );
}
