package org.example.wordlegame.Game;

import io.micrometer.common.util.StringUtils;
import org.example.wordlegame.GuessResult;
import org.example.wordlegame.Player;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class GameService {
    private final GameRepository gameRepository;
    private static final Logger log = LoggerFactory.getLogger(GameRepository.class);
    private static List<String> dict;

    public GameService(GameRepository gameRepository, @Value("classPath:Words.txt")Resource resourceFile) {
        this.gameRepository = gameRepository;
        dict = loadWords(resourceFile);
    }

    // load the dictionary from the word.txt file in resources file
    private List<String> loadWords(Resource resource) {
        try {
            InputStreamReader inputStreamReader = new InputStreamReader(resource.getInputStream());
            List<String> wordsInFile = new BufferedReader(inputStreamReader)
                    .lines()
                    .filter(line -> !StringUtils.isEmpty(line))
                    .map(s -> s.trim().toLowerCase())
                    .collect(Collectors.toList());
            log.info(
                    "Loaded {} with {} words",
                    resource.getFilename(),
                    wordsInFile.size()
            );
            return wordsInFile;
        } catch (Exception e) {
            throw new RuntimeException(
                    "Error reading %s: %s".formatted(resource.getFilename(), e.getMessage()),
                    e
            );
        }
    }

    private List<Game> getGames() {
        return gameRepository.findAll();
    }

    private Optional<Game> getGame(String id) {
        return gameRepository.findById(id);
    }

    // create a new game room according to game mode
    public Game createGame(Player player, GameModeEnum gameMode) {
        List<Player> players = new ArrayList<>();
        players.add(player);

        List<String> words = new ArrayList<>();
        if(gameMode == GameModeEnum.ABSURDLE || gameMode == GameModeEnum.MULTIPLAYER) { // add extra words to the word candidate list
            for(int i = 0; i < 5; i++) {
                words.add(dict.get((int) Math.floor(Math.random() * dict.size())));
            }
        }
        words.add(dict.get((int) Math.floor(Math.random() * dict.size())));

        Game newGame;
        if(gameMode == GameModeEnum.MULTIPLAYER) { // set the game status to be new and wait for another player
            newGame = gameRepository.insert(new Game(UUID.randomUUID().toString(), words, players, gameMode, GameStatusEnum.NEW));
        } else { // set the game status to be in-progress and start the game
            newGame = gameRepository.insert(new Game(UUID.randomUUID().toString(), words, players, gameMode, GameStatusEnum.IN_PROGRESS));
        }

        newGame.setWordCandidates(new ArrayList<>());

        return newGame;
    }

    // connect to an available game room
    public Game connectToRandomGame(Player player) {
        List<Game> result = gameRepository.findByGameStatus(GameStatusEnum.NEW);

        Game game = null;
        for(int i = 0; i < result.size(); i++) {
            Game temp = result.get(i);
            if(temp.getGameMode() == GameModeEnum.MULTIPLAYER) {
                game = temp;
                break;
            }
        }

        if(game == null) { // if there is no available room, create new game room
            game = createGame(player, GameModeEnum.MULTIPLAYER);
        } else { // connect to an available room
            game.getPlayers().add(player);
            game.setGameStatus(GameStatusEnum.IN_PROGRESS);
            game.getWordCandidates().add(dict.get((int) Math.floor(Math.random() * dict.size())));
            gameRepository.save(game);
            game.setWordCandidates(new ArrayList<>());
        }

        return game;
    }

    // connect to a specific game room
    public Game connectToGame(Player player, String gameId) {
        Optional<Game> result = getGame(gameId);
        if(result.isEmpty()) { // if the room is not found
            log.warn("Game does found {}", result);
            return connectToRandomGame(player);
        }

        Game game = result.get();
        if(game.getGameStatus() != GameStatusEnum.NEW) { // if the room is already start, connect to a random room
            return connectToRandomGame(player);
        }

        if(game.getPlayers().size() > 1) { // handle an exception that the room found is full
            throw new RuntimeException("Game room is full!");
        }
        game.getPlayers().add(player);
        game.setGameStatus(GameStatusEnum.IN_PROGRESS);
        game.getWordCandidates().add(dict.get((int) Math.floor(Math.random() * dict.size())));
        gameRepository.save(game);

        game.setWordCandidates(new ArrayList<>());

        return game;
    }

    // match the input word with the chosen word
    // G: Grey(incorrect character)  Y: Yellow(presented character)  B: Blue(correct character)
    private String validateWord(String word, String chosenWord) {
        String result = "";
        for(int i = 0; i < 5; i++) {
            if(word.charAt(i) == Character.toUpperCase(chosenWord.charAt(i))) {
                result += "B";
                continue;
            }
            for(int j = 0; j < 5; j++) {
                if(i == j) {
                    continue;
                }
                if(word.charAt(i) == Character.toUpperCase(chosenWord.charAt(j))) {
                    result += "Y";
                    break;
                }
            }
            if(result.length() == i) {
                result += "G";
            }
        }
        return result;
    }

    // handle word guess of single-player mode
    public String handlePlayerGuess(String playerName, String gameId, String word) {
        Optional<Game> result = getGame(gameId);
        result.orElseThrow(() -> new RuntimeException("Game not found"));

        Game game = result.get();
        List<Player> players = game.getPlayers();
        List<String> words = game.getWordCandidates();

        String answer = "GGGGG";
        if(game.getGameMode() == GameModeEnum.ABSURDLE) { // implement the logic of host cheating mode
            int minHit = 5;
            int minPresent = 5;
            String remainWord = words.get(0);
            List<String> update = new ArrayList<>();

            for(int i = 0; i < words.size(); i++) {
                String chosenWord = words.get(i);
                String match = validateWord(word, chosenWord);
                int hit = 0;
                int present = 0;
                for(int j = 0; j < 5; j++) {
                    if(match.charAt(j) == 'B') {
                        hit += 1;
                    } else if(match.charAt(j) == 'Y') {
                        present += 1;
                    }
                }

                if(hit == 0 && present == 0) {
                    update.add(chosenWord);
                }
                if(hit < minHit) {
                    minHit = hit;
                    minPresent = present;
                    remainWord = chosenWord;
                    answer = match;
                } else if(hit == minHit && present < minPresent) {
                    minPresent = present;
                    remainWord = chosenWord;
                    answer = match;
                }
            }

            if(minHit > 0 || minPresent > 0) {
                update.clear();
                update.add(remainWord);
            }

            game.setWordCandidates(update);
            gameRepository.save(game);
        } else { // implement the logic of normal game mode
            for(int i = 0; i < players.size(); i++) {
                if(players.get(i).playerName().equals(playerName)) {
                    answer = validateWord(word, words.get(i));
                }
            }
        }

        if(answer.equals("BBBBB")) { // if the guess is correct
            game.setGameStatus(GameStatusEnum.FINISHED);
            gameRepository.save(game);
        }

        return answer;
    }

    // get the chosen word for the specified game
    public String getChosenWord(String playerName, String gameId) {
        Optional<Game> result = getGame(gameId);
        result.orElseThrow(() -> new RuntimeException("Game not found"));

        // set the game status be finished
        Game game = result.get();
        game.setGameStatus(GameStatusEnum.FINISHED);
        gameRepository.save(game);

        String answer = "";
        List<Player> players = game.getPlayers();
        for(int i = 0; i < game.getPlayers().size(); i++) {
            if(players.get(i).playerName().equals(playerName)) {
                answer = game.getWordCandidates().get(0);
            }
        }

        return answer;
    }

    // handle the request of multi-player mode
    public GuessResult handleMultiplayerRequest(String playerName, String gameId, String word, int playerId) {
        Optional<Game> result = getGame(gameId);
        result.orElseThrow(() -> new RuntimeException("Game not found"));

        Game game = result.get();
        List<Player> players = game.getPlayers();
        List<String> words = game.getWordCandidates();

        String answer = "GGGGG";

        if(game.getGameMode() == GameModeEnum.MULTIPLAYER) { // implements the logic that is same as the host-cheating mode

            int minHit = 5;
            int minPresent = 5;
            String remainWord = words.get(0);
            List<String> update = new ArrayList<>();

            for(int i = 0; i < words.size(); i++) {
                String chosenWord = words.get(i);
                String match = validateWord(word, chosenWord);
                int hit = 0;
                int present = 0;
                for(int j = 0; j < 5; j++) {
                    if(match.charAt(j) == 'B') {
                        hit += 1;
                    } else if(match.charAt(j) == 'Y') {
                        present += 1;
                    }
                }

                if(hit == 0 && present == 0) {
                    update.add(chosenWord);
                }
                if(hit < minHit) {
                    minHit = hit;
                    minPresent = present;
                    remainWord = chosenWord;
                    answer = match;
                } else if(hit == minHit && present < minPresent) {
                    minPresent = present;
                    remainWord = chosenWord;
                    answer = match;
                }
            }

            if(minHit > 0 || minPresent > 0) {
                update.clear();
                update.add(remainWord);
            }

            game.setWordCandidates(update);
            gameRepository.save(game);
        }

        // iterate the List to prevent players have the same playerName
        int currentPlayerTurn = 0;
        for(int i = 0; i < players.size(); i++) {
            if(players.get(i).playerName().equals(playerName) && i + 1 == playerId) {
                currentPlayerTurn = i + 1;
            }
        }
        int nextPlayerTurn = currentPlayerTurn == 1 ? 2 : 1;

        GuessResult guessResult = new GuessResult(gameId, word, answer, nextPlayerTurn);

        return guessResult;
    }
}
