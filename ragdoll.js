// Ragdoll Physics Simulation

// Ragdoll joints and body parts
const ragdoll = {
  // Joints (connection points)
  joints: {
    neck: {
      x: canvas.width / 2,
      y: canvas.height / 2 - 85,
      velocityX: 0,
      velocityY: 0,
      fixed: false,
      mass: 0.1,
    },
    shoulder: {
      x: canvas.width / 2,
      y: canvas.height / 2 - 65,
      velocityX: 0,
      velocityY: 0,
      fixed: false,
      mass: 0.2,
    },
    leftElbow: {
      x: canvas.width / 2 - 15,
      y: canvas.height / 2 - 65,
      velocityX: 0,
      velocityY: 0,
      fixed: false,
      mass: 0.1,
    },
    rightElbow: {
      x: canvas.width / 2 + 15,
      y: canvas.height / 2 - 65,
      velocityX: 0,
      velocityY: 0,
      fixed: false,
      mass: 0.1,
    },
    pelvis: {
      x: canvas.width / 2,
      y: canvas.height / 2 - 35,
      velocityX: 0,
      velocityY: 0,
      fixed: false,
      mass: 0.3,
    },
    leftKnee: {
      x: canvas.width / 2 - 10,
      y: canvas.height / 2 - 10,
      velocityX: 0,
      velocityY: 0,
      fixed: false,
      mass: 0.1,
    },
    rightKnee: {
      x: canvas.width / 2 + 10,
      y: canvas.height / 2 - 10,
      velocityX: 0,
      velocityY: 0,
      fixed: false,
      mass: 0.1,
    },
    leftHand: {
      x: canvas.width / 2 - 30,
      y: canvas.height / 2 - 60,
      velocityX: 0,
      velocityY: 0,
      fixed: false,
      mass: 0.05,
    },
    rightHand: {
      x: canvas.width / 2 + 30,
      y: canvas.height / 2 - 60,
      velocityX: 0,
      velocityY: 0,
      fixed: false,
      mass: 0.05,
    },
    leftFoot: {
      x: canvas.width / 2 - 20,
      y: canvas.height / 2 + 15,
      velocityX: 0,
      velocityY: 0,
      fixed: false,
      mass: 0.05,
    },
    rightFoot: {
      x: canvas.width / 2 + 20,
      y: canvas.height / 2 + 15,
      velocityX: 0,
      velocityY: 0,
      fixed: false,
      mass: 0.05,
    },
  },

  // Head (special case - not a joint but a circular body part)
  head: {
    x: canvas.width / 2,
    y: canvas.height / 2 - 100,
    radius: 15,
    velocityX: 0,
    velocityY: 0,
    mass: 0.3,
    restitution: 0.7,
  },

  // Constraints (connections between joints)
  constraints: [
    // Head to neck
    {
      joint1: "head",
      joint2: "neck",
      length: 15,
      stiffness: 0.8,
      damping: 0.3,
    },

    // Torso (neck to shoulder to pelvis)
    {
      joint1: "neck",
      joint2: "shoulder",
      length: 20,
      stiffness: 0.9,
      damping: 0.5,
    },
    {
      joint1: "shoulder",
      joint2: "pelvis",
      length: 30,
      stiffness: 0.9,
      damping: 0.5,
    },

    // Left arm (shoulder to elbow to hand)
    {
      joint1: "shoulder",
      joint2: "leftElbow",
      length: 15,
      stiffness: 0.7,
      damping: 0.3,
    },
    {
      joint1: "leftElbow",
      joint2: "leftHand",
      length: 15,
      stiffness: 0.7,
      damping: 0.3,
    },

    // Right arm (shoulder to elbow to hand)
    {
      joint1: "shoulder",
      joint2: "rightElbow",
      length: 15,
      stiffness: 0.7,
      damping: 0.3,
    },
    {
      joint1: "rightElbow",
      joint2: "rightHand",
      length: 15,
      stiffness: 0.7,
      damping: 0.3,
    },

    // Left leg (pelvis to knee to foot)
    {
      joint1: "pelvis",
      joint2: "leftKnee",
      length: 25,
      stiffness: 0.8,
      damping: 0.4,
    },
    {
      joint1: "leftKnee",
      joint2: "leftFoot",
      length: 25,
      stiffness: 0.8,
      damping: 0.4,
    },

    // Right leg (pelvis to knee to foot)
    {
      joint1: "pelvis",
      joint2: "rightKnee",
      length: 25,
      stiffness: 0.8,
      damping: 0.4,
    },
    {
      joint1: "rightKnee",
      joint2: "rightFoot",
      length: 25,
      stiffness: 0.8,
      damping: 0.4,
    },
  ],

  // Angle constraints to prevent unnatural joint bending
  angleConstraints: [
    // Left elbow (can only bend inward)
    {
      joint1: "shoulder",
      joint2: "leftElbow",
      joint3: "leftHand",
      minAngle: Math.PI * 0.5, // 90 degrees
      maxAngle: Math.PI * 1.8, // 324 degrees
      stiffness: 0.5,
    },

    // Right elbow (can only bend inward)
    {
      joint1: "shoulder",
      joint2: "rightElbow",
      joint3: "rightHand",
      minAngle: Math.PI * 0.2, // 36 degrees
      maxAngle: Math.PI * 1.5, // 270 degrees
      stiffness: 0.5,
    },

    // Left knee (can only bend backward)
    {
      joint1: "pelvis",
      joint2: "leftKnee",
      joint3: "leftFoot",
      minAngle: Math.PI * 0.5, // 90 degrees
      maxAngle: Math.PI * 1.8, // 324 degrees
      stiffness: 0.7,
    },

    // Right knee (can only bend backward)
    {
      joint1: "pelvis",
      joint2: "rightKnee",
      joint3: "rightFoot",
      minAngle: Math.PI * 0.5, // 90 degrees
      maxAngle: Math.PI * 1.8, // 324 degrees
      stiffness: 0.7,
    },

    // Neck (limited rotation)
    {
      joint1: "shoulder",
      joint2: "neck",
      joint3: "head",
      minAngle: Math.PI * 0.7, // 126 degrees
      maxAngle: Math.PI * 1.3, // 234 degrees
      stiffness: 0.8,
    },

    // Torso (limited bending)
    {
      joint1: "neck",
      joint2: "shoulder",
      joint3: "pelvis",
      minAngle: Math.PI * 0.7, // 126 degrees
      maxAngle: Math.PI * 1.3, // 234 degrees
      stiffness: 0.9,
    },
  ],

  // Global physics properties
  gravity: 0.5,
  friction: 0.98,
  airDensity: 0.0003,
  dragCoefficient: 0.47,
  isOnGround: false,
};

