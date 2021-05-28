# Link Minimization Service

## Description

### web-ui

frontend, reactjs application.  
functions:

- input long URL with validate;
- request backend, display responsed short URL.

### web-api

backend, asp.net with sqlite database.  
function:

- recive long URL, match it to short URL, return short URL;
- on recive short URL -> redirect on matched long URL.

## Set-up

### web-ui

in `link-minimization-servise/web-ui` folder:

```bash
npm i
```

## Input parameters from enviroment variable:

`WEBAPI_URLSHORTER_HOSTNAME` - if `web-api` will start on the custom hostname/port, then set in environment variable `WEBAPI_URLSHORTER_HOSTNAME` actual hostname and port (in format `https:\\localhost:5001`). by default used: `https:\\localhost:5001`

## Run

### web-ui

in `link-minimization-servise/web-ui` folder:

```bash
npm run start
```

### web-api

in `link-minimization-servise/web-api` folder:

```bash
dotnet run
```
