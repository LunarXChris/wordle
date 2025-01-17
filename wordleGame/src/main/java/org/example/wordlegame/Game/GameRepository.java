package org.example.wordlegame.Game;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameRepository extends MongoRepository<Game, String> { // define a dao using mongodb api
    // define custom function find all games of specific game status
    List<Game> findByGameStatus(GameStatusEnum gameStatus);
}
