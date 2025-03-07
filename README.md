# Basketball Physics Simulation

A custom physics engine simulation of a basketball bouncing within screen boundaries.

## Features

- Custom physics engine implementation
- Realistic basketball bouncing with gravity and collision detection
- Basketball with visual details (orange color with black lines)
- Interactive - click anywhere to apply force to the basketball
- Responsive design that adapts to window resizing

## Physics Concepts Implemented

- Gravity acceleration
- Collision detection and response
- Friction (air resistance)
- Restitution (bounciness)
- Vector-based force application

## How to Run

1. Open the `index.html` file in a web browser
2. Watch the basketball bounce around the screen
3. Click anywhere to apply force to the basketball in that direction

## Files

- `index.html` - The main HTML file
- `styles.css` - CSS styling for the canvas and page layout
- `ball.js` - JavaScript implementation of the custom physics engine

## Customization

You can modify the physics parameters in the `ball.js` file:

- `gravity` - Controls how fast the ball accelerates downward
- `friction` - Controls how quickly horizontal movement slows down
- `restitution` - Controls how bouncy the ball is (0-1 range)
