// Custom Physics Engine for Basketball Simulation

// Canvas setup
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions to match window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Basketball properties
const ball = {
  x: canvas.width / 2, // Start in the center horizontally
  y: canvas.height / 3, // Start in the upper third of the screen
  radius: 30,
  velocityX: 2, // Initial horizontal velocity
  velocityY: 0, // Initial vertical velocity
  gravity: 0.5, // Gravity acceleration
  friction: 0.98, // Ground friction (slows horizontal movement when on ground)
  restitution: 0.8, // Bounciness (energy retained after collision)
  mass: 0.6, // Mass of the ball in kg (typical basketball is ~0.6kg)
  airDensity: 0.0005, // Air density factor (adjusted for visual effect)
  dragCoefficient: 0.47, // Drag coefficient for a sphere
  rotation: 0, // Current rotation angle in radians
  rotationSpeed: 0, // Current rotation speed in radians per frame
  rotationFriction: 0.98, // How quickly rotation slows down
};

// Surface properties
const surfaces = {
  tarmac: {
    friction: 0.85, // Harsh friction for tarmac/concrete (lower = more friction)
    color: "#333333", // Dark gray for tarmac
    height: 10, // Height of the tarmac surface visualization (reduced by 50%)
  },
};

// Calculate the cross-sectional area of the ball
ball.area = (Math.PI * ball.radius * ball.radius) / 1000; // Scaled down for visual effect

// Basketball court boundaries
const boundaries = {
  left: 0 + ball.radius,
  right: canvas.width - ball.radius,
  top: 0 + ball.radius,
  bottom: canvas.height - 10 - ball.radius,
};

// Charging state
const charge = {
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
const trail = {
  positions: [], // Array to store previous positions
  maxLength: 15, // Maximum number of trail positions to store
  fadeRate: 0.85, // How quickly the trail fades (0-1)
  minOpacity: 0.1, // Minimum opacity before removing trail point
  scaleRate: 0.9, // How quickly the trail scales down
};

// Draw the basketball
function drawBall() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the tarmac surface
  drawTarmacSurface();

  // Draw the trail
  drawTrail();

  // Draw the basketball with a subtle 3D effect using a radial gradient
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);

  // Create a radial gradient for 3D effect
  // The light source is slightly above and to the left
  const lightOffsetX = -ball.radius * 0.3;
  const lightOffsetY = -ball.radius * 0.3;

  const gradient = ctx.createRadialGradient(
    ball.x + lightOffsetX,
    ball.y + lightOffsetY,
    0, // Light source position
    ball.x,
    ball.y,
    ball.radius // Ball center and radius
  );

  // Add color stops for the gradient
  gradient.addColorStop(0, "#ff8533"); // Lighter orange (highlight)
  gradient.addColorStop(0.7, "#ff6600"); // Base orange color
  gradient.addColorStop(1, "#cc5200"); // Darker orange (shadow edge)

  ctx.fillStyle = gradient;
  ctx.fill();

  // Draw basketball lines
  drawBasketballLines();

  // Draw the charge arrow if active
  drawChargeArrow();
}

// Draw the basketball lines
function drawBasketballLines() {
  // Set line style for all basketball lines
  ctx.strokeStyle = "#663300"; // Dark brown for basketball lines
  ctx.lineWidth = 1.5;

  // Add a subtle shadow effect to the lines
  ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
  ctx.shadowBlur = 2;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;

  // Create a clipping region to ensure lines don't draw outside the ball
  ctx.save(); // Save the current state
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.clip(); // Set the clipping region to the ball shape

  // Save context before rotation
  ctx.save();

  // Translate to ball center, rotate, then translate back
  ctx.translate(ball.x, ball.y);
  ctx.rotate(ball.rotation);
  ctx.translate(-ball.x, -ball.y);

  // Horizontal line across the middle
  ctx.beginPath();
  ctx.moveTo(ball.x - ball.radius, ball.y);
  ctx.lineTo(ball.x + ball.radius, ball.y);
  ctx.stroke();

  // Vertical line down the middle
  ctx.beginPath();
  ctx.moveTo(ball.x, ball.y - ball.radius);
  ctx.lineTo(ball.x, ball.y + ball.radius);
  ctx.stroke();

  // Left curved line
  ctx.beginPath();
  // Draw a curve that's part of a larger circle to the left of the ball
  ctx.arc(
    ball.x - ball.radius * 2.05, // Center X much further to the left (increased offset)
    ball.y, // Same Y as ball center
    ball.radius * 1.6, // Larger radius
    -Math.PI * 0.3, // Start angle
    Math.PI * 0.3, // End angle
    false // Counterclockwise
  );
  ctx.stroke();

  // Right curved line
  ctx.beginPath();
  // Draw a curve that's part of a larger circle to the right of the ball
  ctx.arc(
    ball.x + ball.radius * 2.05, // Center X much further to the right (increased offset)
    ball.y + 1, // Same Y as ball center
    ball.radius * 1.6, // Larger radius
    Math.PI * 0.7, // Start angle
    Math.PI * 1.4, // End angle
    false // Counterclockwise
  );
  ctx.stroke();

  // Restore context after rotation
  ctx.restore();

  // Restore the context to remove clipping
  ctx.restore();

  // Reset shadow for the outer circle
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Outer circle (ball outline)
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.stroke();
}

