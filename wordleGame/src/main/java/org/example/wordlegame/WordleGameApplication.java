package org.example.wordlegame;

import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.slf4j.Logger;



@SpringBootApplication
public class WordleGameApplication {

	private static final Logger logger = LoggerFactory.getLogger(WordleGameApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(WordleGameApplication.class, args);
		logger.info("Game started");
	}


}
