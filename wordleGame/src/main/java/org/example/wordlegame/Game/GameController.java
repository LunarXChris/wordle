package org.example.wordlegame.Game;

import org.example.wordlegame.GuessResult;
import org.example.wordlegame.Player;
import org.example.wordlegame.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin
@RestController
public class GameController {
    private static final Logger log = LoggerFactory.getLogger(GameController.class);
    private final GameService gameService;
    private final SimpMessagingTemplate messagingTemplate;

    @Value("${MAX_ROUND}")
    private int maxRound;

    public GameController(GameService gameService, SimpMessagingTemplate messagingTemplate) {
        this.gameService = gameService;
        this.messagingTemplate = messagingTemplate;
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
        return ResponseEntity.ok(new Response(gameService.createGame(new Player(playerName), gameMode), maxRound, 1));
    }

    @PostMapping("/connect")
    public ResponseEntity<Response> connect(@RequestBody Map<String, String> payload) {
        String playerName = payload.get("playerName");
        String gameId = payload.get("gameId");
        log.info("connect request: {} {}", playerName, gameId );

        Game game;
        if(gameId.isEmpty()) {
            game = gameService.connectToRandomGame(new Player(playerName));
        } else {
            game = gameService.connectToGame(new Player(playerName), gameId);
        }

        int playerId;
        if(game.getPlayers().size() == 1) {
            playerId = 1;
        } else {
            playerId = 2;
            GuessResult guessResult = new GuessResult(game.getGameId(), "", "", 1);
            messagingTemplate.convertAndSend("/topic/game-progress/" + game.getGameId(), guessResult);
            log.info("guessResult: {}", guessResult);
        }

        return ResponseEntity.ok(new Response(game, maxRound, playerId));
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

    @PostMapping("/ws")
    public ResponseEntity<String> ws(@RequestBody Map<String, String> payload) {
        String playerName = payload.get("playerName");
        String gameId = payload.get("gameId");
        String word = payload.get("word");
        int playerId = payload.get("playerId") == null ? 1 : Integer.parseInt(payload.get("playerId"));

        log.info("ws request: {} {} {} {} ", playerName, gameId, word, playerId);

        GuessResult guessResult = gameService.handleMultiplayerRequest(playerName, gameId, word, playerId);
        messagingTemplate.convertAndSend("/topic/game-progress/" + gameId, guessResult);

        return ResponseEntity.ok(guessResult.getResult());
    }

}