// Draw the tarmac surface
function drawTarmacSurface() {
  // Draw the main tarmac surface
  ctx.fillStyle = surfaces.tarmac.color;
  ctx.fillRect(
    0,
    canvas.height - surfaces.tarmac.height,
    canvas.width,
    surfaces.tarmac.height
  );

  // Add static texture with solid gray squares
  ctx.fillStyle = "#2a2a2a"; // Slightly lighter color for texture

  // Create a fixed pattern of squares for texture
  const squareSize = 10;
  const gap = 10;

  for (let x = 0; x < canvas.width; x += squareSize + gap) {
    for (
      let y = canvas.height - surfaces.tarmac.height;
      y < canvas.height;
      y += squareSize + gap
    ) {
      ctx.fillRect(x, y, squareSize, squareSize);
    }
  }

  // Add a subtle line at the top of the tarmac
  ctx.beginPath();
  ctx.moveTo(0, canvas.height - surfaces.tarmac.height);
  ctx.lineTo(canvas.width, canvas.height - surfaces.tarmac.height);
  ctx.strokeStyle = "#444444";
  ctx.lineWidth = 1;
  ctx.stroke();
}

// Draw the trail effect
function drawTrail() {
  // Draw each trail position with decreasing opacity
  for (let i = 0; i < trail.positions.length; i++) {
    const pos = trail.positions[i];

    // Skip if opacity is too low
    if (pos.opacity < trail.minOpacity) continue;

    // Draw trail circle
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, pos.radius, 0, Math.PI * 2);

    // Create gradient for more appealing trail
    const gradient = ctx.createRadialGradient(
      pos.x,
      pos.y,
      0,
      pos.x,
      pos.y,
      pos.radius
    );
    gradient.addColorStop(0, `rgba(255, 102, 0, ${pos.opacity})`);
    gradient.addColorStop(1, `rgba(255, 102, 0, 0)`);

    ctx.fillStyle = gradient;
    ctx.fill();
  }
}

// Draw the directional charge arrow
function drawChargeArrow() {
  if (!charge.active) return;

  // Calculate direction and distance
  const dx = charge.currentX - charge.startX; // Flipped direction
  const dy = charge.currentY - charge.startY; // Flipped direction
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Only draw if the distance is above the minimum threshold
  if (distance < charge.minLength) return;

  // Calculate the arrow length (capped at maxLength)
  const arrowLength = Math.min(distance, charge.maxLength);

  // Calculate the normalized direction vector
  const dirX = dx / distance;
  const dirY = dy / distance;

  // Calculate the arrow end point
  const endX = charge.startX + dirX * arrowLength; // Flipped direction
  const endY = charge.startY + dirY * arrowLength; // Flipped direction

  // Calculate the power percentage (0-1)
  const powerPercentage = Math.min(distance / charge.maxLength, 1);
  charge.power = powerPercentage * charge.maxPower;

  // Determine arrow color based on power
  let arrowColor;
  if (powerPercentage < 0.33) {
    arrowColor = charge.color.weak;
  } else if (powerPercentage < 0.66) {
    arrowColor = charge.color.medium;
  } else {
    arrowColor = charge.color.strong;
  }

  // Draw the arrow line
  ctx.beginPath();
  ctx.moveTo(charge.startX, charge.startY);
  ctx.lineTo(endX, endY);
  ctx.lineWidth = 3;
  ctx.strokeStyle = arrowColor;
  ctx.stroke();

  // Draw the arrow head
  const headLength = charge.arrowWidth + powerPercentage * 10; // Arrow head size increases with power

  // Calculate the arrow head points
  const angle = Math.atan2(dirY, dirX);
  const headAngle1 = angle - Math.PI / 7;
  const headAngle2 = angle + Math.PI / 7;

  const headX1 = endX - headLength * Math.cos(headAngle1);
  const headY1 = endY - headLength * Math.sin(headAngle1);
  const headX2 = endX - headLength * Math.cos(headAngle2);
  const headY2 = endY - headLength * Math.sin(headAngle2);

  // Draw the arrowhead
  ctx.beginPath();
  ctx.moveTo(endX, endY);
  ctx.lineTo(headX1, headY1);
  ctx.lineTo(headX2, headY2);
  ctx.closePath();
  ctx.fillStyle = arrowColor;
  ctx.fill();

  // Draw power indicator text
  ctx.font = "16px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.fillText(`Power: ${Math.round(charge.power * 2.5)}`, endX, endY - 20);
}

