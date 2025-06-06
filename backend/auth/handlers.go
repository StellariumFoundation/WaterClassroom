package auth

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/water-classroom/backend/app" // Adjusted
	"go.uber.org/zap"                                                  // Added
	"golang.org/x/crypto/bcrypt"
	"github.com/golang-jwt/jwt/v5"
)

// AuthHandler holds dependencies for auth routes
type AuthHandler struct {
	App *app.Application
}

// GoogleUserInfo defines the structure for user information from Google
type GoogleUserInfo struct {
	ID      string `json:"id"`
	Email   string `json:"email"`
	Name    string `json:"name"`
	Picture string `json:"picture"`
}

// RegisterRequest defines the structure for the registration request body
type RegisterRequest struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
}

// UserResponse defines the structure for the user data returned in responses
type UserResponse struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Email string `json:"email"`
}

// LoginRequest defines the structure for the login request body
type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// LoginResponse defines the structure for the login response body
type LoginResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

// OnboardingDetailsRequest defines the structure for updating user onboarding details
type OnboardingDetailsRequest struct {
	UserType      string `json:"user_type" binding:"required"` // e.g., "homeschool", "school_student", "individual"
	ClassroomCode string `json:"classroom_code"`             // Optional
}

// CurrentUserResponse defines the structure for the /user/me endpoint
type CurrentUserResponse struct {
	ID                 string         `json:"id"`
	DisplayName        string         `json:"display_name"`
	Email              string         `json:"email"`
	AvatarURL          sql.NullString `json:"avatar_url"`
	Role                 string         `json:"role"`
	IsVerified           bool           `json:"is_verified"`
	UserType             sql.NullString `json:"user_type"`
	ClassroomCode        sql.NullString `json:"classroom_code"`
	OnboardingComplete   bool           `json:"onboarding_complete"`
	SelectedCurriculumID sql.NullString `json:"selected_curriculum_id"`
}

// UpdateCurriculumRequest defines the structure for updating selected curriculum
type UpdateCurriculumRequest struct {
	SelectedCurriculumID string `json:"selected_curriculum_id" binding:"required"`
}

// UpdateCurrentUserRequest defines the structure for the /user/me update request
type UpdateCurrentUserRequest struct {
	DisplayName *string `json:"display_name"`
	AvatarURL   *string `json:"avatar_url"`
}

// RefreshTokenRequest defines the structure for the token refresh request
type RefreshTokenRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}

// ForgotPasswordRequest defines the structure for the forgot password request
type ForgotPasswordRequest struct {
	Email string `json:"email" binding:"required,email"`
}

// ResetPasswordRequest defines the structure for the reset password request
type ResetPasswordRequest struct {
	Token       string `json:"token" binding:"required"`
	NewPassword string `json:"new_password" binding:"required,min=8"`
}

// ChangePasswordRequest defines the structure for the change password request body
type ChangePasswordRequest struct {
	OldPassword string `json:"old_password" binding:"required"`
	NewPassword string `json:"new_password" binding:"required,min=8"`
}


