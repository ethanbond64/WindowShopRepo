## Overview
For Consumers: Window Shop allows viewers to purchase products seen on YouTube without leaving youtube.com

For Creators: It also allows you to direct traffic to purchase products displayed in your videos
&nbsp;
## Installation and dependencies
To run the application locally, you will need Docker and Docker Compose installed on your computer. If you don't have these already installed, I recommend installing Docker Desktop, which includes both Docker and Docker Compose.

Install Docker Desktop: https://docs.docker.com/get-docker/


## Environtment requirements
For the local server to run there are a few environment variables you need to set.

The easiest way to do this is to create a file in the main directory of this repository called `.env`

The contents of this file should look like this
```
COMPOSE_PROJECT_NAME=windowshop
POSTGRES_USER=windowshop
POSTGRES_PASSWORD=notasafepassword
DB_URI=postgresql://windowshop:notasafepassword@postgres:5432/windowshop
SERVER_NAME=localhost:8000
RAPYD_KEY={Put your Rapyd Access Key Here}
RAPYD_SECRET={Put your Rapyd Secret Key Here}
```


## Running the application
Navigate to the root directory of the project at the command line and run this command: 

` docker-compose up `

The server will take a few minutes to build and start the first time you run it. Once its running, you should be able to view the creator dashboard it in a browser at http://localhost:3000/ 

## Loading the chrome extension
Go to chrome://extensions/ while using Chrome and make sure to turn on `Developer mode`

Select the button at the top that says `Load unpacked`

Browse to this repository and select the folder `WindowShopRepo/extension/build/` 

## How to use Window Shop
A demo on how to use Window Shop can be found in this video
https://youtu.be/YHy0Vx_DI5g