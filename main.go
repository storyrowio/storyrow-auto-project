package main

import (
	_ "bufio"
	"flag"
	"fmt"
	"log"
	"os"
	"path/filepath"
	_ "runtime"
	"storyrow-auto-project/functions"
	"storyrow-auto-project/lib"
	_ "strings"

	"github.com/fatih/color"
)

func main() {
	cfg := parseFlags()

	//err := functions.ApplyAuthPrismaTemplate("with-auth-prisma", cfg.ProjectName)

	err := runSetup(&cfg)
	if err != nil {
		fmt.Printf("\n✖ Error: %v\n", err)
		fmt.Println("\nUsage:")
		flag.PrintDefaults()
		os.Exit(1)
	}

	fmt.Printf("\n✔ Project created successfully at: %s\n", filepath.Join(cfg.OutputDir, cfg.ProjectName))
	fmt.Println("\nNext steps:")
	fmt.Printf("1. cd %s\n", filepath.Join(cfg.OutputDir, cfg.ProjectName))
	fmt.Printf("2. %s run dev\n", functions.GetPackageManager(&cfg))
}

func parseFlags() functions.Config {
	var cfg functions.Config

	flag.StringVar(&cfg.ProjectName, "name", "", "Project name (required)")
	flag.StringVar(&cfg.OutputDir, "output", ".", "Output directory")
	flag.BoolVar(&cfg.WithAuth, "with-auth", false, "Include NextAuth.js")
	flag.BoolVar(&cfg.WithPrisma, "with-prisma", false, "Include Prisma ORM")
	flag.BoolVar(&cfg.WithShadcn, "with-shadcn", false, "Include shadcn/ui")
	flag.StringVar(&cfg.TemplateName, "template", "default", "Template name")
	flag.BoolVar(&cfg.LocalTemplate, "local-template", false, "Use local template")
	flag.BoolVar(&cfg.UseYarn, "use-yarn", false, "Use Yarn instead of npm")

	flag.Parse()

	if cfg.ProjectName == "" {
		fmt.Println("Error: Project name is required")
		fmt.Println("Usage:")
		flag.PrintDefaults()
		os.Exit(1)
	}

	if cfg.WithAuth {
		cfg.TemplateName = "with-auth-prisma"
	}

	return cfg
}

func runSetup(cfg *functions.Config) error {
	// Set Template Dir
	functions.TemplateDirectory = filepath.Join(lib.GetProjectRoot(), "templates")
	functions.BaseDirectory = filepath.Join(lib.GetProjectRoot(), "base")

	projectPath := filepath.Join(cfg.OutputDir, cfg.ProjectName)
	if err := os.Chdir(projectPath); err != nil {
		return err
	}

	// Delete later
	_, err := os.Stat(projectPath)
	if err == nil {
		log.Println("Delete Existing Project")
		if err := functions.DetectMissingDeps(filepath.Join(cfg.OutputDir, cfg.ProjectName)); err != nil {
			color.Red("Warning: Dependency check failed: %v", err)
			return fmt.Errorf("failed to install missing dependencies: %w", err)
		}

		return nil
		//err = os.RemoveAll(filepath.Join(cfg.OutputDir, cfg.ProjectName))
		//if err != nil {
		//	fmt.Printf("Error removing directory and contents: %v\n", err)
		//} else {
		//	fmt.Printf("Directory '%s' and its contents removed successfully.\n", filepath.Join(cfg.OutputDir, cfg.ProjectName))
		//}
	}

	// 1. Create Next.js project
	if err := functions.CreateNextApp(cfg); err != nil {
		return fmt.Errorf("failed to create Next.js app: %w", err)
	}

	if err := functions.ApplyAuthPrismaTemplate(cfg.TemplateName, projectPath); err != nil {
		return fmt.Errorf("failed to apply local template: %w", err)
	}

	// 3. Install additional features
	if err := functions.InstallFeatures(cfg); err != nil {
		return fmt.Errorf("failed to install features: %w", err)
	}

	// 4. Detect missing dependencies
	if err := functions.DetectMissingDeps(projectPath); err != nil {
		color.Yellow("Warning: Dependency check failed: %v", err)
	}

	return nil
}
