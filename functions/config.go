package functions

type Config struct {
	ProjectName     string
	ProjectPath     string
	OutputDir       string
	ClientOutputDir string
	ServerOutputDir string
	WithAuth        bool
	WithPrisma      bool
	WithShadcn      bool
	WithGoApi       bool
	TemplateName    string
	LocalTemplate   bool
	UseYarn         bool
}

var TemplateDirectory string
var BaseDirectory string