// HandleRegister handles user registration
func (h *AuthHandler) HandleRegister(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.App.Logger.Error("Failed to bind request", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload: " + err.Error()})
		return
	}

	var existingUserID string
	err := h.App.DB.QueryRowContext(c.Request.Context(), "SELECT id FROM users WHERE email = $1", req.Email).Scan(&existingUserID)
	if err != nil && err != sql.ErrNoRows {
		h.App.Logger.Error("Database error while checking for existing user", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}
	if err == nil {
		h.App.Logger.Warn("Registration attempt with existing email", zap.String("email", req.Email))
		c.JSON(http.StatusBadRequest, gin.H{"error": "User with this email already exists"})
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), h.App.Config.PasswordHashCost)
	if err != nil {
		h.App.Logger.Error("Failed to hash password", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error processing password"})
		return
	}

	var newUserID string
	insertQuery := "INSERT INTO users (display_name, email, password_hash) VALUES ($1, $2, $3) RETURNING id"
	err = h.App.DB.QueryRowContext(c.Request.Context(), insertQuery, req.Name, req.Email, string(hashedPassword)).Scan(&newUserID)
	if err != nil {
		h.App.Logger.Error("Failed to insert new user into database", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	userResponse := UserResponse{
		ID:    newUserID,
		Name:  req.Name,
		Email: req.Email,
	}
	h.App.Logger.Info("User registered successfully", zap.String("userID", newUserID), zap.String("email", req.Email))
	c.JSON(http.StatusCreated, userResponse)
}

// HandleLogin handles user login
func (h *AuthHandler) HandleLogin(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.App.Logger.Error("Failed to bind request for login", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload: " + err.Error()})
		return
	}

	var userID, userEmail, passwordHash string
	query := "SELECT id, email, password_hash FROM users WHERE email = $1"
	err := h.App.DB.QueryRowContext(c.Request.Context(), query, req.Email).Scan(&userID, &userEmail, &passwordHash)
	if err != nil {
		if err == sql.ErrNoRows {
			h.App.Logger.Warn("Login attempt for non-existent email", zap.String("email", req.Email))
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
			return
		}
		h.App.Logger.Error("Database error during login", zap.Error(err), zap.String("email", req.Email))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(passwordHash), []byte(req.Password))
	if err != nil {
		h.App.Logger.Warn("Invalid password attempt", zap.String("email", userEmail), zap.Error(err))
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	signedAccessToken, signedRefreshToken, err := GenerateTokens(h.App, userID, userEmail)
	if err != nil {
		h.App.Logger.Error("Failed to generate tokens", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate tokens"})
		return
	}

	h.App.Logger.Info("User logged in successfully", zap.String("userID", userID), zap.String("email", userEmail))
	loginResponse := LoginResponse{
		AccessToken:  signedAccessToken,
		RefreshToken: signedRefreshToken,
	}
	c.JSON(http.StatusOK, loginResponse)
}

// HandleRefreshToken handles token refresh
func (h *AuthHandler) HandleRefreshToken(c *gin.Context) {
	var req RefreshTokenRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.App.Logger.Error("Failed to bind refresh token request", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: " + err.Error()})
		return
	}

	if req.RefreshToken == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Refresh token is required"})
		return
	}

	token, err := jwt.Parse(req.RefreshToken, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return h.App.PublicKey, nil
	})

	if err != nil {
		h.App.Logger.Warn("Refresh token parsing/validation failed", zap.Error(err))
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired refresh token"})
		return
	}

	if !token.Valid {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired refresh token"})
		return
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
		return
	}

	if iss, ok := claims["iss"].(string); !ok || iss != h.App.Config.JWTIssuer {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token issuer"})
		return
	}
	if aud, ok := claims["aud"].(string); !ok || aud != h.App.Config.JWTAudience {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token audience"})
		return
	}
	tokenType, typeOk := claims["token_type"].(string)
	if !typeOk || tokenType != "refresh" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token type"})
		return
	}
	userID, subOk := claims["sub"].(string)
	if !subOk || userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token subject (user ID)"})
		return
	}

	var userEmail string
	emailQuery := "SELECT email FROM users WHERE id = $1"
	err = h.App.DB.QueryRowContext(c.Request.Context(), emailQuery, userID).Scan(&userEmail)
	if err != nil {
		if err == sql.ErrNoRows {
			h.App.Logger.Error("User not found for refresh token", zap.String("userID", userID))
			c.JSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
			return
		}
		h.App.Logger.Error("Database error fetching user email for refresh token", zap.Error(err), zap.String("userID", userID))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error"})
		return
	}

	newAccessToken, newRefreshToken, err := GenerateTokens(h.App, userID, userEmail)
	if err != nil {
		h.App.Logger.Error("Failed to generate new tokens during refresh", zap.Error(err), zap.String("userID", userID))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate new tokens"})
		return
	}

	h.App.Logger.Info("Tokens refreshed successfully", zap.String("userID", userID))
	c.JSON(http.StatusOK, LoginResponse{
		AccessToken:  newAccessToken,
		RefreshToken: newRefreshToken,
	})
}

// HandleForgotPassword handles forgot password requests
func (h *AuthHandler) HandleForgotPassword(c *gin.Context) {
	var req ForgotPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.App.Logger.Error("Failed to bind forgot password request", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: " + err.Error()})
		return
	}

	var userID, userEmail string
	var isVerified bool
	query := "SELECT id, email, is_verified FROM users WHERE email = $1"
	err := h.App.DB.QueryRowContext(c.Request.Context(), query, req.Email).Scan(&userID, &userEmail, &isVerified)

	if err != nil {
		if err == sql.ErrNoRows {
			h.App.Logger.Info("Forgot password attempt for non-existent email", zap.String("email", req.Email))
			c.JSON(http.StatusOK, gin.H{"message": "If an account with that email exists, a password reset link has been sent."})
			return
		}
		h.App.Logger.Error("Database error during forgot password user lookup", zap.Error(err), zap.String("email", req.Email))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	resetToken, expiryTime, err := GeneratePasswordResetToken(h.App, userID, userEmail)
	if err != nil {
		h.App.Logger.Error("Failed to generate password reset token", zap.Error(err), zap.String("userID", userID))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate reset token"})
		return
	}

	updateQuery := "UPDATE users SET reset_token_hash = $1, reset_token_expires_at = $2, updated_at = NOW() WHERE id = $3"
	_, updateErr := h.App.DB.ExecContext(c.Request.Context(), updateQuery, resetToken, expiryTime, userID)
	if updateErr != nil {
		h.App.Logger.Error("Failed to store password reset token hash in database", zap.Error(updateErr), zap.String("userID", userID))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process password reset request"})
		return
	}

	h.App.Logger.Info("Password reset token generated and stored",
		zap.String("userID", userID),
		zap.String("email", userEmail),
		zap.String("reset_token", resetToken),
	)
	// TODO: Implement actual email sending here for production
	c.JSON(http.StatusOK, gin.H{
		"message":     "If an account with that email exists, a password reset link has been sent. (Token included for dev)",
		"reset_token": resetToken,
	})
}

// HandleResetPassword handles password reset attempts
func (h *AuthHandler) HandleResetPassword(c *gin.Context) {
	var req ResetPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		h.App.Logger.Error("Failed to bind reset password request", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request: " + err.Error()})
		return
	}

	tokenClaims, err := jwt.Parse(req.Token, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return h.App.PublicKey, nil
	})

	if err != nil {
		h.App.Logger.Warn("Reset password JWT parsing/validation failed", zap.Error(err), zap.String("token", req.Token))
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired reset token"})
		return
	}

	if !tokenClaims.Valid {
		h.App.Logger.Warn("Reset password JWT is invalid", zap.String("token", req.Token))
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired reset token"})
		return
	}

	claims, ok := tokenClaims.Claims.(jwt.MapClaims)
	if !ok {
		h.App.Logger.Error("Invalid claims type in reset password JWT", zap.String("token", req.Token))
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
		return
	}

	claimIss, issOk := claims["iss"].(string)
	if !issOk || claimIss != h.App.Config.JWTIssuer {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired reset token"})
		return
	}
	claimAud, audOk := claims["aud"].(string)
	if !audOk || claimAud != h.App.Config.JWTAudience {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired reset token"})
		return
	}
	expFloat, expOk := claims["exp"].(float64)
	if !expOk {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired reset token"})
		return
	}
	expTime := time.Unix(int64(expFloat), 0)
	if expTime.Before(time.Now()) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired reset token"})
		return
	}
	tokenType, typeOk := claims["token_type"].(string)
	if !typeOk || tokenType != "password_reset" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired reset token"})
		return
	}
	userID, subOk := claims["sub"].(string)
	if !subOk || userID == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired reset token"})
		return
	}

	var storedResetTokenHash sql.NullString
	var storedResetTokenExpiresAt sql.NullTime
	query := "SELECT id, reset_token_hash, reset_token_expires_at FROM users WHERE id = $1"
	err = h.App.DB.QueryRowContext(c.Request.Context(), query, userID).Scan(&userID, &storedResetTokenHash, &storedResetTokenExpiresAt)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired reset token"})
		return
	}
	if !storedResetTokenHash.Valid || storedResetTokenHash.String == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired reset token"})
		return
	}
	if !storedResetTokenExpiresAt.Valid || storedResetTokenExpiresAt.Time.Before(time.Now()) {
		invalidateQuery := "UPDATE users SET reset_token_hash = NULL, reset_token_expires_at = NULL, updated_at = NOW() WHERE id = $1"
		_, _ = h.App.DB.ExecContext(c.Request.Context(), invalidateQuery, userID)
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired reset token"})
		return
	}
	if storedResetTokenHash.String != req.Token {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired reset token"})
		return
	}

	newHashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), h.App.Config.PasswordHashCost)
	if err != nil {
		h.App.Logger.Error("Failed to hash new password during reset", zap.Error(err), zap.String("userID", userID))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error processing new password"})
		return
	}

	updateUserQuery := `
		UPDATE users
		SET password_hash = $1, reset_token_hash = NULL, reset_token_expires_at = NULL, updated_at = NOW()
		WHERE id = $2`
	_, err = h.App.DB.ExecContext(c.Request.Context(), updateUserQuery, string(newHashedPassword), userID)
	if err != nil {
		h.App.Logger.Error("Failed to update password and invalidate reset token", zap.Error(err), zap.String("userID", userID))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to reset password"})
		return
	}

	h.App.Logger.Info("Password reset successfully", zap.String("userID", userID))
	c.JSON(http.StatusOK, gin.H{"message": "Password has been reset successfully."})
}

