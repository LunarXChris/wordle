import { useState, useEffect, useRef } from 'react'
import WordBoard from './WordBoard';
import Keyboard from '../components/Keyboard';
import { useLocation } from 'react-router-dom';
// import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import axios from 'axios';

const Game = () => {
    const stompClientRef = useRef(null);
    const [gameId, setGameId] = useState("");
    const [maxRound, setMaxRound] = useState(6);
    const [playerId, setPlayerId] = useState(0);
    const [gamePause, setGamePause] = useState(false);

    const url = 'http://localhost:8080';

    //get the passed in value from settings page
    const location = useLocation();
    console.log(location);


    var playerName = "user";
    var gameMode = "normal";
    var t_gameId = "";
    if(location.state !== null) {
        playerName = location.state.playerName;
        gameMode = location.state.gameMode;
        t_gameId = location.state.gameId;
    } 

    const displayRef = useRef(null);

    useEffect(() => {

        if(gameMode === "multiplayer") {
            connectToGame();
        } else {
            createGame();
        }

    }, []);

    function refreshWordBoard(word: String, result: String) {
        const wordBoard = displayRef.current;
        console.log("word: " + word + " result" + result);
        
        wordBoard.setWordInput(word);
        wordBoard.setInputValue("enter_" + result);
    }

    function connectToSocket(gameId: string, playerId: number, maxRound: number) {
        console.log("connecting to the game");
        const socket = new SockJS(url + '/ws');
        const stompClient = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            debug: (str) => {
                console.log(str);
            },
            onConnect: () => {
                console.log('Connected to WebSocket');
                stompClient.subscribe('/topic/game-progress/' + gameId, (response) => {
                    console.log('Received message:', response.body);
                    
                    var data = JSON.parse(response.body);

                    if(data.word === "") {
                        alert("Game start! Your turn");
                        setGamePause(false);
                    } else {
                        // update the wordboard
                        refreshWordBoard(data.word, data.result);

                        console.log("max round: " + maxRound);
                        console.log("current row:" + displayRef.current.row);
                        // check if this is your turn
                        if(data.playerTurn === playerId) {
                            console.log(typeof JSON.parse(response.body));
                            console.log("playTurn: " + data.playTurn);
                            console.log("your playerId: " + playerId);
                            if(data.result === "BBBBB") {
                                alert("Opponent Win!")
                            } else if(displayRef.current.row === maxRound - 1) {
                                getChosenWord(gameId);
                            } else{
                                alert("Your turn");
                                setGamePause(false);
                            }
                        } else {
                            console.log(typeof JSON.parse(response.body));
                            console.log("playTurn: " + data.playTurn);
                            console.log("your playerId: " + playerId);
                            if(data.result !== "BBBBB" && displayRef.current.row < maxRound - 1) {
                                alert("Opponnet turn");
                                setGamePause(true);
                            }
                        }
                    }
                    
                });
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        });

        stompClient.activate();
        stompClientRef.current = stompClient;
    }

    function createGame() {
        axios.post(url + '/create', {
            'playerName': playerName,
            'gameMode': gameMode
        }).then(function (response) {
            console.log(response.data);
            // set gameId
            setGameId(response.data.game.gameId);
            // set playerId
            setPlayerId(response.data.playerId);
            // set number of round
            setMaxRound(response.data.maxRound);
            displayRef.current.setLayout(response.data.maxRound);
        }).catch(function (error) {
            console.log(error);
        });

    }

    function connectToGame() {
        axios.post(url + '/connect', {
            'playerName': playerName,
            'gameId': t_gameId
        }).then(function (response) {
            console.log(response.data);

            //set playerId
            setPlayerId(response.data.playerId);
            // set number of round
            setMaxRound(response.data.maxRound);
            displayRef.current.setLayout(response.data.maxRound);

            // set up websocket
            setGameId(response.data.game.gameId);
            connectToSocket(response.data.game.gameId, response.data.playerId, response.data.maxRound);

            // For player 1, wait for another player and disable the handler of keyboard component
            // For player 2, start the game;
            if(response.data.playerId === 1) {
                setGamePause(true);
                // alert("Please wait for another player");
            } else {
                setGamePause(true);
                alert("Game starts! Opponent Turn");
            }
        }).catch(function (error) {
            console.log(error);
        })
    }

    function validateWord(word: string, wordBoard) {
        console.log("Your id:" + playerId);
        var link = '/check';

        if(gameMode === "multiplayer") {
            link = "/ws";
        }
        axios.post(url + link, {
            'playerName': playerName,
            'gameId': gameId,
            'word': word,
            'playerId': playerId
        }).then(function (response) {
            console.log(response);
            console.log("matching result: " + response.data);
                        
            const changeCommand = "enter_" + response.data;
            // check if the player has win or lose the game
            if(response.data == "BBBBB") {
                setGamePause(true);
                alert("You win!");
            } else if(wordBoard.row == maxRound - 1) {
                setGamePause(true);
                getChosenWord(gameId);
            }
            // display matching result on screen
            wordBoard.setInputValue(changeCommand);
        }).catch(function (error) {
            console.log(error);
            
        })
    }

    function getChosenWord(gameId: String) {
        axios.post( url + "/getChosenWord", {
            'playerName': playerName,
            'gameId': gameId
        }).then(function(response) {
            console.log(response.data);
            if(gameMode === "multiplayer") {
                alert("Draw! The answer is " + response.data);
            } else {
                alert("You lose! The answer is " + response.data);
            }
        }).catch(function(error) {
            console.log(error);
        })
    }
    
    function handleClick(e) {
        if(!gamePause) {
            const {nodeName, textContent} = e.target;
            if(nodeName === "BUTTON") {
                if(textContent == "Enter") {
                    const wordBoard = displayRef.current;
                    if(wordBoard && wordBoard.col == 5) {
                        // check if input matches the chosen word
                        // const matchingResult = checkWord(wordBoard.word);

                        validateWord(wordBoard.word, wordBoard);
                        
                    }
                } else {
                    // retrieve the value of the pressed key
                    const keyValue = e.target.getAttribute("data-key");
                    const wordBoard = displayRef.current;
                    // display the input key on screen
                    if(wordBoard) {
                        wordBoard.setInputValue(keyValue);
                    }
                }
            }
        }
    }
    

    return (
        <main id="mainDisplay" onClick={handleClick}>
            <div>
                Hi, {playerName}! Welcome to game room: {gameId}!
            </div>
            <WordBoard ref={displayRef} />
            <Keyboard/>
        </main>
    )
}

export default Game