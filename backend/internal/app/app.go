package app

import (
	"crypto/rsa"
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"github.com/rabbitmq/amqp091-go"
	"github.com/StellariumFoundation/WaterClassroom/backend/internal/config" // Adjusted import path
	"go.uber.org/zap"
	"golang.org/x/oauth2"
	"google.golang.org/grpc"
)

// Application holds all dependencies for the monolith service
type Application struct {
	Config     *config.Config
	Logger     *zap.Logger
	DB         *sql.DB
	Redis      *redis.Client
	RabbitMQ   *amqp091.Connection
	PrivateKey *rsa.PrivateKey
	PublicKey  *rsa.PublicKey
	Router     *gin.Engine
	GRPCServer *grpc.Server // Placeholder for now
	GoogleOAuthConfig *oauth2.Config
}
