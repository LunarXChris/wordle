package org.example.wordlegame;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GuessResult { // define the response template for multiplayer mode
    private String gameId;
    private String word;
    private String result;
    private int playerTurn;

}
