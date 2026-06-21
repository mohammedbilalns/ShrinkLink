package httpx

import (
	"net/http"
	"strconv"
)

const (
	DefaultPage  int64 = 1
	DefaultLimit int64 = 10
	MaxLimit     int64 = 100
)

type Pagination struct {
	Page  int64
	Limit int64
}

func ParsePagination(r *http.Request) Pagination {
	page, _ := strconv.ParseInt(
		r.URL.Query().Get("page"),
		10,
		64,
	)

	limit, _ := strconv.ParseInt(
		r.URL.Query().Get("limit"),
		10,
		64,
	)

	if page < 1 {
		page = DefaultPage
	}

	if limit < 1 {
		limit = DefaultLimit
	}

	if limit > MaxLimit {
		limit = MaxLimit
	}

	return Pagination{
		Page:  page,
		Limit: limit,
	}
}
