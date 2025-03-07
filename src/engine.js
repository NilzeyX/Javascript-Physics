// Physics Engine Module - Main entry point
import { initializeConstants, updateBoundaries, canvas } from "./constants.js";
import { updateBall, updateTrail } from "./ball.js";
import { draw } from "./renderer.js";
import { initializeMouseEvents } from "./input.js";

// Animation loop
function animate() {
  updateBall();
  updateTrail();
  draw();
  requestAnimationFrame(animate);
}

// Flag to track if initial setup has been completed
let initialSetupComplete = false;

// Set canvas dimensions to match viewport
function setCanvasDimensions() {
  // For iOS Safari, we need to get the actual viewport size
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  canvas.width = viewportWidth;
  canvas.height = viewportHeight;

  // Update boundaries based on new canvas size
  updateBoundaries();

  // Only reinitialize constants if this is not the initial setup
  // This prevents double initialization on startup
  if (initialSetupComplete) {
    initializeConstants(canvas);
  }
}

// Initialize the physics engine
export function initEngine() {
  // Get canvas element
  const canvasElement = document.getElementById("canvas");

  // Set initial canvas size to match window
  canvasElement.width = window.innerWidth;
  canvasElement.height = window.innerHeight;

  // Initialize constants with canvas reference
  initializeConstants(canvasElement);

  // Mark initial setup as complete
  initialSetupComplete = true;

  // Set up mouse event listeners
  initializeMouseEvents();

  // Handle window resize
  window.addEventListener("resize", function () {
    setCanvasDimensions();
  });

  // Handle orientation change for mobile devices
  window.addEventListener("orientationchange", function () {
    // Small delay to ensure the browser has completed the orientation change
    setTimeout(setCanvasDimensions, 100);
  });

  // Handle visibility change (when user switches tabs/apps and returns)
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "visible") {
      setCanvasDimensions();
    }
  });

  // Force an initial dimensions update after a short delay for Safari
  // But only update boundaries, not reinitialize everything
  setTimeout(function () {
    // For iOS Safari, we need to get the actual viewport size
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    canvas.width = viewportWidth;
    canvas.height = viewportHeight;

    // Update boundaries based on new canvas size
    updateBoundaries();
  }, 100);

  // Start the animation loop
  animate();
}

// Export the initialization function as default
export default initEngine;
