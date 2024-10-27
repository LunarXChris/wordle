## Wordle

Here is the complete walk-through about this implementation. The goal is to design and develop both standalone, server-client, host-cheating and interactive version of Wordle using String boot, WebSocket and ReactJs.

##  Technologies

- `String Boot`
- `WebSockeet` for stable connect to the server for broadcasting message to clients in multiplayer mode
- `MongoDB Altas` for persisting the Game information with easy and simple set up
- `ReactJs` for front-end UI logics and rest client service
- `Vite` for faster building of nodeJs project

## Project Directory Structure

- `wordle-task1` contains the stand-alone version of Wordle game
- `wordle-react` contains the client-side code for Wordle game
- `wordleGame` contains the server-side code for Wordle game

## How to build Front-end code

Here we are using npm to build the project. Please install nodejs version 20 LTS beforehand.

Check out the guide provided by official website: https://nodejs.org/en/download/package-manager

```bash
# suppose you have installed nodejs 20 already
# let start with project building

# using vite as build tool
npm create vite [projectName]
cd [projectName]

# install several packages
npm install axios
npm install @fortawesome/react-fontawesome
npm install @fortawesome/free-solid-svg-icons
npm install react-router-dom
npm install @stomp/stompjs

# run the code using vite
# the game can be access on web browser at localhost:5173
npm run dev
```

## How to build the back-end code

Go to website of Spring boot initializr: https://start.spring.io/

Select the project configuration:

- `builder tool` : gradle-kotlin for me
- `language`: Java (21 for me)
- `spring boot version`: 3.35 for me

Search and includes these dependencies:

- `spring web`
- `spring data MongoDB`
- `spring boot devtools`
- `lombok`
-  `websocket`
- `spring dotenv`: need to include manually (https://github.com/paulschwarz/spring-dotenv)

Generate the project configuration or copy the setting to IDE.

If you are using Intellij Idea, click build and then it's done.

## Database Configuration

Suppose you have already had an account on MongoDB Altas cloud service.

Open the .env file in the resources directory. In the submission, only  a template named .env.example is uploaded. 

Create a .env file, configure the following

```
MONGO_DATABASE= [your database name on Altas]
MONGO_USER= [your user name on Altas]
MONGO_PASSWORD= [your password on Altas]
MONGO_CLUSTER= [your cluster on Altas]
```

Go to application.properties file, add these lines

```
spring.data.mongodb.database=${MONGO_DATABASE}
spring.data.mongodb.uri=mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_CLUSTER}
```

## Custom Configuration

1. Maximum round of guess: check out the .env file and input a number

   ```
   // example
   MAX_ROUND=8
   ```

2. Dictionary of 5-letter words: go to the resources file, find Words.txt and add any words in the file

## How to play

<img width="641" alt="gameDisplay" src="https://github.com/user-attachments/assets/4115beee-cd8c-47f8-89fe-7a55fae91fb0">


####  Set up

Set Up for stand-alone version:

1. word list (optional)
2. maximum round of guess (optional)

Set Up for server-client version:

1. Game mode: normal, hard (host-cheating), multiplayer(host-cheating)
2.  Player name
3. Game Id (optional, connect to specific game room)

#### In-game

1. click the keyboard buttons on the browser
2. after enter 5 characters, click the enter button for word validation
3. the validation result will show on the word board, where Blue indicates Hit, Yellow indicates Present and Grey indicates Misses.

## Things about the development

The requirement is to develop 4 different version of wordle - standalone, client-server, host-cheating and multiplayer mode. I think these can be integrated into a single server-client model with all features implemented. First, I starts with both server and client side in parallel and then separate the client side code as task 1. Then I keep on developing the remaining features.

This approach has the advantages of reusing code. For instance, when I was thinking what the multiplayer mode should be like, the normal and hosting-cheating mode are both available for me. I can actually provided two options for the user (but not implemented). If there is more variations of wordle, then the code can be upgraded easily.

There is also drawbacks of this approach. Unlike separating into 4 different applications, new features added on the existing code may require more changes on existing code, for example, the changes on implementation of java class, game client logic, server logic and etc. It may requires more time on development, debugging and testing.    

## Things to improve

1. Better UI on client side using libraries.
   - material UI
   - Bootstrap
2. Set timeout for each player (30 second for input) to improve user experience