// HandleVerifyEmail handles email verification
func (h *AuthHandler) HandleVerifyEmail(c *gin.Context) {
	// TODO: Implement email verification logic
	h.App.Logger.Info("Verify email endpoint hit, not implemented")
	c.JSON(http.StatusNotImplemented, gin.H{"message": "Not implemented yet"})
}

// HandleGoogleOAuth initiates Google OAuth flow
func (h *AuthHandler) HandleGoogleOAuth(c *gin.Context) {
	if h.App.GoogleOAuthConfig == nil {
		h.App.Logger.Error("Google OAuth not configured")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Google OAuth not configured"})
		return
	}

	state := uuid.NewString()
	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "oauthstate",
		Value:    state,
		Expires:  time.Now().Add(10 * time.Minute),
		HttpOnly: true,
		Secure:   h.App.Config.Env == "production",
		Path:     "/", // Ensure path is correct for callback
		SameSite: http.SameSiteLaxMode,
	})

	url := h.App.GoogleOAuthConfig.AuthCodeURL(state)
	h.App.Logger.Info("Redirecting to Google OAuth", zap.String("url", url))
	c.Redirect(http.StatusTemporaryRedirect, url)
}

// HandleGoogleCallback handles the callback from Google OAuth
func (h *AuthHandler) HandleGoogleCallback(c *gin.Context) {
	if h.App.GoogleOAuthConfig == nil {
		h.App.Logger.Error("Google OAuth not configured during callback")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Google OAuth not configured"})
		return
	}

	oauthStateCookie, err := c.Cookie("oauthstate")
	if err != nil {
		h.App.Logger.Error("OAuth state cookie not found", zap.Error(err))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid state: cookie not found"})
		return
	}
	http.SetCookie(c.Writer, &http.Cookie{
		Name: "oauthstate", Value: "", Expires: time.Now().Add(-1 * time.Hour),
		HttpOnly: true, Secure: h.App.Config.Env == "production", Path: "/", SameSite: http.SameSiteLaxMode,
	})

	if c.Query("state") != oauthStateCookie { // Corrected: oauthStateCookie.Value
		h.App.Logger.Error("Invalid OAuth state", zap.String("query_state", c.Query("state")), zap.String("cookie_state", oauthStateCookie))
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid state value."})
		return
	}

	code := c.Query("code")
	if code == "" {
		h.App.Logger.Error("OAuth code not found in query")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Code not found."})
		return
	}

	token, err := h.App.GoogleOAuthConfig.Exchange(c.Request.Context(), code)
	if err != nil {
		h.App.Logger.Error("Failed to exchange OAuth code for token", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to exchange code for token."})
		return
	}

	client := h.App.GoogleOAuthConfig.Client(c.Request.Context(), token)
	userInfoResp, err := client.Get("https://www.googleapis.com/oauth2/v2/userinfo")
	if err != nil {
		h.App.Logger.Error("Failed to get user info from Google", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get user info from Google."})
		return
	}
	defer userInfoResp.Body.Close()

	userInfoBody, err := io.ReadAll(userInfoResp.Body)
	if err != nil {
		h.App.Logger.Error("Failed to read user info response body", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to read user info."})
		return
	}

	var googleUser GoogleUserInfo
	if err := json.Unmarshal(userInfoBody, &googleUser); err != nil {
		h.App.Logger.Error("Failed to unmarshal Google user info", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse user info."})
		return
	}

	if googleUser.Email == "" {
		h.App.Logger.Error("Google user info does not contain an email")
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email not provided by Google."})
		return
	}

	var userID, userEmail string
	tx, err := h.App.DB.BeginTx(c.Request.Context(), nil)
	if err != nil {
		h.App.Logger.Error("Failed to start database transaction", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error."})
		return
	}
	defer tx.Rollback()

	var oauthUserID sql.NullString
	err = tx.QueryRowContext(c.Request.Context(),
		"SELECT user_id FROM oauth_accounts WHERE provider = 'google' AND provider_user_id = $1",
		googleUser.ID).Scan(&oauthUserID)

	if err == nil && oauthUserID.Valid {
		userID = oauthUserID.String
		err = tx.QueryRowContext(c.Request.Context(), "SELECT email FROM users WHERE id = $1", userID).Scan(&userEmail)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error."})
			return
		}
		updateUserQuery := `UPDATE users SET display_name = $1, avatar_url = $2, updated_at = NOW() WHERE id = $3`
		_, err = tx.ExecContext(c.Request.Context(), updateUserQuery, googleUser.Name, googleUser.Picture, userID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error."})
			return
		}
	} else if err == sql.ErrNoRows {
		var existingUserID, existingDisplayName string
		var existingAvatarURL sql.NullString
		err = tx.QueryRowContext(c.Request.Context(), "SELECT id, display_name, avatar_url FROM users WHERE email = $1", googleUser.Email).Scan(&existingUserID, &existingDisplayName, &existingAvatarURL)
		if err == nil { // User with email exists
			userID = existingUserID
			userEmail = googleUser.Email
			var conflictingProviderUserID sql.NullString
			err = tx.QueryRowContext(c.Request.Context(), "SELECT provider_user_id FROM oauth_accounts WHERE user_id = $1 AND provider = 'google'", userID).Scan(&conflictingProviderUserID)
			if err == nil && conflictingProviderUserID.Valid && conflictingProviderUserID.String != googleUser.ID {
				c.JSON(http.StatusConflict, gin.H{"error": "This account is already linked to a different Google profile."})
				return
			} else if err != sql.ErrNoRows {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error."})
				return
			}
			insertOAuthQuery := `INSERT INTO oauth_accounts (user_id, provider, provider_user_id) VALUES ($1, 'google', $2)`
			_, err = tx.ExecContext(c.Request.Context(), insertOAuthQuery, userID, googleUser.ID)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error."})
				return
			}
			if googleUser.Name != existingDisplayName || googleUser.Picture != existingAvatarURL.String {
				updateUserQuery := `UPDATE users SET display_name = $1, avatar_url = $2, updated_at = NOW() WHERE id = $3`
				_, err = tx.ExecContext(c.Request.Context(), updateUserQuery, googleUser.Name, googleUser.Picture, userID)
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error."})
					return
				}
			}
		} else if err == sql.ErrNoRows { // New user
			insertUserQuery := `INSERT INTO users (email, display_name, avatar_url, is_verified) VALUES ($1, $2, $3, TRUE) RETURNING id, email`
			err = tx.QueryRowContext(c.Request.Context(), insertUserQuery, googleUser.Email, googleUser.Name, googleUser.Picture).Scan(&userID, &userEmail)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user."})
				return
			}
			insertOAuthQuery := `INSERT INTO oauth_accounts (user_id, provider, provider_user_id) VALUES ($1, 'google', $2)`
			_, err = tx.ExecContext(c.Request.Context(), insertOAuthQuery, userID, googleUser.ID)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error."})
				return
			}
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error."})
			return
		}
	} else {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error."})
		return
	}

	if err = tx.Commit(); err != nil {
		h.App.Logger.Error("Failed to commit transaction for Google OAuth", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error."})
		return
	}

	signedAccessToken, signedRefreshToken, err := GenerateTokens(h.App, userID, userEmail)
	if err != nil {
		h.App.Logger.Error("Failed to generate tokens for Google OAuth user", zap.Error(err))
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate tokens."})
		return
	}

	h.App.Logger.Info("User authenticated via Google OAuth successfully", zap.String("userID", userID), zap.String("email", userEmail))
	redirectTargetURL := h.App.Config.FrontendOAuthCallbackURL
	if redirectTargetURL == "" {
		h.App.Logger.Error("FrontendOAuthCallbackURL is not configured or is empty!")
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Frontend redirect URL not configured."})
		return
	}
	parsedURL, err := url.Parse(redirectTargetURL)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Internal server error during redirect setup."})
		return
	}
	query := parsedURL.Query()
	query.Set("access_token", signedAccessToken)
	query.Set("refresh_token", signedRefreshToken)
	parsedURL.RawQuery = query.Encode()
	c.Redirect(http.StatusTemporaryRedirect, parsedURL.String())
}

