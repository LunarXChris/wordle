package org.example.wordlegame.Game;

import org.example.wordlegame.Player;
import org.example.wordlegame.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin
@RestController
public class GameController {
    private static final Logger log = LoggerFactory.getLogger(GameController.class);
    private final GameService gameService;

    @Value("${MAX_ROUND}")
    private int maxRound;

    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @PostMapping("/create")
    public ResponseEntity<Response> createGame(@RequestBody Map<String, String> payload) {
        String playerName = payload.get("playerName");
        String mode = payload.get("gameMode");
        log.info("create game request: {} {} ", playerName, mode);
        GameModeEnum gameMode;
        if(mode.equals("normal")) {
            gameMode = GameModeEnum.NORMAL;
        } else if(mode.equals("multiplayer")) {
            gameMode = GameModeEnum.MULTIPLAYER;
        } else {
            gameMode = GameModeEnum.ABSURDLE;
        }
        return ResponseEntity.ok(new Response(gameService.createGame(new Player(playerName), gameMode), maxRound));
    }

    @PostMapping("/connect")
    public ResponseEntity<Response> connect(@RequestBody Map<String, String> payload) {
        String playerName = payload.get("playerName");
        String gameId = payload.get("gameId");
        log.info("connect request: {} {}", playerName, gameId );
        if(gameId.isEmpty()) {
            return ResponseEntity.ok(new Response(gameService.connectToRandomGame(new Player(playerName)), maxRound));
        }
        return  ResponseEntity.ok(new Response(gameService.connectToGame(new Player(playerName), gameId), maxRound));
    }

    @PostMapping("/check")
    public ResponseEntity<String> check(@RequestBody Map<String, String> payload) {
        String playerName = payload.get("playerName");
        String gameId = payload.get("gameId");
        String word = payload.get("word");
        log.info("check request: {} {} {}", playerName, gameId, word );
        return ResponseEntity.ok(gameService.handlePlayerGuess(playerName, gameId, word));
    }

    @PostMapping("/getChosenWord")
    public ResponseEntity<String> endGame(@RequestBody Map<String, String> payload) {
        String playerName = payload.get("playerName");
        String gameId = payload.get("gameId");
        log.info("endGame: {} {}", playerName, gameId);
        return ResponseEntity.ok(gameService.getChosenWord(playerName, gameId));
    }

//    @PostMapping("/ws")
//    public ResponseEntity<Game> ws(@RequestBody Player player, @RequestBody String gameId) {
//        log.info("ws request: {} {}", player, gameId );
//
//    }

}
