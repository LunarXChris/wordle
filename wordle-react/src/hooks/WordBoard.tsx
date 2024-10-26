import './WordBoard.css';
import React, {useState, useImperativeHandle, forwardRef} from 'react';

const WordBoard = forwardRef((props, ref) => {

    // record the current row, col and the word from user input
    const [row, setRow] = useState(0);
    const [col, setCol] = useState(0);
    const [word, setWord] = useState("");
    const [maxRound, setMaxRound] = useState(6);

    //expose several variables and setting function to the parent componnet
    useImperativeHandle(ref, () => ({
        row,
        col,
        word,
        setLayout: (round) => {
            let height = round * 60;
            setMaxRound(round);
            const wordBoard = document.getElementById("board");
            wordBoard.style.height = height + "px";
            wordBoard.style.gridTemplateRows= "repeat(" + round + ", 1fr)"

        },
        setWordInput: (value: string) => {
            for(let i = 0; i < 5; i++) {
                document.getElementById(row.toString() + "_" + i.toString()).innerHTML = value[i];
                setCol(5);
                setWord(value);
            }
        },
        setInputValue: (value: string) => {
            // handle ui changes according to user input 
            if(value.startsWith("enter")) {
                if(row < maxRound) {
                    // set Color for each letter block
                    const changes = value.substring(6);
                    for(let i = 0; i < changes.length; i++) {
                        const letterBlock = document.getElementById(row.toString() + "_" + i.toString());
                        letterBlock.style.color = "white";
                        letterBlock.style.border = "0";
                        if(changes[i] == "B") {
                            letterBlock.style.backgroundColor = "#6495ED";
                        } else if(changes[i] == "Y") {
                            letterBlock.style.backgroundColor = "#FFBF00"; 
                        } else if(changes[i] == "G") {
                            letterBlock.style.backgroundColor = "grey";
                        }
                    }

                    setRow(row + 1);
                    setCol(0);
                    setWord("");
                }
            } else if(value === "bs") {
                // remove letter
                if(col > 0) {
                    document.getElementById(row.toString() + "_" + (col - 1).toString()).innerHTML = ""; 
                    setCol(col - 1);
                    setWord(word.slice(0, -1));
                }
            } else {
                //display letter
                if(col < 5) {
                    document.getElementById(row.toString() + "_" + col.toString()).innerHTML = value;
                    setCol(col + 1);
                    setWord(word + value);
                }

            }
        }
    }));


    return(
        <div className="boardContainer">
            
            <div className="wordBoard" id="board">
                {
                Array.from(
                    {length: maxRound}, (_, i) => 
                    <div className="wordRow">
                        <div className="letterBlock" id={i + "_0"}></div>
                        <div className="letterBlock" id={i + "_1"}></div>
                        <div className="letterBlock" id={i + "_2"}></div>
                        <div className="letterBlock" id={i + "_3"}></div>
                        <div className="letterBlock" id={i + "_4"}></div>
                    </div>
                )
                }
            </div>
        </div>
    )
})

export default WordBoard