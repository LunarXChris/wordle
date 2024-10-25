import { useState } from "react";
import { useNavigate } from "react-router-dom";

const setUp = () => {

    const navigate = useNavigate();


    const handleSubmit = (event) => {
        event.preventDefault();
        const maxRound = document.getElementById("maxRound").value;
        const dictionary = document.getElementById("dictionary").value;
        navigate("/game", { state: {dict: dictionary, round: maxRound} } );
        
      }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Dictionary:<br></br>
                    <textarea id="dictionary" rows={20} required></textarea>
                </label>
                <br></br>
                <label>
                    Max number of term:<br></br>
                    <input id="maxRound"type='number' min='1' placeholder='6' required></input>
                </label>
                <br></br>
                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}

export default setUp