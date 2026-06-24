package middleware

import (
	"net"
	"net/http"
	"sync"
	"time"

	"github.com/mohammedbilalns/shrinklink/internal/httpx"
)

type rateBucket struct {
	windowStart time.Time
	count       int
}

type rateLimiter struct {
	mu      sync.Mutex
	limit   int
	window  time.Duration
	buckets map[string]*rateBucket
}

func RateLimit(limit int, window time.Duration) func(http.Handler) http.Handler {
	limiter := &rateLimiter{
		limit:   limit,
		window:  window,
		buckets: make(map[string]*rateBucket),
	}

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			if !limiter.allow(r) {
				httpx.WriteJSON(w, http.StatusTooManyRequests, map[string]string{
					"message": "too many requests",
				})
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

func (l *rateLimiter) allow(r *http.Request) bool {
	key := clientKey(r)
	now := time.Now()

	l.mu.Lock()
	defer l.mu.Unlock()

	bucket, ok := l.buckets[key]
	if !ok || now.Sub(bucket.windowStart) >= l.window {
		l.buckets[key] = &rateBucket{windowStart: now, count: 1}
		return true
	}

	if bucket.count >= l.limit {
		return false
	}

	bucket.count++
	return true
}

func clientKey(r *http.Request) string {
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return host
}