// HandleAppleOAuth initiates Apple OAuth flow
func (h *AuthHandler) HandleAppleOAuth(c *gin.Context) {
	h.App.Logger.Info("Apple OAuth endpoint hit, not implemented")
	c.JSON(http.StatusNotImplemented, gin.H{"message": "Not implemented yet"})
}

// HandleAppleCallback handles the callback from Apple OAuth
func (h *AuthHandler) HandleAppleCallback(c *gin.Context) {
	h.App.Logger.Info("Apple OAuth callback endpoint hit, not implemented")
	c.JSON(http.StatusNotImplemented, gin.H{"message": "Not implemented yet"})
}

// HandleGetCurrentUser fetches details of the currently authenticated user
func (h *AuthHandler) HandleGetCurrentUser(c *gin.Context) {
	userIDAny, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in token"})
		return
	}
	userIDStr, ok := userIDAny.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid User ID format in token"})
		return
	}

	query := `
		SELECT id, display_name, email, avatar_url, role, is_verified, user_type, classroom_code, onboarding_complete, selected_curriculum_id
		FROM users WHERE id = $1`
	var user CurrentUserResponse
	err := h.App.DB.QueryRowContext(c.Request.Context(), query, userIDStr).Scan(
		&user.ID, &user.DisplayName, &user.Email, &user.AvatarURL, &user.Role, &user.IsVerified,
		&user.UserType, &user.ClassroomCode, &user.OnboardingComplete, &user.SelectedCurriculumID,
	)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch user details"})
		return
	}
	c.JSON(http.StatusOK, user)
}

