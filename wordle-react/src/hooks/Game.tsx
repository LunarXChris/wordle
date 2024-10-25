import { useState, useEffect, useRef } from 'react'
import WordBoard from './WordBoard';
import Keyboard from '../components/Keyboard';
import { useLocation } from 'react-router-dom';
import SockJS from 'sockjs-client'
import { Client } from '@stomp/stompjs';
import axios from 'axios';

const Game = () => {
    const stompClientRef = useRef(null);
    const [gameId, setGameId] = useState("");
    const [maxRound, setMaxRound] = useState(6);

    const url = 'http://localhost:8080';

    var gameEnd: boolean = false;

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
            // set up websocket
            // connectToSocket(gameId);
        } else {
            createGame();
        }

    }, []);

    // function connectToSocket(gameId: string) {
    //     console.log("connecting to the game");
    //     const socket = new SockJS(url + '/ws');
    //     const stompClient = new Client({
    //         webSocketFactory: () => socket,
    //         reconnectDelay: 5000,
    //         debug: (str) => {
    //             console.log(str);
    //         },
    //         onConnect: () => {
    //             console.log('Connected to WebSocket');
    //             stompClient.subscribe('/topic/game-progress/' + gameId, (response) => {
    //                 console.log('Received message:', response.body);
    //                 let data = JSON.parse(response.body);
    //             });
    //         },
    //         onStompError: (frame) => {
    //             console.error('Broker reported error: ' + frame.headers['message']);
    //             console.error('Additional details: ' + frame.body);
    //         },
    //     });

    //     stompClient.activate();
    //     stompClientRef.current = stompClient;
    // }

    function createGame() {
        axios.post(url + '/create', {
            'playerName': playerName,
            'gameMode': gameMode
        }).then(function (response) {
            console.log(response.data);
            setGameId(response.data.game.gameId);
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
            setGameId(response.data.game.gameId);
            // set number of round
            setMaxRound(response.data.maxRound);
            displayRef.current.setLayout(response.data.maxRound);
        }).catch(function (error) {
            console.log(error);
        })
    }

    function validateWord(word: string, wordBoard) {
        axios.post(url + '/check', {
            'playerName': playerName,
            'gameId': gameId,
            'word': word
        }).then(function (response) {
            console.log(response);
            console.log("matching result: " + response.data);
                        
            const changeCommand = "enter_" + response.data;
            // check if the player has win or lose the game
            if(response.data == "BBBBB") {
                gameEnd = true;
                alert("You win!");
            } else if(wordBoard.row == maxRound - 1) {
                gameEnd = true;
                getChosenWord();
            }
            // display matching result on screen
            wordBoard.setInputValue(changeCommand);
        }).catch(function (error) {
            console.log(error);
            
        })
    }

    function getChosenWord() {
        axios.post( url + "/getChosenWord", {
            'playerName': playerName,
            'gameId': gameId
        }).then(function(response) {
            console.log(response.data);
            alert("You lose! The answer is " + response.data);
        }).catch(function(error) {
            console.log(error);
        })
    }
    
    function handleClick(e) {
        if(!gameEnd) {
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