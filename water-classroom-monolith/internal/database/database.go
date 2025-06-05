package database

import (
	"database/sql"
	"fmt"
	"time"

	"github.com/water-classroom/water-classroom-monolith/internal/config" // Adjusted import path
	_ "github.com/lib/pq"                                                  // Postgres driver
	"go.uber.org/zap"
)

// InitDB initializes the database connection
func InitDB(cfg *config.Config, logger *zap.Logger) (*sql.DB, error) {
	db, err := sql.Open("postgres", cfg.PostgresURI)
	if err != nil {
		return nil, fmt.Errorf("error opening database connection: %w", err)
	}

	// Configure connection pool
	db.SetMaxOpenConns(cfg.PostgresMaxOpenConns)
	db.SetMaxIdleConns(cfg.PostgresMaxIdleConns)
	db.SetConnMaxLifetime(cfg.PostgresConnMaxLifetime)

	// Test connection
	if err := db.Ping(); err != nil {
		db.Close() // Close connection if ping fails
		return nil, fmt.Errorf("error connecting to database: %w", err)
	}

	logger.Info("Database connection established")
	return db, nil
}
