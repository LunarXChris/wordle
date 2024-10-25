package org.example.wordlegame;

import org.example.wordlegame.Game.Game;

public record Response(
    Game game,
    Integer maxRound
) {
}
