package main

import (
	"log"
	"os"
	"strconv"
	// "gopkg.in/yaml.v3" // Removed as it's unused
)

// Config holds the application configuration
type Config struct {
	RabbitMQURI string `yaml:"rabbitmq_uri"`
	SMTPHost    string `yaml:"smtp_host"`
	SMTPPort    int    `yaml:"smtp_port"`
	SMTPUser    string `yaml:"smtp_user"`
	SMTPPass    string `yaml:"smtp_pass"`
	SenderEmail string `yaml:"sender_email"`
}

// loadConfig loads configuration from environment variables or a YAML file
func loadConfig() (*Config, error) {
	cfg := &Config{
		// Default values
		RabbitMQURI: "amqp://guest:guest@localhost:5672/",
		SMTPHost:    "smtp.example.com",
		SMTPPort:    587,
		SMTPUser:    "user",
		SMTPPass:    "password",
		SenderEmail: "noreply@example.com",
	}

	// Override with environment variables if set
	if uri := os.Getenv("RABBITMQ_URI"); uri != "" {
		cfg.RabbitMQURI = uri
	}
	if host := os.Getenv("SMTP_HOST"); host != "" {
		cfg.SMTPHost = host
	}
	if portStr := os.Getenv("SMTP_PORT"); portStr != "" {
		if port, err := parseInt(portStr); err == nil {
			cfg.SMTPPort = port
		} else {
			log.Printf("Warning: Invalid SMTP_PORT value '%s', using default %d. Error: %v", portStr, cfg.SMTPPort, err)
		}
	}
	if user := os.Getenv("SMTP_USER"); user != "" {
		cfg.SMTPUser = user
	}
	if pass := os.Getenv("SMTP_PASS"); pass != "" {
		cfg.SMTPPass = pass
	}
	if sender := os.Getenv("SENDER_EMAIL"); sender != "" {
		cfg.SenderEmail = sender
	}

	// TODO: Implement loading from a YAML file if needed
	// For now, we're primarily relying on environment variables or defaults.
	// If you want to load from a YAML file, you can add that logic here.
	// Example:
	// configFile := "config.yaml"
	// if _, err := os.Stat(configFile); err == nil {
	// 	data, err := os.ReadFile(configFile)
	// 	if err != nil {
	// 		return nil, fmt.Errorf("failed to read config file: %w", err)
	// 	}
	// 	err = yaml.Unmarshal(data, cfg)
	// 	if err != nil {
	// 		return nil, fmt.Errorf("failed to unmarshal config data: %w", err)
	// 	}
	// }

	log.Println("Configuration loaded successfully")
	return cfg, nil
}

// parseInt is a helper function to convert string to int
func parseInt(s string) (int, error) {
	i, err := strconv.Atoi(s)
	if err != nil {
		return 0, err
	}
	return i, nil
}
