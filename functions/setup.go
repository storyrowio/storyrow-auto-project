package functions

import (
	"fmt"
	"github.com/fatih/color"
	"log"
	"os"
	"path/filepath"
	"storyrow-auto-project/lib"
)

type SourceDestination struct {
	Source      string
	Destination string
}

func SetupNextAuthFiles() error {
	// Path to our auth template files
	authTemplatePath := filepath.Join("templates", "with-auth-prisma")

	// Verify template exists
	if _, err := os.Stat(authTemplatePath); os.IsNotExist(err) {
		return fmt.Errorf("auth template not found at %s", authTemplatePath)
	}

	color.Blue("Setting up NextAuth.js files...")

	// Files to copy from template
	authFiles := []struct {
		src  string
		dest string
	}{
		{"auth-config.ts", "src/lib/auth-config.ts"},
		{"[...nextauth]/route.ts", "src/app/api/auth/[...nextauth]/route.ts"},
		{"middleware.ts", "src/middleware.ts"},
		{"prisma-schema.prisma", "prisma/schema.prisma"},
	}

	// Copy each auth file
	for _, file := range authFiles {
		srcPath := filepath.Join(authTemplatePath, file.src)
		destPath := filepath.Join(".", file.dest)

		// Create destination directory if needed
		if err := os.MkdirAll(filepath.Dir(destPath), 0755); err != nil {
			return fmt.Errorf("failed to create directory for %s: %w", file.dest, err)
		}

		if err := lib.CopyFile(srcPath, destPath); err != nil {
			return fmt.Errorf("failed to copy %s: %w", file.src, err)
		}
	}

	// Update .env with database URL
	envPath := filepath.Join(".", ".env")
	envFile, err := os.OpenFile(envPath, os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return fmt.Errorf("failed to open .env file: %w", err)
	}
	defer envFile.Close()

	if _, err := envFile.WriteString("\nDATABASE_URL=\"file:./dev.db\"\n"); err != nil {
		return fmt.Errorf("failed to write to .env: %w", err)
	}

	return nil
}

func ApplyAuthPrismaTemplate(templateName string, projectPath string) error {
	projectRoot := lib.GetProjectRoot()
	log.Println("ProjectRoot:", projectRoot)
	templateDir := TemplateDirectory
	baseDir := BaseDirectory
	log.Println("Template Path:", baseDir)

	templatePath := filepath.Join(templateDir, templateName)
	log.Println(" ")
	_, err := os.Stat(templatePath)
	if err != nil {
		return err
	}

	color.Blue("Applying local template: %s", templateName)

	// Copy base files and folder

	directories := []SourceDestination{
		{Source: filepath.Join(TemplateDirectory, templateName, "base", "prisma"), Destination: filepath.Join(projectPath, "prisma")},
		{Source: filepath.Join(TemplateDirectory, templateName, "src"), Destination: filepath.Join(projectPath, "src")},
	}

	authFiles := []SourceDestination{
		{Source: filepath.Join(TemplateDirectory, templateName, "base", "eslint.config.mjs"), Destination: filepath.Join(projectPath, "eslint.config.mjs")},
		{Source: filepath.Join(TemplateDirectory, templateName, "base", ".env"), Destination: filepath.Join(projectPath, ".env")},
		//{filepath.Join(TemplateDirectory, templateName, "auth.ts"), filepath.Join(projectPath, "src", "auth.ts")},
		//{filepath.Join(TemplateDirectory, templateName, "middleware.ts"), filepath.Join(projectPath, "src", "middleware.ts")},
	}

	for _, file := range authFiles {
		if err := os.MkdirAll(filepath.Dir(file.Destination), 0755); err != nil {
			return fmt.Errorf("failed to create directory for %s: %w", file.Destination, err)
		}

		color.Blue(fmt.Sprintf("Copying %s file ...", file.Source))
		if err := lib.CopyFile(file.Source, file.Destination); err != nil {
			return fmt.Errorf("failed to copy %s: %w", file.Source, err)
		}
	}

	for _, file := range directories {
		if err := os.MkdirAll(filepath.Dir(file.Destination), 0755); err != nil {
			return fmt.Errorf("failed to create directory for %s: %w", file.Destination, err)
		}

		color.Blue(fmt.Sprintf("Copying %s directory ...", file.Source))
		if err := lib.CopyDir(file.Source, file.Destination); err != nil {
			return fmt.Errorf("failed to copy %s: %w", file.Source, err)
		}
	}

	return nil
}
