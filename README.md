# Basketball Physics Simulation

A modular JavaScript physics engine that simulates a basketball with realistic physics including gravity, air resistance, bouncing, and surface friction.

## Features

- Realistic basketball simulation with gravity and air resistance
- Tarmac surface with appropriate friction
- Visual trail effects for fast movement
- Charge-and-release gameplay mechanic
- Responsive design that adapts to window size

## Project Structure

The codebase is organized into separate modules following modern JavaScript practices:

- `src/constants.js` - Shared constants, configuration, and state
- `src/ball.js` - Ball physics calculations and state updates
- `src/renderer.js` - Canvas drawing functions for visual elements
- `src/input.js` - User interaction handlers (mouse events)
- `src/engine.js` - Main physics engine and animation loop
- `src/main.js` - Entry point for the application

## Physics Components

- **Gravity**: Constant downward acceleration
- **Air Resistance**: Calculated based on air density, velocity, drag coefficient, and cross-sectional area
- **Surface Friction**: Different friction values for different surfaces
- **Collision Detection**: Boundary collisions with walls and floor
- **Rotational Physics**: Ball rotation affected by collisions and rolling

## How to Use

1. Open `index.html` in a web browser
2. Click and drag on the basketball to charge it
3. Release to launch the ball with the direction and power indicated by the arrow
4. The ball will interact with boundaries and surfaces realistically

## Development

The modular structure allows for easy extension:

- Add new surfaces by extending the `surfaces` object in `constants.js`
- Implement new physics behaviors in `ball.js`
- Create additional visual effects in `renderer.js`

## Files

- `index.html` - The main HTML file
- `styles.css` - CSS styling for the canvas and page layout
- `ball.js` - JavaScript implementation of the custom physics engine

## Customization

You can modify the physics parameters in the `ball.js` file:

- `gravity` - Controls how fast the ball accelerates downward
- `friction` - Controls how quickly horizontal movement slows down
- `restitution` - Controls how bouncy the ball is (0-1 range)
