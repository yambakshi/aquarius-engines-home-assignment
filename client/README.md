# IoT Monitor - Client

## Technologies

This project was generated with:
- [Angular CLI](https://github.com/angular/angular-cli) 12.2.10
- Typescript 4.3.5
- NodeJS 12.14.1
- NPM 6.13.4

## Setup
1. `cd` into the project's root folder
   ```
   cd <project_folder>
   mkdir client
   ```

2. Install `Angular CLI` ([official instructions](https://angular.io/guide/setup-local))
   ```
   npm install -g @angular/cli@12.2.10
   ```

3. Create `client` app
   ```
   ng new client
   ```

   1. Input `y` when asked `Would you like to add Angular routing? (y/N)`
   2. Select `SCSS` when asked `Which stylesheet format would you like to use?`

4. `cd` into the `client` folder and add `Material UI` ([official instructions](https://material.angular.io/guide/getting-started))
   ```
   cd client
   ng add @angular/material
   ```

   1. Input `Y` when asked `Would you like to proceed? (Y/n)`
   2. Select `Indigo/Pink` when asked `Choose a prebuilt theme name, or "custom" for a custom theme: (Use arrow keys)`
   3. Input `y` when asked `Set up global Angular Material typography styles? (y/N)`
   4. Input `Y` when asked `Set up browser animations for Angular Material? (Y/n)`

5. Add `Angular Universal` (SSR) ([official instructions](https://angular.io/guide/universal)) - Optional
   ```
   ng add @nguniversal/express-engine
   ```

6. Add `NgRx` (state management) ([official instructions](https://ngrx.io/guide/store/install)) - Optional
   ```
   ng add @ngrx/store@12.5.1
   ```

## Development server
### Client-side Rendering
Run `ng serve` for a dev server.

### Server-side Rendering
Run `npm run dev:ssr`

Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build
### Client-side Rendering
Run `ng build` to build the project.

### Server-side Rendering
Run `npm run build:ssr`

The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
