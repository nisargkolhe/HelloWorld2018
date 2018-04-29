# Hello World 2018

This repository contains the source code for Hello World 2018's application portal and admin panel.

## Running Locally

### Backend API:
* `cd backend`
* Run `npm i` to install dependencies.
* Run `npm start` to serve the API(by default on port 3000).
* For testing production build:
	* Go back to frontend directory `cd ../frontend`.
	* Compile Angular by running `ng build`.
	* Website will be up on `http://localhost:3000`.

### Frontend (Development Only):
* `cd frontend`
* Install [Angular CLI](https://github.com/angular/angular-cli) by running `npm install -g @angular/cli`
*  Run `npm i` to install dependencies.
*  Make sure backend is running on port 3000.
*  Run `ng serve` to serve the frontend(by default on port 4200).

## Deployment

Compile Angular by running `ng build --prod` to make requests to `https://api.helloworld.purduehackers.com` instead of `localhost`.