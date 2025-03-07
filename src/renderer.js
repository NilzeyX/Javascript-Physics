// Renderer Module - Handles all drawing operations
import {
  canvas,
  ctx,
  ball,
  surfaces,
  trail,
  charge,
  platforms,
} from "./constants.js";

// Main draw function that calls all other drawing functions
export function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the tarmac surface
  drawTarmacSurface();

  // Draw the platforms
  drawPlatforms();

  // Draw the trail
  drawTrail();

  // Draw the basketball
  drawBall();

  // Draw the charge arrow if active
  drawChargeArrow();
}

// Draw the basketball
function drawBall() {
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
    ball.x - ball.radius * 1.8, // Center X much further to the left (increased offset)
    ball.y, // Same Y as ball center
    ball.radius * 1.3, // Larger radius
    -Math.PI * 0.3, // Start angle
    Math.PI * 0.3, // End angle
    false // Counterclockwise
  );
  ctx.stroke();

  // Right curved line
  ctx.beginPath();
  // Draw a curve that's part of a larger circle to the right of the ball
  ctx.arc(
    ball.x + ball.radius * 1.8, // Center X much further to the right (increased offset)
    ball.y + 1, // Same Y as ball center
    ball.radius * 1.3, // Larger radius
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

// Draw the platforms
function drawPlatforms() {
  for (const platform of platforms) {
    // Save the current context state
    ctx.save();

    // Translate to the center of the platform
    const centerX = platform.x;
    const centerY = platform.y;
    ctx.translate(centerX, centerY);

    // Rotate the context
    ctx.rotate(platform.rotation);

    // Draw the main platform body with rounded corners
    const halfWidth = platform.width / 2;
    const halfHeight = platform.height / 2;
    const radius = platform.borderRadius || 0;

    // Parse the platform color to create a matching glow
    let glowColor;
    if (platform.color.startsWith("hsl")) {
      // Extract HSL values
      const hslMatch = platform.color.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
      if (hslMatch) {
        const [_, h, s, l] = hslMatch;
        glowColor = `hsla(${h}, ${s}%, ${l}%, 0.35)`;
      } else {
        glowColor = "rgba(0, 0, 0, 0.35)"; // Fallback
      }
    } else {
      // For hex or other color formats, use the same color with opacity
      glowColor = platform.color.replace(")", ", 0.35)").replace("rgb", "rgba");
      if (!glowColor.includes("rgba")) {
        // Handle hex colors
        glowColor = "rgba(255, 255, 255, 0.35)"; // Fallback
      }
    }

    // Add a faint glow using the platform's color
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 25;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Create a rounded rectangle path
    ctx.beginPath();
    ctx.moveTo(-halfWidth + radius, -halfHeight);
    ctx.lineTo(halfWidth - radius, -halfHeight);
    ctx.arcTo(halfWidth, -halfHeight, halfWidth, -halfHeight + radius, radius);
    ctx.lineTo(halfWidth, halfHeight - radius);
    ctx.arcTo(halfWidth, halfHeight, halfWidth - radius, halfHeight, radius);
    ctx.lineTo(-halfWidth + radius, halfHeight);
    ctx.arcTo(-halfWidth, halfHeight, -halfWidth, halfHeight - radius, radius);
    ctx.lineTo(-halfWidth, -halfHeight + radius);
    ctx.arcTo(
      -halfWidth,
      -halfHeight,
      -halfWidth + radius,
      -halfHeight,
      radius
    );
    ctx.closePath();

    // Fill with platform color
    ctx.fillStyle = platform.color;
    ctx.fill();

    // Add a subtle shadow for depth
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetY = 2;

    // Add a subtle highlight on top for a polished look
    ctx.beginPath();
    ctx.moveTo(-halfWidth + radius, -halfHeight);
    ctx.lineTo(halfWidth - radius, -halfHeight);
    ctx.arcTo(halfWidth, -halfHeight, halfWidth, -halfHeight + radius, radius);
    ctx.lineTo(halfWidth, -halfHeight + 3);
    ctx.lineTo(-halfWidth, -halfHeight + 3);
    ctx.lineTo(-halfWidth, -halfHeight + radius);
    ctx.arcTo(
      -halfWidth,
      -halfHeight,
      -halfWidth + radius,
      -halfHeight,
      radius
    );
    ctx.closePath();
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.fill();

    // Reset shadow
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetY = 0;

    // Restore the context to its original state
    ctx.restore();
  }
}
