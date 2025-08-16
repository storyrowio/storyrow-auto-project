package lib

import (
	"fmt"
	"io"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

func CopyFile(src, dst string) error {
	srcFile, err := os.Open(src)
	if err != nil {
		return err
	}
	defer srcFile.Close()

	dstFile, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer dstFile.Close()

	_, err = io.Copy(dstFile, srcFile)
	return err
}

func CopyDir(src, dst string) error {
	// Create the destination directory if it doesn't exist
	if err := os.MkdirAll(dst, 0755); err != nil {
		return fmt.Errorf("failed to create destination directory: %w", err)
	}

	return filepath.Walk(src, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		relPath, err := filepath.Rel(src, path)
		if err != nil {
			return fmt.Errorf("failed to get relative path: %w", err)
		}

		destPath := filepath.Join(dst, relPath)

		if info.IsDir() {
			if err := os.MkdirAll(destPath, info.Mode()); err != nil {
				return fmt.Errorf("failed to create directory %s: %w", destPath, err)
			}
		} else {
			// Copy file
			srcFile, err := os.Open(path)
			if err != nil {
				return fmt.Errorf("failed to open source file %s: %w", path, err)
			}
			defer srcFile.Close()

			dstFile, err := os.Create(destPath)
			if err != nil {
				return fmt.Errorf("failed to create destination file %s: %w", destPath, err)
			}
			defer dstFile.Close()

			if _, err := io.Copy(dstFile, srcFile); err != nil {
				return fmt.Errorf("failed to copy file %s to %s: %w", path, destPath, err)
			}

			if err := os.Chmod(destPath, info.Mode()); err != nil {
				return fmt.Errorf("failed to set permissions for %s: %w", destPath, err)
			}
		}
		return nil
	})
}

func RunCommand(name string, arg ...string) error {
	cmd := exec.Command(name, arg...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

func GetProjectRoot() string {
	cwd, _ := os.Getwd()
	return cwd
}

func GetTemplateDir() string {
	possiblePaths := []string{
		filepath.Join(".", "templates"),                      // Current directory
		filepath.Join(filepath.Dir(os.Args[0]), "templates"), // Executable directory
		filepath.Join(GetProjectRoot(), "templates"),         // Project root
	}

	for _, path := range possiblePaths {
		if _, err := os.Stat(path); err == nil {
			return path
		}
	}

	return "templates" // Default fallback
}

func GetBuiltinModules() []string {
	return []string{
		"assert", "async_hooks", "buffer", "child_process",
		"cluster", "console", "constants", "crypto",
		"dgram", "diagnostics_channel", "dns", "domain",
		"events", "fs", "http", "http2", "https",
		"inspector", "module", "net", "os", "path",
		"perf_hooks", "process", "punycode", "querystring",
		"readline", "repl", "stream", "string_decoder",
		"timers", "tls", "trace_events", "tty",
		"url", "util", "v8", "vm",
		"wasi", "worker_threads", "zlib",
		"node:test", "test",
	}
}

func IsPrismaError(msg string) bool {
	return strings.Contains(msg, "must be initialized") ||
		strings.Contains(msg, "Prisma") ||
		strings.Contains(msg, "dmmf")
}

func IsExternalDep(path string) bool {
	return !strings.HasPrefix(path, ".") &&
		!strings.HasPrefix(path, "@/") &&
		!strings.HasPrefix(path, "node:")
}

func NormalizePackageName(path string) string {
	// Handle scoped packages (@org/pkg)
	if strings.HasPrefix(path, "@") {
		parts := strings.Split(path, "/")
		if len(parts) > 1 {
			return strings.Join(parts[:2], "/")
		}
	}
	// Return first part of path (lodash/map → lodash)
	return strings.Split(path, "/")[0]
}