// HandleUpdateCurrentUser updates details of the currently authenticated user
func (h *AuthHandler) HandleUpdateCurrentUser(c *gin.Context) {
	userIDAny, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in token"})
		return
	}
	userIDStr, ok := userIDAny.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid User ID format in token"})
		return
	}

	var req UpdateCurrentUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload: " + err.Error()})
		return
	}
	if req.DisplayName == nil && req.AvatarURL == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "At least one field must be provided for update."})
		return
	}

	queryBuilder := strings.Builder{}
	queryBuilder.WriteString("UPDATE users SET ")
	args := []interface{}{}
	paramCount := 1
	if req.DisplayName != nil {
		queryBuilder.WriteString(fmt.Sprintf("display_name = $%d, ", paramCount))
		args = append(args, *req.DisplayName)
		paramCount++
	}
	if req.AvatarURL != nil {
		queryBuilder.WriteString(fmt.Sprintf("avatar_url = $%d, ", paramCount))
		args = append(args, *req.AvatarURL)
		paramCount++
	}
	queryBuilder.WriteString(fmt.Sprintf("updated_at = NOW() WHERE id = $%d", paramCount))
	args = append(args, userIDStr)

	_, err := h.App.DB.ExecContext(c.Request.Context(), queryBuilder.String(), args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update user details"})
		return
	}

	fetchQuery := `
		SELECT id, display_name, email, avatar_url, role, is_verified, user_type, classroom_code, onboarding_complete, selected_curriculum_id
		FROM users WHERE id = $1`
	var updatedUser CurrentUserResponse
	err = h.App.DB.QueryRowContext(c.Request.Context(), fetchQuery, userIDStr).Scan(
		&updatedUser.ID, &updatedUser.DisplayName, &updatedUser.Email, &updatedUser.AvatarURL, &updatedUser.Role, &updatedUser.IsVerified,
		&updatedUser.UserType, &updatedUser.ClassroomCode, &updatedUser.OnboardingComplete, &updatedUser.SelectedCurriculumID,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve updated user details"})
		return
	}
	c.JSON(http.StatusOK, updatedUser)
}

