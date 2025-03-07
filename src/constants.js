// Physics Engine Constants

// Canvas reference (will be set by the engine)
export let canvas;
export let ctx;

// Basketball properties
export const ball = {
  x: 0, // Will be set based on canvas
  y: 0, // Will be set based on canvas
  radius: 25, // Size of the ball
  velocityX: 2, // Initial horizontal velocity
  velocityY: 0, // Initial vertical velocity
  gravity: 0.5, // Gravity acceleration
  friction: 0.75, // Ground friction (slows horizontal movement when on ground)
  restitution: 0.8, // Bounciness (energy retained after collision)
  mass: 0.6, // Mass of the ball in kg (typical basketball is ~0.6kg)
  airDensity: 0.001, // Air density factor (adjusted for visual effect)
  dragCoefficient: 0.47, // Drag coefficient for a sphere
  rotation: 0, // Current rotation angle in radians
  rotationSpeed: 0, // Current rotation speed in radians per frame
  rotationFriction: 0.98, // How quickly rotation slows down
  area: 0, // Will be calculated based on radius
};

// Surface properties
export const surfaces = {
  tarmac: {
    friction: 0.98, // Harsh friction for tarmac/concrete (lower = more friction)
    color: "#333333", // Dark gray for tarmac
    height: 10, // Height of the tarmac surface visualization
  },
};

// Basketball court boundaries
export const boundaries = {
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
};

// Charging state
export const charge = {
  active: false,
  startX: 0,
  startY: 0,
  currentX: 0,
  currentY: 0,
  power: 0,
  maxPower: 40, // Maximum power/velocity
  arrowWidth: 10, // Width of the arrow head
  minLength: 20, // Minimum arrow length to show
  maxLength: 150, // Maximum arrow length
  color: {
    weak: "#00ff00", // Green for weak charge
    medium: "#ffff00", // Yellow for medium charge
    strong: "#ff0000", // Red for strong charge
  },
};

// Trail effect
export const trail = {
  positions: [], // Array to store previous positions
  maxLength: 25, // Maximum number of trail positions to store
  fadeRate: 0.85, // How quickly the trail fades (0-1)
  minOpacity: 0.1, // Minimum opacity before removing trail point
  scaleRate: 0.9, // How quickly the trail scales down
};

// Initialize canvas elements and update related constants
export function initializeConstants(canvasElement) {
  canvas = canvasElement;
  ctx = canvas.getContext("2d");

  // Set initial positions and sizes
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 3;
  ball.area = (Math.PI * ball.radius * ball.radius) / 1000; // Scaled down for visual effect

  // Set boundaries
  updateBoundaries();
}

// Update boundary values based on canvas size
export function updateBoundaries() {
  boundaries.left = 0 + ball.radius;
  boundaries.right = canvas.width - ball.radius;
  boundaries.top = 0 + ball.radius;
  boundaries.bottom = canvas.height - surfaces.tarmac.height - ball.radius;
}
