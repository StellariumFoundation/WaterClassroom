package auth

import (
	"crypto/rsa"
	"crypto/x509"
	"encoding/pem"
	"fmt"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/water-classroom/water-classroom-monolith/internal/app" // Adjusted
	"go.uber.org/zap"                                                  // Added
)

// GenerateTokens creates access and refresh JWTs
func GenerateTokens(application *app.Application, userID, email string) (string, string, error) {
	if application.PrivateKey == nil {
		return "", "", fmt.Errorf("private key is not available for token signing")
	}

	// Generate Access Token
	accessTokenClaims := jwt.MapClaims{
		"sub":        userID,
		"aud":        application.Config.JWTAudience,
		"iss":        application.Config.JWTIssuer,
		"exp":        time.Now().Add(application.Config.JWTAccessTokenExpiry).Unix(),
		"email":      email,
		"token_type": "access",
	}
	accessToken := jwt.NewWithClaims(jwt.SigningMethodRS256, accessTokenClaims)
	signedAccessToken, err := accessToken.SignedString(application.PrivateKey)
	if err != nil {
		return "", "", fmt.Errorf("failed to sign access token: %w", err)
	}

	// Generate Refresh Token
	refreshTokenClaims := jwt.MapClaims{
		"sub":        userID,
		"aud":        application.Config.JWTAudience,
		"iss":        application.Config.JWTIssuer,
		"exp":        time.Now().Add(application.Config.JWTRefreshTokenExpiry).Unix(),
		"token_type": "refresh",
	}
	refreshToken := jwt.NewWithClaims(jwt.SigningMethodRS256, refreshTokenClaims)
	signedRefreshToken, err := refreshToken.SignedString(application.PrivateKey)
	if err != nil {
		return "", "", fmt.Errorf("failed to sign refresh token: %w", err)
	}

	return signedAccessToken, signedRefreshToken, nil
}

// GeneratePasswordResetToken generates a short-lived token for password reset
func GeneratePasswordResetToken(application *app.Application, userID, email string) (string, time.Time, error) {
	if application.PrivateKey == nil {
		return "", time.Time{}, fmt.Errorf("private key is not available for token signing")
	}

	expiryDuration := application.Config.PasswordResetTokenExpiry
	if expiryDuration <= 0 {
		expiryDuration = 1 * time.Hour // Default
		application.Logger.Warn("PasswordResetTokenExpiry not configured or invalid, defaulting to 1 hour", zap.Duration("configured_expiry", application.Config.PasswordResetTokenExpiry))
	}
	expiryTime := time.Now().Add(expiryDuration)

	claims := jwt.MapClaims{
		"sub":        userID,
		"aud":        application.Config.JWTAudience,
		"iss":        application.Config.JWTIssuer,
		"exp":        expiryTime.Unix(),
		"email":      email,
		"token_type": "password_reset",
	}
	token := jwt.NewWithClaims(jwt.SigningMethodRS256, claims)
	signedToken, err := token.SignedString(application.PrivateKey)
	if err != nil {
		return "", time.Time{}, fmt.Errorf("failed to sign password reset token: %w", err)
	}
	return signedToken, expiryTime, nil
}

// ParseJWTKeys parses the RSA keys for JWT from the application config
func ParseJWTKeys(application *app.Application) error {
	// Parse private key
	privateKeyPEM := strings.ReplaceAll(application.Config.JWTPrivateKey, "\\n", "\n")
	privateKeyBlock, _ := pem.Decode([]byte(privateKeyPEM))
	if privateKeyBlock == nil {
		return fmt.Errorf("failed to parse PEM block containing private key")
	}
	privateKey, err := x509.ParsePKCS1PrivateKey(privateKeyBlock.Bytes)
	if err != nil {
		return fmt.Errorf("error parsing private key: %w", err)
	}
	application.PrivateKey = privateKey

	// Parse public key
	publicKeyPEM := strings.ReplaceAll(application.Config.JWTPublicKey, "\\n", "\n")
	publicKeyBlock, _ := pem.Decode([]byte(publicKeyPEM))
	if publicKeyBlock == nil {
		return fmt.Errorf("failed to parse PEM block containing public key")
	}
	publicKeyInterface, err := x509.ParsePKIXPublicKey(publicKeyBlock.Bytes)
	if err != nil {
		return fmt.Errorf("error parsing public key: %w", err)
	}
	publicKey, ok := publicKeyInterface.(*rsa.PublicKey)
	if !ok {
		return fmt.Errorf("not an RSA public key")
	}
	application.PublicKey = publicKey

	application.Logger.Info("JWT keys parsed successfully")
	return nil
}