// HandleChangePassword handles password change requests for authenticated users
func (h *AuthHandler) HandleChangePassword(c *gin.Context) {
	userIDAny, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in token"})
		return
	}
	userIDStr, ok := userIDAny.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid User ID format in token"})
		return
	}

	var req ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload: " + err.Error()})
		return
	}

	var currentPasswordHash string
	query := "SELECT password_hash FROM users WHERE id = $1"
	err := h.App.DB.QueryRowContext(c.Request.Context(), query, userIDStr).Scan(&currentPasswordHash)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error fetching user details"})
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(currentPasswordHash), []byte(req.OldPassword))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect old password"})
		return
	}

	newHashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), h.App.Config.PasswordHashCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error processing new password"})
		return
	}

	updateQuery := "UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2"
	_, err = h.App.DB.ExecContext(c.Request.Context(), updateQuery, string(newHashedPassword), userIDStr)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update password"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Password changed successfully"})
}

// HandleDeleteAccount handles account deletion for authenticated users
func (h *AuthHandler) HandleDeleteAccount(c *gin.Context) {
	userIDAny, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in token"})
		return
	}
	userIDStr, ok := userIDAny.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid User ID format in token"})
		return
	}

	query := "DELETE FROM users WHERE id = $1"
	_, err := h.App.DB.ExecContext(c.Request.Context(), query, userIDStr)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete account"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Account deleted successfully"})
}

