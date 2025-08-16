package functions

type Config struct {
	ProjectName   string
	OutputDir     string
	WithAuth      bool
	WithPrisma    bool
	WithShadcn    bool
	TemplateName  string
	LocalTemplate bool
	UseYarn       bool
}

var TemplateDirectory string
var BaseDirectory string
