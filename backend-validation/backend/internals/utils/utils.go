package utils

import (
	"fmt"
	"strings"
	"validation/graph/model"
	
)


func CreateUtilService()*Util {
	return &Util{}
}
type Util struct{}



func (u *Util)JsonbPathQueryBuilder(path []*model.Pathidk) string {
	query := "data"

	for _, p := range path {
		pathStr := "'{" + strings.Join(p.Path, ",") + "}'"
		valueStr := fmt.Sprintf("'%v'", *p.Value)

		query = fmt.Sprintf(
			"jsonb_set(%s, %s, %s, true)",
			query,
			pathStr,
			valueStr,
		)
	}

	return query
}