// Draw the ragdoll
function drawRagdoll() {
  // Set the color to white
  ctx.strokeStyle = "white";
  ctx.fillStyle = "white";
  ctx.lineWidth = 3;

  // Draw head
  ctx.beginPath();
  ctx.arc(ragdoll.head.x, ragdoll.head.y, ragdoll.head.radius, 0, Math.PI * 2);
  ctx.fill();

  // Draw all constraints (body parts)
  for (const constraint of ragdoll.constraints) {
    const joint1 =
      constraint.joint1 === "head"
        ? ragdoll.head
        : ragdoll.joints[constraint.joint1];
    const joint2 = ragdoll.joints[constraint.joint2];

    ctx.beginPath();
    ctx.moveTo(joint1.x, joint1.y);
    ctx.lineTo(joint2.x, joint2.y);
    ctx.stroke();
  }

  // Draw joints (optional - for debugging)
  /*
  ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
  for (const jointName in ragdoll.joints) {
    const joint = ragdoll.joints[jointName];
    ctx.beginPath();
    ctx.arc(joint.x, joint.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
  */
}

// Apply physics to a joint
function applyPhysics(joint) {
  // Apply gravity
  joint.velocityY += ragdoll.gravity * joint.mass;

  // Apply air resistance
  const velocity = Math.sqrt(
    joint.velocityX * joint.velocityX + joint.velocityY * joint.velocityY
  );
  if (velocity > 0) {
    const dragForceX =
      0.5 *
      ragdoll.airDensity *
      velocity *
      velocity *
      ragdoll.dragCoefficient *
      (joint.velocityX / velocity);
    const dragForceY =
      0.5 *
      ragdoll.airDensity *
      velocity *
      velocity *
      ragdoll.dragCoefficient *
      (joint.velocityY / velocity);

    joint.velocityX -= dragForceX / joint.mass;
    joint.velocityY -= dragForceY / joint.mass;
  }

  // Update position (if not fixed)
  if (!joint.fixed) {
    joint.x += joint.velocityX;
    joint.y += joint.velocityY;
  }

  // Check for ground collision
  if (joint.y > canvas.height - 10) {
    joint.y = canvas.height - 10;
    joint.velocityY = -joint.velocityY * 0.5; // Restitution
    joint.velocityX *= ragdoll.friction;

    ragdoll.isOnGround = true;
  }

  // Check for wall collisions
  if (joint.x < 0) {
    joint.x = 0;
    joint.velocityX = -joint.velocityX * 0.5; // Restitution
  } else if (joint.x > canvas.width) {
    joint.x = canvas.width;
    joint.velocityX = -joint.velocityX * 0.5; // Restitution
  }
}

