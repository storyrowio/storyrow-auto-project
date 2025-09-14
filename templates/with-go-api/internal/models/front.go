package models

type FrontSidebarMenu struct {
	Id           string             `json:"id"`
	ParentId     string             `json:"parentId" bson:"parentId"`
	Title        string             `json:"title"`
	Icon         string             `json:"icon,omitempty"`
	Path         string             `json:"path"`
	Permissions  []string           `json:"permissions"`
	Children     []FrontSidebarMenu `json:"children" bson:"-"`
	SectionTitle bool               `json:"sectionTitle" bson:"sectionTitle"`
	SectionId    string             `json:"sectionId,omitempty" bson:"sectionId,omitempty"`
	BasicDate    `bson:",inline"`
}
