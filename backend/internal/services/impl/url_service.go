package impl

import (
	"context"
	"errors"
	"net/url"
	"regexp"
	"strings"
	"net/http"
	"strconv"

	"github.com/mohammedbilalns/shrinklink/internal/model"
	"github.com/mohammedbilalns/shrinklink/internal/repository"
	services "github.com/mohammedbilalns/shrinklink/internal/services"
	"github.com/mohammedbilalns/shrinklink/internal/utils"
	"go.mongodb.org/mongo-driver/v2/bson"
)

var slugPattern = regexp.MustCompile(`^[a-zA-Z0-9_-]+$`)
var errShortURlExists = errors.New("short url already exists")

type urlService struct {
	shortURLRepo repository.ShortURLRepository
	appURL       string
}

func NewURLService(
	shortURLRepo repository.ShortURLRepository,
	appURL string,
) services.URLService {
	return &urlService{
		shortURLRepo: shortURLRepo,
		appURL:       strings.TrimRight(appURL, "/"),
	}
}

func (s *urlService) normalizeURL(raw string) (string, error) {
	parsed, err := url.ParseRequestURI(strings.TrimSpace(raw))
	if err != nil {
		return "", errors.New("invalid url")
	}
	if parsed.Scheme != "http" && parsed.Scheme != "https" {
		return "", errors.New("invalid url")
	}
	return parsed.String(), nil
}

func (s *urlService) validateSlug(slug string) error {
	if slug == "" {
		return errors.New("slug is required")
	}
	if !slugPattern.MatchString(slug) {
		return errors.New("slug may only contain letters, numbers, hyphens, and underscores")
	}
	return nil
}

func (s *urlService) buildShortURL(slug string) string {
	return s.appURL + "/" + slug
}

func (s *urlService) createShortURLRecord(
	ctx context.Context,
	fullURL string,
	slug string,
	userID bson.ObjectID,
) (string, error) {
	existing, err := s.shortURLRepo.FindByShortURL(ctx, slug)
	if err != nil {
		return "", err
	}
	if existing != nil {
		return "", errShortURlExists
	}

	shortURL := &model.ShortURL{
		FullURL:  fullURL,
		ShortURL: slug,
		Clicks:   0,
		UserID:   userID,
	}

	if err := s.shortURLRepo.Create(ctx, shortURL); err != nil {
		return "", err
	}

	return s.buildShortURL(slug), nil
}

func (s *urlService) CreateShortURL(
	ctx context.Context,
	fullURL string,
	userID *bson.ObjectID,
) (string, error) {
	normalizedURL, err := s.normalizeURL(fullURL)
	if err != nil {
		return "", err
	}

	var owner bson.ObjectID
	if userID != nil {
		owner = *userID
		existing, err := s.shortURLRepo.FindExistingURL(ctx, owner, normalizedURL)
		if err != nil {
			return "", err
		}
		if existing != nil {
			return s.buildShortURL(existing.ShortURL), nil
		}
	}

	for range 10 {
		slug := utils.GenerateSlug(8)
		shortURL, err := s.createShortURLRecord(ctx, normalizedURL, slug, owner)
		if err == nil {
			return shortURL, nil
		}
		if errors.Is(err, errShortURlExists) {
			continue
		}
		return "", err
	}

	return "", errors.New("unable to generate short url")
}

func (s *urlService) CreateCustomURL(
	ctx context.Context,
	fullURL string,
	slug string,
	userID bson.ObjectID,
) (string, error) {
	normalizedURL, err := s.normalizeURL(fullURL)
	if err != nil {
		return "", err
	}

	if err := s.validateSlug(slug); err != nil {
		return "", err
	}

	return s.createShortURLRecord(ctx, normalizedURL, slug, userID)
}

func (s *urlService) GetUserURLs(
	ctx context.Context,
	userID bson.ObjectID,
	page int64,
	limit int64,
) ([]model.ShortURL, int64, error) {

	skip := (page - 1) * limit
	urls, totalCount, err := s.shortURLRepo.FindByUser(ctx, userID, skip, limit)
	if err != nil {
		return nil, 0, err
	}

	return urls, totalCount, nil
}

func (s *urlService) ResolveShortURL(
	ctx context.Context,
	slug string,
) (*model.ShortURL, error) {
	shortURL, err := s.shortURLRepo.FindByShortURLAndIncrementClicks(ctx, slug)
	if err != nil {
		return nil, err
	}
	if shortURL == nil {
		return nil, errors.New("url not found")
	}

	return shortURL, nil
}



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
