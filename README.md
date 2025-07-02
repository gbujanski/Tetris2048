# Tetris2048

Tetris2048 is a puzzle game that combines mechanics from Tetris and 2048. You place numbered tiles on a board, with each new tile automatically placed in the next available spot from the top. When a tile is adjacent (top, left, right, or bottom) to another tile with the same value, they merge into a single tile with the next power of 2.

## How to Build

1. Make sure you have [Node.js](https://nodejs.org/) (v16 or newer) and [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) installed.
2. Clone the repository and install dependencies:

    ```bash
    git clone https://github.com/your-username/tetris2024.git
    cd tetris2024
    npm install
    # or
    yarn install
    ```

3. Build the app for production:

    ```bash
    npm run build
    # or
    yarn build
    ```

    The build output will be in the `dist` directory.

## Development Server

Start the development server with:

```bash
npm run dev
# or
yarn dev
```

Then open `http://localhost:3000` in your browser.


## This project is currently under development And may contain bugs or incomplete functionality.

#### Working features:
- Add new tile
- Merge adjacent tiles

#### Planned features:
- Move tiles up after merge if tiles above are empty
- Merge animations
- Unit tests

# License

This project is licensed under the MIT License.