// Calculate angle between three joints (in radians)
function calculateAngle(joint1, joint2, joint3) {
  // Calculate vectors
  const v1x = joint1.x - joint2.x;
  const v1y = joint1.y - joint2.y;
  const v2x = joint3.x - joint2.x;
  const v2y = joint3.y - joint2.y;

  // Calculate dot product
  const dotProduct = v1x * v2x + v1y * v2y;

  // Calculate magnitudes
  const v1Mag = Math.sqrt(v1x * v1x + v1y * v1y);
  const v2Mag = Math.sqrt(v2x * v2x + v2y * v2y);

  // Calculate angle
  let angle = Math.acos(dotProduct / (v1Mag * v2Mag));

  // Determine direction using cross product
  const crossProduct = v1x * v2y - v1y * v2x;
  if (crossProduct < 0) {
    angle = 2 * Math.PI - angle;
  }

  return angle;
}

// Apply angle constraints to prevent unnatural joint bending
function applyAngleConstraints() {
  for (const constraint of ragdoll.angleConstraints) {
    const joint1 =
      constraint.joint1 === "head"
        ? ragdoll.head
        : ragdoll.joints[constraint.joint1];
    const joint2 = ragdoll.joints[constraint.joint2];
    const joint3 =
      constraint.joint3 === "head"
        ? ragdoll.head
        : ragdoll.joints[constraint.joint3];

    // Calculate current angle
    const angle = calculateAngle(joint1, joint2, joint3);

    // Check if angle is outside allowed range
    if (angle < constraint.minAngle || angle > constraint.maxAngle) {
      // Calculate target angle (closest allowed angle)
      const targetAngle =
        angle < constraint.minAngle ? constraint.minAngle : constraint.maxAngle;

      // Calculate correction angle
      const correction = (targetAngle - angle) * constraint.stiffness;

      // Apply rotation to bring joint3 to the allowed angle
      // We'll rotate joint3 around joint2
      const rotateJoint = (j3, j2, rotationAngle) => {
        // Translate to origin
        const tempX = j3.x - j2.x;
        const tempY = j3.y - j2.y;

        // Rotate
        const cos = Math.cos(rotationAngle);
        const sin = Math.sin(rotationAngle);
        const rotatedX = tempX * cos - tempY * sin;
        const rotatedY = tempX * sin + tempY * cos;

        // Translate back
        j3.x = j2.x + rotatedX;
        j3.y = j2.y + rotatedY;

        // Adjust velocity to match the new direction
        const vx = j3.velocityX;
        const vy = j3.velocityY;
        j3.velocityX = vx * cos - vy * sin;
        j3.velocityY = vx * sin + vy * cos;
      };

      // Apply rotation
      rotateJoint(joint3, joint2, correction);
    }
  }
}

