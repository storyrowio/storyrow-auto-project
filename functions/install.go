package functions

import (
	"encoding/json"
	"fmt"
	"github.com/fatih/color"
	"io/fs"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"slices"
	"storyrow-auto-project/lib"
	"strings"
)

type PackageJSON struct {
	Dependencies    map[string]string `json:"dependencies"`
	DevDependencies map[string]string `json:"devDependencies"`
}

func GetPackageManager(cfg *Config) string {
	if cfg.UseYarn {
		return "yarn"
	}
	return "npm"
}

func CreateNextApp(cfg *Config) error {
	color.Blue("Creating Next.js project: %s", cfg.ProjectName)

	args := []string{
		"create-next-app@latest",
		filepath.Join(cfg.OutputDir, cfg.ProjectName),
		"--ts",
		"--tailwind",
		"--eslint",
		"--app",
		"--src-dir",
		"--import-alias", "@/",
		"--use-" + GetPackageManager(cfg),
		"--yes",
	}

	return lib.RunCommand("npx", args...)
}

func InstallFeatures(cfg *Config) error {
	pkgManager := GetPackageManager(cfg)
	args := []string{pkgManager}
	if pkgManager == "yarn" {
		args = append(args, "add")
	} else {
		args = append(args, "install")
	}

	// Default package
	args = append(args, "tailwindcss-animate")

	if cfg.WithAuth {
		color.Blue("Setting up NextAuth.js...")
		args = append(args, "next-auth@beta")
	}

	if cfg.WithPrisma {
		color.Blue("Setting up Prisma...")
		args = append(args, "prisma", "@prisma/client")
	}

	if len(args) > 2 { // Only run if we have packages to install
		return lib.RunCommand(args[0], args[1:]...)
	}

	provider := "mongodb"
	if err := lib.RunCommand("npx", "prisma", "init", "--datasource-provider", provider); err != nil {
		return fmt.Errorf("failed to initialize Prisma: %w", err)
	}

	// Generate Prisma client
	if err := lib.RunCommand("npx", "prisma", "generate"); err != nil {
		return fmt.Errorf("failed to generate Prisma client: %w", err)
	}

	return nil
}

func FindMissingPackages(projectPath string) []string {
	root := projectPath // project root
	excludePackages := []string{
		"uri-js",
		"fs",
		"path",
	}
	// 1. Load package.json
	pkgData, err := os.ReadFile(filepath.Join(root, "package.json"))
	if err != nil {
		panic(err)
	}

	var pkg PackageJSON
	if err := json.Unmarshal(pkgData, &pkg); err != nil {
		panic(err)
	}

	deps := make(map[string]bool)
	for dep := range pkg.Dependencies {
		deps[dep] = true
	}
	for dep := range pkg.DevDependencies {
		deps[dep] = true
	}

	// 2. Regex for imports/requires
	importRegex := regexp.MustCompile(`(?:import\s+(?:.+\s+from\s+)?|require\()\s*['"]([^'"]+)['"]`)
	missing := make(map[string]bool)

	// 3. Walk project files
	log.Println("Search missing dependencies ...")
	srcRoot := filepath.Join(root, "src")
	filepath.WalkDir(srcRoot, func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if d.IsDir() {
			return nil
		}

		ext := filepath.Ext(d.Name())
		if ext != ".ts" && ext != ".tsx" && ext != ".js" && ext != ".jsx" {
			return nil
		}

		content, err := os.ReadFile(path)
		if err != nil {
			return nil
		}

		// 4. Find imports
		matches := importRegex.FindAllStringSubmatch(string(content), -1)
		for _, m := range matches {
			imp := m[1]

			// Ignore relative imports
			if strings.HasPrefix(imp, ".") || strings.HasPrefix(imp, "/") ||
				strings.HasPrefix(imp, "@/") || strings.HasPrefix(imp, "node:") ||
				slices.Contains(excludePackages, imp) {
				continue
			}

			// Only check the first part (in case of scoped packages like @mui/material)
			mainPkg := imp
			if strings.HasPrefix(imp, "@") {
				parts := strings.SplitN(imp, "/", 2)
				if len(parts) > 1 {
					mainPkg = parts[0] + "/" + parts[1]
				}
			} else {
				parts := strings.SplitN(imp, "/", 2)
				mainPkg = parts[0]
			}

			if !deps[mainPkg] {
				missing[mainPkg] = true
			}
		}
		return nil
	})

	// 5. Print missing deps
	missingPackages := make([]string, 0, len(missing))
	if len(missing) == 0 {
		fmt.Println("✅ No missing dependencies found!")
	} else {
		fmt.Println("⚠️ Missing dependencies:")
		for dep := range missing {
			fmt.Println("-", dep)
			missingPackages = append(missingPackages, dep)
		}
	}

	return missingPackages
}

func InstallMissingDeps(packages []string) ([]string, []string) {
	pkgManager := "npm"
	if _, err := os.Stat("yarn.lock"); err == nil {
		pkgManager = "yarn"
	}

	color.Yellow("Installing %d missing packages...", len(packages))

	var successPkgs []string
	var failedPkgs []string

	for _, pkg := range packages {
		args := []string{pkgManager}
		if pkgManager == "yarn" {
			args = append(args, "add")
		} else {
			args = append(args, "install")
		}
		args = append(args, pkg)

		cmd := exec.Command(args[0], args[1:]...)
		cmd.Stdout = os.Stdout
		cmd.Stderr = os.Stderr

		if err := cmd.Run(); err != nil {
			color.Red("✖ Failed to install %s: %v", pkg, err)
			failedPkgs = append(failedPkgs, pkg)
			continue // Skip to next package
		}

		successPkgs = append(successPkgs, pkg)
		color.Green("✔ Successfully installed %s", pkg)
	}

	// Print summary
	color.Cyan("\nInstallation Summary:")
	color.Green("Success: %d packages", len(successPkgs))
	if len(failedPkgs) > 0 {
		color.Red("Failed: %d packages", len(failedPkgs))
		color.Yellow("Failed packages: %v", failedPkgs)
	}

	if len(failedPkgs) > 0 {
		fmt.Printf("failed to install %d packages", len(failedPkgs))
	}
	return successPkgs, failedPkgs
}

func DetectMissingDeps(projectPath string) error {
	color.Blue("Analyzing dependencies...")
	missing := FindMissingPackages(projectPath)
	if len(missing) > 0 {
		color.Yellow("Found missing dependencies: %v", missing)
		success, failed := InstallMissingDeps(missing)

		color.Green("Success: %d packages", len(success))
		color.Red("Failed: %d packages", len(failed))
	}

	color.Green("All dependencies are accounted for")
	return nil
}
