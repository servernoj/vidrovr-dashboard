# Setup

The project represents a single-page application (SPA) implemented using Vue3 (TypeScript) framework. It utilizes standard Vue3 tooling to build and run the application.

## Install dependencies

```sh
npm install
```

## Hot-Reload for Development

```sh
npm run dev
```

## Production version

### Build

```sh
npm run build
```

### Run

Production version can be served from directory `dist`. You will need a web server pointed to this directory and configured to run with properly configured `origin` (for CORS). For example:

```sh
npm i -g serve
serve -p 5173 dist
```

# Features

The application has two pages/screens: `home` and `inspector`. It has a layout styled with VidRovr branding. The logo shown at the top-left corner anchors allows for navigation to `home` page.

## Home

- Shows list of assets
- Every asset item, once clicked, results in navigation to the inspector page with that asset loaded
- Home page is implemented to be kept-alive in the memory, so navigation out and back into this page will not result in data reloading.

## Inspector

- Inspector assumes presence of asset ID in the URL, it will first assume that list of assets is loaded into memory, otherwise it will fetch the assets by analogy to `home` page. If asset pointed by URL cannot be found, the corresponding message will be displayed
- The inspector page can be reloaded, such that asset ID will be utilized to load specific asset
- Asset preview (shown at the beginning of the page) differentiates static image from video. In the latter case, video can be played back by utilizing built-in controls.
- Section `Persons appearances` represents two views of the same data
    - list of persons on the left shows all persons, sorted with respect to the counts of their appearances
    - charted view with 2 implementations
        - to show all persons with corresponding appearance counts (default)
        - to show only persons with appearance counts exceeding defined threshold (requires recompilation). Threshold value is stored in `compactChartThreshold` (file `src/views/Inspector.vue`). This mode can be activated by replacing default value `0` by actual positive  threshold. The `others` column of the chart shows summarized appearances of all "under-threshold" persons.
- Section `Video thumbnails` visualizes appearances of individual persons. Each person is associated with a filmstrip allowing to visually select (by hovering over) and preview the corresponding thumbnail.

# Tradeoffs and assumptions

- The implementation assumes happy-path of API responses and doesn't include error-handling logic.
- The given dataset does not contain `image` assets (only `video`) so the handling of image assets is implemented without testing
- The application is not optimized for mobile screens due to the need to display multimedia content side by side with contextual information. 

