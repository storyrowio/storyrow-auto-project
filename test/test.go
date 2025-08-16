package test

import (
	"encoding/json"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"regexp"
	"strings"
)

type PackageJSON struct {
	Dependencies    map[string]string `json:"dependencies"`
	DevDependencies map[string]string `json:"devDependencies"`
}

func main() {
	root := "C:\\Projects\\OpenSource\\mealscape" // project root

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
	filepath.WalkDir(root, func(path string, d fs.DirEntry, err error) error {
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
			if strings.HasPrefix(imp, ".") || strings.HasPrefix(imp, "/") {
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
	if len(missing) == 0 {
		fmt.Println("✅ No missing dependencies found!")
	} else {
		fmt.Println("⚠️ Missing dependencies:")
		for dep := range missing {
			fmt.Println("-", dep)
		}
	}
}
