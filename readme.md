<!-- Source: Best-README-Template BLANK_README (Unlicense) — https://github.com/othneildrew/Best-README-Template -->
<a id="readme-top"></a>

# AirplaneGame

A browser arcade shooter built with PixiJS and TypeScript, where the player's plane auto-fires at waves of enemy planes spawning from the top of the screen.

**English** · [简体中文](README.zh-CN.md)

[![CI](https://github.com/anyingiit/AirplaneGame/actions/workflows/ci.yml/badge.svg)](https://github.com/anyingiit/AirplaneGame/actions/workflows/ci.yml)
[![License](https://img.shields.io/github/license/anyingiit/AirplaneGame)](LICENSE)

[Report a bug](https://github.com/anyingiit/AirplaneGame/issues/new?template=bug_report.yml) · [Request a feature](https://github.com/anyingiit/AirplaneGame/issues/new?template=feature_request.yml)

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About The Project

AirplaneGame is a top-down shoot-'em-up rendered with [pixi.js](https://pixijs.com/) 4.8.2. The player's plane follows the mouse across a fixed 512x768 canvas while `src/js/index.ts`'s game loop auto-fires bullets, spawns a random number of enemy planes off the top of the screen, and checks every bullet against every enemy with simple circle-distance collision.

Destroying an enemy adds to the score shown in the corner. Flying through a falling pickup raises the fire rate and, at two thresholds, swaps the plane's sprite for a visibly upgraded one; colliding with an enemy plane instead pauses the game behind a translucent mask with a continue button. There is no win condition or menu -- the game runs until the player crashes.

The repository ships two things side by side: `src/` is the source the build compiles from, and `docs/` is a pre-built copy (bundle and assets) kept there so GitHub Pages can serve the game directly without a build step.

## Getting Started

### Prerequisites

- Node.js and npm, to install the dependencies `package.json` declares --
  pixi.js itself plus the webpack toolchain (`webpack`, `ts-loader`,
  `html-webpack-plugin`, `copy-webpack-plugin`, `clean-webpack-plugin`,
  `image-minimizer-webpack-plugin`) that turns `src/` into a runnable bundle

### Installation

```sh
git clone https://github.com/anyingiit/AirplaneGame.git
cd AirplaneGame
npm install
```

The repository also commits `yarn.lock`; `yarn install` reads it directly and
is what continuous integration uses for a reproducible build.

## Usage

Run the development server, which rebuilds on save and serves the game with source maps:

```sh
npm run dev
```

Open `http://localhost:9000` in a browser -- move the mouse over the canvas to steer the plane.

To build the production bundle into `dist/` and preview exactly what ships:

```sh
npm run build
npm run start
```

`npm run start` serves `dist/` with `http-server`, which prints the local URL it picked (`http://localhost:8080` by default).

## Contributing

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) for how to open an issue or a pull request, and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) for the standards expected of everyone taking part.

Please do not report security issues in public issues or pull requests. [SECURITY.md](SECURITY.md) explains how to report them privately.

## License

Distributed under the MIT License. See [LICENSE](LICENSE) for details.

## Contact

Project link: [https://github.com/anyingiit/AirplaneGame](https://github.com/anyingiit/AirplaneGame)

<p align="right">(<a href="#readme-top">back to top</a>)</p>
