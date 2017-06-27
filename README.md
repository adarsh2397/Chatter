# Chatter

A simple chatting application developed using Angular and Node.js. Angular was used for the front-end and Node.js for the backend (server). Socket.io was used to manage the flow of messages between the server and the client through it's event-driven functionality.

## Requirements

- Angular CLI
- Angular 2/4
- Node
- MySQL Database (with the correct tables)

## Things to Do
* Unseen Messages
* Typing... Functionality
* Block Members
* Improve Chat Interface
* Cache Messages
* Multiple Chat Windows

## Development server

Navigate to the server folder and run `node index` to start the server. (Note: The server won't run without the required MySQL tables already created. Functions haven't been provided for that.)

Then run `ng serve` from the parent folder for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Note: If the server isn't started, user won't be able to login.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
