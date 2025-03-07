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

// Initialize the physics engine
export function initEngine() {
  // Get canvas element
  const canvasElement = document.getElementById("canvas");

  // Set initial canvas size to match window
  canvasElement.width = window.innerWidth;
  canvasElement.height = window.innerHeight;

  // Initialize constants with canvas reference
  initializeConstants(canvasElement);

  // Set up mouse event listeners
  initializeMouseEvents();

  // Handle window resize
  window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Update boundaries based on new canvas size
    updateBoundaries();
  });

  // Start the animation loop
  animate();
}

// Export the initialization function as default
export default initEngine;