// HandleUpdateOnboardingDetails updates user's onboarding information
func (h *AuthHandler) HandleUpdateOnboardingDetails(c *gin.Context) {
	userIDAny, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in token"})
		return
	}
	userIDStr, ok := userIDAny.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid User ID format in token"})
		return
	}

	var req OnboardingDetailsRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload: " + err.Error()})
		return
	}
	if req.UserType == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User type is required"})
		return
	}

	var classroomCodeArg interface{}
	if req.ClassroomCode == "" {
		classroomCodeArg = nil
	} else {
		classroomCodeArg = req.ClassroomCode
	}

	updateQuery := `
		UPDATE users SET user_type = $1, classroom_code = $2, onboarding_complete = TRUE, updated_at = NOW()
		WHERE id = $3`
	_, err := h.App.DB.ExecContext(c.Request.Context(), updateQuery, req.UserType, classroomCodeArg, userIDStr)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update onboarding details"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Onboarding details updated successfully"})
}

// HandleUpdateUserCurriculum updates the user's selected curriculum
func (h *AuthHandler) HandleUpdateUserCurriculum(c *gin.Context) {
	userIDAny, exists := c.Get("userId")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found in token"})
		return
	}
	userIDStr, ok := userIDAny.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid User ID format in token"})
		return
	}

	var req UpdateCurriculumRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload: " + err.Error()})
		return
	}
	if req.SelectedCurriculumID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Selected curriculum ID is required"})
		return
	}

	updateQuery := `UPDATE users SET selected_curriculum_id = $1, updated_at = NOW() WHERE id = $2`
	_, err := h.App.DB.ExecContext(c.Request.Context(), updateQuery, req.SelectedCurriculumID, userIDStr)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update curriculum selection"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "User curriculum updated successfully"})
}
