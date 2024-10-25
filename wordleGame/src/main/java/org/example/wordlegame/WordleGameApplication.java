package org.example.wordlegame;

import org.example.wordlegame.Run.Run;
import org.example.wordlegame.Run.RunRepository;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.slf4j.Logger;
import org.springframework.context.annotation.Bean;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;


@SpringBootApplication
public class WordleGameApplication {

	private static final Logger logger = LoggerFactory.getLogger(WordleGameApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(WordleGameApplication.class, args);
		logger.info("Something changed");
	}

//	@Bean
//	CommandLineRunner runner(RunRepository runRepository) {
//		return args -> {
//			Run run = new Run(11, "First Run", LocalDateTime.now(), LocalDateTime.now().plus(10, ChronoUnit.MINUTES));
//			runRepository.create(run);
//		};
//	}
}
