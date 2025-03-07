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

// Platform properties
export const platforms = [
  // Each platform has position, size, and physical properties
  // Platforms will be positioned randomly in initializeConstants
  {
    x: 0, // Will be set based on canvas
    y: 0, // Will be set based on canvas
    width: 200, // Will be randomized
    height: 15, // Reduced height
    color: "#8B4513", // Will be randomized to vibrant colors
    friction: 0.95, // Slightly less friction than tarmac
    restitution: 0.7, // Slightly less bouncy than default
    rotation: 0, // Will be randomized between -20 and 20 degrees
    borderRadius: 8, // Rounded corners
  },
  {
    x: 0, // Will be set based on canvas
    y: 0, // Will be set based on canvas
    width: 150, // Will be randomized
    height: 15, // Reduced height
    color: "#4682B4", // Will be randomized to vibrant colors
    friction: 0.97, // More slippery
    restitution: 0.9, // More bouncy
    rotation: 0, // Will be randomized between -20 and 20 degrees
    borderRadius: 8, // Rounded corners
  },
  {
    x: 0, // Will be set based on canvas
    y: 0, // Will be set based on canvas
    width: 250, // Will be randomized
    height: 15, // Reduced height
    color: "#2E8B57", // Will be randomized to vibrant colors
    friction: 0.96, // Medium friction
    restitution: 0.85, // Medium bounce
    rotation: 0, // Will be randomized between -20 and 20 degrees
    borderRadius: 8, // Rounded corners
  },
];

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

// Helper function to get a random number between min and max
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

// Helper function to generate a random vibrant color
function getRandomVibrantColor() {
  // Generate vibrant colors with high saturation and brightness
  const hue = Math.floor(Math.random() * 360); // Random hue (0-359)
  const saturation = Math.floor(getRandomNumber(70, 100)); // High saturation (70-100%)
  const lightness = Math.floor(getRandomNumber(45, 65)); // Medium-high lightness (45-65%)

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

// Initialize canvas elements and update related constants
export function initializeConstants(canvasElement) {
  canvas = canvasElement;
  ctx = canvas.getContext("2d");

  // Set initial positions and sizes
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 3;
  ball.area = (Math.PI * ball.radius * ball.radius) / 1000; // Scaled down for visual effect

  // Divide the canvas into quarters horizontally
  const quarterWidth = canvas.width / 3;

  // Determine if we're on a mobile device based on screen width
  // Typical breakpoint for mobile is around 768px
  const isMobile = window.innerWidth < 768;

  // Set platform size ranges based on device type
  const minWidth = isMobile ? 70 : 120;
  const maxWidth = isMobile ? 150 : 280;

  // Platform height can also be adjusted based on device
  const platformHeight = isMobile ? 12 : 15;

  // Randomize platform properties
  for (let i = 0; i < platforms.length; i++) {
    const platform = platforms[i];

    // Random width based on device size
    platform.width = getRandomNumber(minWidth, maxWidth);

    // Update height based on device
    platform.height = platformHeight;

    // Random rotation between -20 and 20 degrees (convert to radians)
    platform.rotation = getRandomNumber(-20, 20) * (Math.PI / 180);

    // Random vertical position in the middle 60% of the canvas
    platform.y = getRandomNumber(canvas.height * 0.2, canvas.height * 0.8);

    // Position each platform in its designated quarter
    // Platform 0 in 1st quarter, platform 1 in 2nd quarter, platform 2 in 3rd quarter
    const quarterStart = i * quarterWidth;
    const quarterEnd = (i + 1) * quarterWidth;

    // Position horizontally within the quarter, leaving some margin
    const margin = platform.width / 2 + 20; // Margin to ensure platform doesn't go out of quarter
    platform.x = getRandomNumber(quarterStart + margin, quarterEnd - margin);

    // Assign a random vibrant color
    platform.color = getRandomVibrantColor();
  }

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
