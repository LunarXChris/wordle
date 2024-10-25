import React from 'react'
import { useNavigate } from 'react-router-dom'

const chooseGameMode = () => {

    const navigate = useNavigate()

    const handleSubmit = (event) => {
        event.preventDefault();
        const gameMode = document.getElementById("gameMode").value;
        const playerName = document.getElementById("name").value;
        const gameId = document.getElementById("gameId").value;

        navigate("/game", { state: { gameMode: gameMode, playerName: playerName, gameId: gameId } });
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Choose game mode:
                    <br></br>
                    <select name="gameMode" id="gameMode" required>
                        <option value="normal">Normal</option>
                        <option value="hard">Hard</option>
                        <option value="multiplayer">Multiplayer</option>
                    </select>
                </label>
                <br></br>
                <label>
                    Input your name:
                    <br></br>
                    <input type="text" id="name" required/>
                </label>
                <br></br>
                <label>
                    Input game id for multiplayer mode if needed:
                    <br></br>
                    <input type="text" id="gameId"/>
                </label>
                <br></br>
                <input type='submit' value="Submit"/>
            </form>
        </div>
    )
}

export default chooseGameMode