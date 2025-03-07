// Ball Physics Module
import {
  ball,
  boundaries,
  surfaces,
  charge,
  trail,
  platforms,
} from "./constants.js";

// Check if ball is touching the tarmac surface
export function isBallOnTarmac() {
  return ball.y >= boundaries.bottom - 1;
}

// Check if ball is on a platform
export function isBallOnPlatform() {
  for (const platform of platforms) {
    // Get platform properties
    const halfWidth = platform.width / 2;
    const halfHeight = platform.height / 2;
    const centerX = platform.x;
    const centerY = platform.y;
    const rotation = platform.rotation;

    // Transform ball position to platform's local coordinate system
    // First translate relative to platform center
    const relativeX = ball.x - centerX;
    const relativeY = ball.y - centerY;

    // Then rotate to align with platform's coordinate system (counter-rotate)
    const cosRotation = Math.cos(-rotation);
    const sinRotation = Math.sin(-rotation);

    const localX = relativeX * cosRotation - relativeY * sinRotation;
    const localY = relativeX * sinRotation + relativeY * cosRotation;

    // Check if the ball is at the right height to be on top of the platform
    // and horizontally within the platform's bounds
    if (
      Math.abs(localY + ball.radius - halfHeight) <= 1 &&
      localX >= -halfWidth &&
      localX <= halfWidth
    ) {
      return platform; // Return the platform the ball is on
    }
  }
  return null; // Not on any platform
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
  const platform = isBallOnPlatform();

  if (platform) {
    // Apply platform-specific friction
    ball.velocityX *= platform.friction;

    // Add a small random jitter to simulate surface texture
    if (Math.abs(ball.velocityX) > 0.1) {
      ball.velocityX += (Math.random() - 0.5) * 0.03;
    }
  } else if (isBallOnTarmac()) {
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

  // Handle collisions with platforms
  handlePlatformCollisions();

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
  if (
    Math.abs(ball.velocityY) < 0.5 &&
    (isBallOnTarmac() || isBallOnPlatform())
  ) {
    ball.velocityY = 0;

    if (isBallOnTarmac()) {
      ball.y = boundaries.bottom;
    }
    // Platform position is already handled in handlePlatformCollisions

    // If the ball is rolling very slowly on the ground, gradually slow down rotation
    if (Math.abs(ball.velocityX) < 0.5) {
      ball.rotationSpeed *= 0.95;
    }
  }
}

// Handle collisions with platforms
function handlePlatformCollisions() {
  for (const platform of platforms) {
    // Get platform properties
    const halfWidth = platform.width / 2;
    const halfHeight = platform.height / 2;
    const centerX = platform.x;
    const centerY = platform.y;
    const rotation = platform.rotation;

    // Transform ball position to platform's local coordinate system
    // First translate relative to platform center
    const relativeX = ball.x - centerX;
    const relativeY = ball.y - centerY;

    // Then rotate to align with platform's coordinate system (counter-rotate)
    const cosRotation = Math.cos(-rotation);
    const sinRotation = Math.sin(-rotation);

    const localX = relativeX * cosRotation - relativeY * sinRotation;
    const localY = relativeX * sinRotation + relativeY * cosRotation;

    // Check if the ball is within the platform's bounds in local coordinates
    // We add a small buffer to improve collision detection
    const buffer = 2;

    if (
      localX > -halfWidth - ball.radius - buffer &&
      localX < halfWidth + ball.radius + buffer &&
      localY > -halfHeight - ball.radius - buffer &&
      localY < halfHeight + ball.radius + buffer
    ) {
      // Calculate the closest point on the platform to the ball center
      const closestX = Math.max(-halfWidth, Math.min(halfWidth, localX));
      const closestY = Math.max(-halfHeight, Math.min(halfHeight, localY));

      // Calculate distance from closest point to ball center
      const distanceX = localX - closestX;
      const distanceY = localY - closestY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      // If distance is less than ball radius, we have a collision
      if (distance < ball.radius) {
        // Calculate normal vector (from platform to ball)
        let normalX = distanceX;
        let normalY = distanceY;

        // If ball center is inside platform, use the shortest exit direction
        if (distance === 0) {
          // Find the closest edge
          const leftDist = Math.abs(localX + halfWidth);
          const rightDist = Math.abs(localX - halfWidth);
          const topDist = Math.abs(localY + halfHeight);
          const bottomDist = Math.abs(localY - halfHeight);

          const minDist = Math.min(leftDist, rightDist, topDist, bottomDist);

          if (minDist === leftDist) {
            normalX = -1;
            normalY = 0;
          } else if (minDist === rightDist) {
            normalX = 1;
            normalY = 0;
          } else if (minDist === topDist) {
            normalX = 0;
            normalY = -1;
          } else {
            normalX = 0;
            normalY = 1;
          }
        } else {
          // Normalize the normal vector
          const normalLength = Math.sqrt(normalX * normalX + normalY * normalY);
          normalX /= normalLength;
          normalY /= normalLength;
        }

        // Transform ball velocity to platform's local coordinate system
        const localVelocityX =
          ball.velocityX * cosRotation - ball.velocityY * sinRotation;
        const localVelocityY =
          ball.velocityX * sinRotation + ball.velocityY * cosRotation;

        // Calculate dot product of velocity and normal
        const dotProduct = localVelocityX * normalX + localVelocityY * normalY;

        // Only bounce if the ball is moving toward the platform
        if (dotProduct < 0) {
          // Calculate reflection vector
          const reflectionX = localVelocityX - 2 * dotProduct * normalX;
          const reflectionY = localVelocityY - 2 * dotProduct * normalY;

          // Apply platform's restitution
          const reflectionMagnitude = Math.sqrt(
            reflectionX * reflectionX + reflectionY * reflectionY
          );
          const normalizedReflectionX = reflectionX / reflectionMagnitude;
          const normalizedReflectionY = reflectionY / reflectionMagnitude;

          const newMagnitude = reflectionMagnitude * platform.restitution;
          const newReflectionX = normalizedReflectionX * newMagnitude;
          const newReflectionY = normalizedReflectionY * newMagnitude;

          // Transform reflection vector back to world coordinates
          ball.velocityX =
            newReflectionX * cosRotation + newReflectionY * sinRotation;
          ball.velocityY =
            -newReflectionX * sinRotation + newReflectionY * cosRotation;

          // Move ball outside of platform (along normal)
          const moveDistance = ball.radius - distance + 1; // +1 for a small buffer

          // Transform the normal back to world coordinates
          const worldNormalX = normalX * cosRotation + normalY * sinRotation;
          const worldNormalY = -normalX * sinRotation + normalY * cosRotation;

          ball.x += worldNormalX * moveDistance;
          ball.y += worldNormalY * moveDistance;

          // Update rotation based on impact
          if (Math.abs(normalY) > Math.abs(normalX)) {
            // Mostly vertical collision
            ball.rotationSpeed = ball.velocityX * 0.05;
          } else {
            // Mostly horizontal collision
            ball.rotationSpeed *= -0.7;
          }

          // Add a small random variation for more realism
          ball.rotationSpeed += (Math.random() - 0.5) * 0.02;
        }
      }
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
