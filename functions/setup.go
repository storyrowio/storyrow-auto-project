package functions

import (
	"fmt"
	"github.com/fatih/color"
	"io/fs"
	"log"
	"os"
	"path/filepath"
	"storyrow-auto-project/lib"
	"strings"
)

type SourceDestination struct {
	Source      string
	Destination string
}

func CreateProjectDirectory(cfg *Config) error {
	projectPath := filepath.Join(cfg.OutputDir, cfg.ProjectName)

	_, err := os.Stat(projectPath)
	if err != nil || os.IsNotExist(err) {
		err := os.Mkdir(projectPath, 0770)
		if err != nil {
			return err
		}
	} else if os.IsExist(err) {
		return nil
	}

	if cfg.WithGoApi {
		// Create client
		clientDir := filepath.Join(projectPath, "client")
		_, err := os.Stat(clientDir)
		if err != nil || os.IsNotExist(err) {
			err := os.Mkdir(clientDir, 0770)
			if err != nil {
				return err
			}
		}

		// Create server
		serverDir := filepath.Join(projectPath, "server")
		_, err = os.Stat(serverDir)
		if err != nil || os.IsNotExist(err) {
			err := os.Mkdir(serverDir, 0770)
			if err != nil {
				return err
			}
		}
	}

	return nil
}

func DeleteProjectDirectory(cfg *Config) error {
	projectPath := filepath.Join(cfg.OutputDir, cfg.ProjectName)

	_, err := os.Stat(projectPath)
	if err == nil {
		log.Println("Delete Existing Project")
		//if err := functions.DetectMissingDeps(filepath.Join(cfg.OutputDir, cfg.ProjectName)); err != nil {
		//	color.Red("Warning: Dependency check failed: %v", err)
		//	return fmt.Errorf("failed to install missing dependencies: %w", err)
		//}
		//
		//return nil
		err = os.RemoveAll(filepath.Join(cfg.OutputDir, cfg.ProjectName))
		if err != nil {
			fmt.Printf("Error removing directory and contents: %v\n", err)
		} else {
			fmt.Printf("Directory '%s' and its contents removed successfully.\n", filepath.Join(cfg.OutputDir, cfg.ProjectName))
		}
	}

	return nil
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

func ApplyAuthPrismaTemplate(cfg *Config) error {
	templateName := "with-auth-prisma"
	projectRoot := lib.GetProjectRoot()
	projectPath := cfg.ProjectPath
	templateDir := TemplateDirectory
	baseDir := BaseDirectory
	log.Println("Template Path:", baseDir)
	log.Println("ProjectRoot:", projectRoot)

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

func ApplyGoApiTemplate(cfg *Config) error {
	templateName := "with-go-api"
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

	cfg.ServerOutputDir = filepath.Join(cfg.ProjectPath, "server")

	directories := []SourceDestination{
		{Source: filepath.Join(TemplateDirectory, templateName, "cmd"), Destination: filepath.Join(cfg.ServerOutputDir, "cmd")},
		{Source: filepath.Join(TemplateDirectory, templateName, "internal"), Destination: filepath.Join(cfg.ServerOutputDir, "internal")},
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

	authFiles := []SourceDestination{
		{Source: filepath.Join(TemplateDirectory, templateName, ".env.example"), Destination: filepath.Join(cfg.ServerOutputDir, ".env.example")},
		{Source: filepath.Join(TemplateDirectory, templateName, "go.mod"), Destination: filepath.Join(cfg.ServerOutputDir, "go.mod")},
		{Source: filepath.Join(TemplateDirectory, templateName, "init.json"), Destination: filepath.Join(cfg.ServerOutputDir, "init.json")},
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

	oldString := "with-go-api"
	newString := cfg.ProjectName

	err = filepath.WalkDir(cfg.ServerOutputDir, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if d.IsDir() {
			return nil
		}

		content, err := os.ReadFile(path)
		if err != nil {
			return err
		}

		newContent := strings.ReplaceAll(string(content), oldString, newString)
		if newContent != string(content) {
			err = os.WriteFile(path, []byte(newContent), 0644)
			if err != nil {
				return err
			}
			fmt.Println("Updated:", path)
		}
		return nil
	})

	if err != nil {
		fmt.Println("Error:", err)
	}

	return nil
}
