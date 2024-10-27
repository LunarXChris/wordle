package org.example.wordlegame;

import org.example.wordlegame.Game.Game;

// Response Template send to players
public record Response(
    Game game,
    Integer maxRound,
    Integer playerId
) {
}
