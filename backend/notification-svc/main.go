package main

import (
	"bytes"
	"encoding/json"
	"html/template"
	"log"
	"path/filepath"
	"time"

	"github.com/streadway/amqp"
	"gopkg.in/gomail.v2"
)

// EmailRequest defines the structure for email sending requests
type EmailRequest struct {
	To           string                 `json:"to"`
	Subject      string                 `json:"subject"`
	HTMLBody     string                 `json:"html_body,omitempty"` // Keep for direct HTML body, or make it optional
	TemplateName string                 `json:"template_name,omitempty"`
	TemplateData map[string]interface{} `json:"template_data,omitempty"`
}

// buildMessageAndProcessTemplate handles template processing and gomail.Message construction.
// It takes templateBasePath to allow tests to specify a different root for the 'templates' directory.
// For normal operation, templateBasePath can be "." or an empty string.
func buildMessageAndProcessTemplate(cfg *Config, to, subject, htmlBody, templateName string, templateData interface{}, templateBasePath string) (*gomail.Message, string, error) {
	var finalHTMLBody string
	if templateName != "" {
		log.Printf("Using template: %s for email to %s", templateName, to)
		// Construct path relative to templateBasePath
		// If templateBasePath is "", it defaults to "templates/templateName"
		// If templateBasePath is ".", it's "./templates/templateName"
		// If templateBasePath is "some/path", it's "some/path/templates/templateName"
		actualTemplatePath := filepath.Join(templateBasePath, "templates", templateName)

		// Use Option("missingkey=error") to ensure errors on missing keys
		tmpl := template.New(filepath.Base(templateName)).Option("missingkey=error")
		t, err := tmpl.ParseFiles(actualTemplatePath)
		if err != nil {
			log.Printf("Error parsing template %s (path: %s): %v", templateName, actualTemplatePath, err)
			return nil, "", err // Return error to indicate failure
		}
		var body bytes.Buffer
		if err := t.Execute(&body, templateData); err != nil {
			log.Printf("Error executing template %s for %s: %v", templateName, to, err)
			return nil, "", err // Return error
		}
		finalHTMLBody = body.String()
	} else if htmlBody != "" {
		log.Printf("Using provided HTML body for email to %s", to)
		finalHTMLBody = htmlBody
	} else {
		log.Printf("No HTML body or template name provided for email to %s. Using default.", to)
		finalHTMLBody = "<p>This is a default message because no specific content was provided.</p>"
	}

	m := gomail.NewMessage()
	m.SetHeader("From", cfg.SenderEmail)
	m.SetHeader("To", to)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", finalHTMLBody)

	return m, finalHTMLBody, nil
}

// sendEmail constructs and sends an email using gomail.
func sendEmail(cfg *Config, to, subject, htmlBody, templateName string, templateData interface{}, templateBasePath string) error {
	log.Printf("Attempting to send email to: %s, Subject: %s, Template: %s", to, subject, templateName)

	msg, _, err := buildMessageAndProcessTemplate(cfg, to, subject, htmlBody, templateName, templateData, templateBasePath)
	if err != nil {
		// Error already logged by buildMessageAndProcessTemplate
		return err // Propagate error
	}

	// Dialer settings from config
	// Note: For real-world scenarios, consider TLS/SSL settings more carefully.
	// d.TLSConfig = &tls.Config{InsecureSkipVerify: true} // Only for dev/test if server has self-signed cert
	d := gomail.NewDialer(cfg.SMTPHost, cfg.SMTPPort, cfg.SMTPUser, cfg.SMTPPass)

	if err := d.DialAndSend(msg); err != nil {
		log.Printf("Failed to send email to %s. Subject: '%s'. Error: %v", to, subject, err)
		return err
	}

	log.Printf("Email sent successfully to %s. Subject: '%s'", to, subject)
	return nil
}


func main() {
	log.Println("Starting Notification Service...")

	cfg, err := loadConfig()
	if err != nil {
		log.Fatalf("Failed to load configuration: %v", err)
	}

	log.Printf("RabbitMQ URI: %s", cfg.RabbitMQURI) // Log the URI to verify

	var conn *amqp.Connection
	var channel *amqp.Channel
	var errConn, errChan error

	// Retry connecting to RabbitMQ
	maxRetries := 10
	retryDelay := 5 * time.Second

	for i := 0; i < maxRetries; i++ {
		conn, errConn = amqp.Dial(cfg.RabbitMQURI)
		if errConn == nil {
			log.Println("Successfully connected to RabbitMQ")
			channel, errChan = conn.Channel()
			if errChan == nil {
				log.Println("Successfully opened RabbitMQ channel")
				break
			}
			log.Printf("Failed to open RabbitMQ channel (attempt %d/%d): %v", i+1, maxRetries, errChan)
			conn.Close() // Close connection if channel opening failed
		}
		log.Printf("Failed to connect to RabbitMQ (attempt %d/%d): %v. Retrying in %s...", i+1, maxRetries, errConn, retryDelay)
		time.Sleep(retryDelay)
	}

	if errConn != nil {
		log.Fatalf("Failed to connect to RabbitMQ after %d retries: %v", maxRetries, errConn)
	}
	if errChan != nil {
		log.Fatalf("Failed to open RabbitMQ channel after successful connection: %v", errChan)
	}

	defer conn.Close()
	defer channel.Close()

	q, err := channel.QueueDeclare(
		"email_notifications", // name
		true,                  // durable
		false,                 // delete when unused
		false,                 // exclusive
		false,                 // no-wait
		nil,                   // arguments
	)
	if err != nil {
		log.Fatalf("Failed to declare a queue: %v", err)
	}

	msgs, err := channel.Consume(
		q.Name, // queue
		"",     // consumer
		true,   // auto-ack
		false,  // exclusive
		false,  // no-local
		false,  // no-wait
		nil,    // args
	)
	if err != nil {
		log.Fatalf("Failed to register a consumer: %v", err)
	}

	log.Println("Waiting for email notification messages. To exit press CTRL+C")

	forever := make(chan bool)

	go func() {
		for d := range msgs {
			log.Printf("Received a message: %s", d.Body)
			var emailReq EmailRequest
			if err := json.Unmarshal(d.Body, &emailReq); err != nil {
				log.Printf("Error deserializing message: %s. Body: %s", err, d.Body)
				// TODO: Implement dead-letter queue or other error handling
				continue
			}

			log.Printf("Deserialized request: To=%s, Subject=%s, Template=%s", emailReq.To, emailReq.Subject, emailReq.TemplateName)

			// Pass the relevant fields to sendEmail.
			// For normal operation, templateBasePath is "." (current dir), so it looks for "./templates/..."
			if err := sendEmail(cfg, emailReq.To, emailReq.Subject, emailReq.HTMLBody, emailReq.TemplateName, emailReq.TemplateData, "."); err != nil {
				log.Printf("Error processing email request for %s: %v", emailReq.To, err)
				// TODO: Decide if message should be re-queued or sent to DLQ
			} else {
				log.Printf("Successfully processed email request for %s, Template: %s", emailReq.To, emailReq.TemplateName)
			}
		}
	}()

	<-forever
}
