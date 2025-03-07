// Ball Physics Module
import { ball, boundaries, surfaces, charge, trail } from "./constants.js";

// Check if ball is touching the tarmac surface
export function isBallOnTarmac() {
  return ball.y >= boundaries.bottom - 1;
}

// Update ball physics
export function updateBall() {
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

// Launch the ball with velocity based on charge
export function launchBall() {
  if (!charge.active) return;

  // Calculate direction vector
  const dx = charge.currentX - charge.startX;
  const dy = charge.currentY - charge.startY;
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
}

// Check if a point is inside the ball
export function isPointInBall(x, y) {
  const distance = Math.sqrt(Math.pow(x - ball.x, 2) + Math.pow(y - ball.y, 2));
  return distance <= ball.radius;
}

// Update trail positions and properties
export function updateTrail() {
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