// Update trail positions and properties
function updateTrail() {
  // Only add trail points if the ball is moving fast enough
  const velocity = Math.sqrt(
    ball.velocityX * ball.velocityX + ball.velocityY * ball.velocityY
  );

  // Add current position to trail if moving fast enough (not when charging)
  if (velocity > 3 && !charge.active) {
    trail.positions.unshift({
      x: ball.x,
      y: ball.y,
      radius: ball.radius * 0.9, // Slightly smaller than the ball
      opacity: 0.7, // Starting opacity
    });

    // Limit trail length
    if (trail.positions.length > trail.maxLength) {
      trail.positions.pop();
    }
  }

  // Update each trail position
  for (let i = 0; i < trail.positions.length; i++) {
    const pos = trail.positions[i];

    // Reduce opacity
    pos.opacity *= trail.fadeRate;

    // Reduce size
    pos.radius *= trail.scaleRate;

    // Remove if too small or transparent
    if (pos.opacity < trail.minOpacity || pos.radius < 1) {
      trail.positions.splice(i, 1);
      i--;
    }
  }
}

// Check if ball is touching the tarmac surface
function isBallOnTarmac() {
  return ball.y >= boundaries.bottom - 1;
}

// Update ball physics
function updateBall() {
  // If ball is being charged, don't update its position
  if (charge.active) {
    return;
  }

  // Apply gravity to vertical velocity
  ball.velocityY += ball.gravity;

  // Calculate air resistance (drag force)
  // Formula: F_drag = 0.5 * ρ * v² * C_d * A
  // Where:
  // ρ = air density
  // v = velocity
  // C_d = drag coefficient
  // A = cross-sectional area

  // Calculate velocity magnitude
  const velocity = Math.sqrt(
    ball.velocityX * ball.velocityX + ball.velocityY * ball.velocityY
  );

  if (velocity > 0) {
    // Calculate drag magnitude
    const drag =
      0.5 *
      ball.airDensity *
      velocity *
      velocity *
      ball.dragCoefficient *
      ball.area;

    // Calculate drag force components
    const dragForceX = drag * (ball.velocityX / velocity);
    const dragForceY = drag * (ball.velocityY / velocity);

    // Apply drag forces (divided by mass to get acceleration)
    ball.velocityX -= dragForceX / ball.mass;
    ball.velocityY -= dragForceY / ball.mass;
  }

  // Apply appropriate friction based on surface
  if (isBallOnTarmac()) {
    // Apply harsher tarmac friction
    ball.velocityX *= surfaces.tarmac.friction;

    // Add a small random jitter to simulate rough surface
    if (Math.abs(ball.velocityX) > 0.1) {
      ball.velocityX += (Math.random() - 0.5) * 0.05;
    }
  }

  // Update position
  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  // Update rotation
  ball.rotation += ball.rotationSpeed;

  // Apply rotation friction
  ball.rotationSpeed *= ball.rotationFriction;

  // Handle collisions with boundaries

  // Bottom boundary (floor)
  if (ball.y >= boundaries.bottom) {
    ball.y = boundaries.bottom;
    ball.velocityY = -ball.velocityY * ball.restitution;

    // Add a small random horizontal impulse when hitting the ground
    // to make the bouncing more realistic
    if (Math.abs(ball.velocityY) > 0.5) {
      ball.velocityX += (Math.random() - 0.5) * 0.5;
    }

    // Update rotation speed based on horizontal velocity when hitting the ground
    // This simulates the ball rolling on the ground in the direction it's moving
    const rotationFactor = 0.05; // How much horizontal velocity affects rotation
    ball.rotationSpeed = ball.velocityX * rotationFactor;

    // Add a small random variation to rotation for more realism
    ball.rotationSpeed += (Math.random() - 0.5) * 0.01;
  }

  // Top boundary (ceiling)
  if (ball.y <= boundaries.top) {
    ball.y = boundaries.top;
    ball.velocityY = -ball.velocityY * ball.restitution;

    // Slightly change rotation when hitting ceiling
    ball.rotationSpeed *= -0.8;
  }

  // Right boundary (wall)
  if (ball.x >= boundaries.right) {
    ball.x = boundaries.right;
    ball.velocityX = -ball.velocityX * ball.restitution;

    // Reverse rotation direction slightly when hitting wall
    ball.rotationSpeed *= -0.7;
  }

  // Left boundary (wall)
  if (ball.x <= boundaries.left) {
    ball.x = boundaries.left;
    ball.velocityX = -ball.velocityX * ball.restitution;

    // Reverse rotation direction slightly when hitting wall
    ball.rotationSpeed *= -0.7;
  }

  // Stop tiny bouncing (when the ball has almost stopped)
  if (Math.abs(ball.velocityY) < 0.5 && isBallOnTarmac()) {
    ball.velocityY = 0;
    ball.y = boundaries.bottom;

    // If the ball is rolling very slowly on the ground, gradually slow down rotation
    if (Math.abs(ball.velocityX) < 0.5) {
      ball.rotationSpeed *= 0.95;
    }
  }
}

