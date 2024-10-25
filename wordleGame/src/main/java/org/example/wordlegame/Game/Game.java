package org.example.wordlegame.Game;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.wordlegame.Player;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "wordle")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Game{
    @Id
    private String gameId;
    private List<String> wordCandidates;
    private List<Player> players;
    private GameModeEnum gameMode;
    private GameStatusEnum gameStatus;

}
