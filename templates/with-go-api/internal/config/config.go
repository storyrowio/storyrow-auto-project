package config

import "os"

type Config struct {
	ServerAddress string
	DatabaseUri   string
	DatabaseName  string
}

func Load() *Config {
	config := &Config{
		ServerAddress: getEnv("SERVER_ADDRESS", ":8080"),
		DatabaseUri:   getEnv("DATABASE_URI", ""),
		DatabaseName:  getEnv("DATABASE_NAME", ""),
	}

	if os.Getenv("SERVER_PORT") != "" {
		config.ServerAddress = ":" + os.Getenv("SERVER_PORT")
	}

	return config
}

func getEnv(key, fallback string) string {
	if value, ok := os.LookupEnv(key); ok {
		return value
	}
	return fallback
}