// Animation loop
function animate() {
  updateBall();
  updateTrail();
  drawBall();
  requestAnimationFrame(animate);
}

// Handle window resize
window.addEventListener("resize", function () {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  // Update boundaries
  boundaries.right = canvas.width - ball.radius;
  boundaries.bottom = canvas.height - ball.radius;

  // Reset ball position if it's outside the new boundaries
  if (ball.x > boundaries.right) ball.x = boundaries.right;
  if (ball.y > boundaries.bottom) ball.y = boundaries.bottom;
});

// Check if a point is inside the ball
function isPointInBall(x, y) {
  const distance = Math.sqrt(Math.pow(x - ball.x, 2) + Math.pow(y - ball.y, 2));
  return distance <= ball.radius;
}

// Get mouse position relative to canvas
function getMousePos(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

// Mouse down event - start dragging if clicking on ball
canvas.addEventListener("mousedown", function (event) {
  const mousePos = getMousePos(event);

  if (isPointInBall(mousePos.x, mousePos.y)) {
    charge.active = true;
    charge.startX = ball.x;
    charge.startY = ball.y;
    charge.currentX = mousePos.x;
    charge.currentY = mousePos.y;

    // Change cursor to indicate charging
    canvas.style.cursor = "crosshair";
  }
});

// Mouse move event - update charge direction when active
canvas.addEventListener("mousemove", function (event) {
  if (charge.active) {
    const mousePos = getMousePos(event);
    charge.currentX = mousePos.x;
    charge.currentY = mousePos.y;
  } else {
    // Change cursor to grab when hovering over the ball
    const mousePos = getMousePos(event);
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
    // Calculate direction vector
    const dx = charge.currentX - charge.startX; // Flipped direction
    const dy = charge.currentY - charge.startY; // Flipped direction
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Only launch if the charge has enough power
    if (distance >= charge.minLength) {
      // Calculate normalized direction
      const dirX = dx / distance;
      const dirY = dy / distance;

      // Apply velocity based on power and direction
      ball.velocityX = dirX * charge.power;
      ball.velocityY = dirY * charge.power;

      // Set initial rotation speed based on horizontal velocity component
      const rotationFactor = 0.03;
      ball.rotationSpeed = ball.velocityX * rotationFactor;

      // Add a small random component for natural variation
      ball.rotationSpeed += (Math.random() - 0.5) * 0.02;
    }

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

// Start the animation when the page loads
window.onload = function () {
  animate();
};