// Satisfy a constraint between two joints
function satisfyConstraint(constraint) {
  // Get the joints
  const joint1 =
    constraint.joint1 === "head"
      ? ragdoll.head
      : ragdoll.joints[constraint.joint1];
  const joint2 = ragdoll.joints[constraint.joint2];

  // Calculate the distance between joints
  const dx = joint2.x - joint1.x;
  const dy = joint2.y - joint1.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // If distance is not zero, normalize the direction
  if (distance > 0) {
    const nx = dx / distance;
    const ny = dy / distance;

    // Calculate the difference from the constraint length
    const diff = (distance - constraint.length) * constraint.stiffness;

    // Calculate the mass ratio for distributing the correction
    const totalMass = joint1.mass + joint2.mass;
    const joint1Ratio = joint2.mass / totalMass;
    const joint2Ratio = joint1.mass / totalMass;

    // Apply position correction
    if (!joint1.fixed) {
      joint1.x += nx * diff * joint1Ratio;
      joint1.y += ny * diff * joint1Ratio;
    }

    if (!joint2.fixed) {
      joint2.x -= nx * diff * joint2Ratio;
      joint2.y -= ny * diff * joint2Ratio;
    }

    // Apply velocity damping
    const relVelX = joint2.velocityX - joint1.velocityX;
    const relVelY = joint2.velocityY - joint1.velocityY;

    // Project relative velocity onto constraint direction
    const relVelProj = relVelX * nx + relVelY * ny;

    // Apply damping
    const dampingFactor = constraint.damping;

    if (!joint1.fixed) {
      joint1.velocityX += nx * relVelProj * dampingFactor * joint1Ratio;
      joint1.velocityY += ny * relVelProj * dampingFactor * joint1Ratio;
    }

    if (!joint2.fixed) {
      joint2.velocityX -= nx * relVelProj * dampingFactor * joint2Ratio;
      joint2.velocityY -= ny * relVelProj * dampingFactor * joint2Ratio;
    }
  }
}

// Update ragdoll position
function updateRagdoll() {
  // Apply physics to head
  applyPhysics(ragdoll.head);

  // Apply physics to all joints
  for (const jointName in ragdoll.joints) {
    applyPhysics(ragdoll.joints[jointName]);
  }

  // Satisfy constraints multiple times for stability
  for (let i = 0; i < 5; i++) {
    for (const constraint of ragdoll.constraints) {
      satisfyConstraint(constraint);
    }

    // Apply angle constraints after distance constraints
    applyAngleConstraints();
  }
}

// Add click event to apply force to ragdoll
canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;

  // Apply force to head
  applyForceToJoint(ragdoll.head, clickX, clickY, 1.0);

  // Apply force to all joints
  for (const jointName in ragdoll.joints) {
    const joint = ragdoll.joints[jointName];
    applyForceToJoint(joint, clickX, clickY, 0.8);
  }
});

// Helper function to apply force to a joint
function applyForceToJoint(joint, clickX, clickY, forceMultiplier) {
  // Calculate direction vector from click to joint
  const dx = joint.x - clickX;
  const dy = joint.y - clickY;

  // Normalize and scale the force
  const distance = Math.sqrt(dx * dx + dy * dy);
  const maxForce = 10;
  const force = Math.min(maxForce, 100 / (distance + 10)) * forceMultiplier;

  if (distance > 0) {
    joint.velocityX += (dx / distance) * force;
    joint.velocityY += (dy / distance) * force;
  }
}

// Initialize the ragdoll with some random movement
ragdoll.head.velocityX = (Math.random() - 0.5) * 2;
ragdoll.head.velocityY = -5; // Initial upward velocity

// Apply initial velocity to all joints
for (const jointName in ragdoll.joints) {
  const joint = ragdoll.joints[jointName];
  joint.velocityX = ragdoll.head.velocityX * 0.9;
  joint.velocityY = ragdoll.head.velocityY * 0.9;
}

// Modify the existing animation loop in ball.js
const originalAnimate = animate;
animate = function () {
  updateBall();
  updateTrail();
  drawBall();

  // Add ragdoll animation
  updateRagdoll();
  drawRagdoll();

  requestAnimationFrame(animate);
};

// Handle window resize for ragdoll
window.addEventListener("resize", function () {
  // Update ragdoll position if needed
  if (ragdoll.head.x > canvas.width) {
    ragdoll.head.x = canvas.width - ragdoll.head.radius;
  }
  if (ragdoll.head.y > canvas.height) {
    ragdoll.head.y = canvas.height - 10 - ragdoll.head.radius;
  }

  // Update joint positions if needed
  for (const jointName in ragdoll.joints) {
    const joint = ragdoll.joints[jointName];
    if (joint.x > canvas.width) joint.x = canvas.width;
    if (joint.y > canvas.height - 10) joint.y = canvas.height - 10;
  }
});
