package httpx

import (
	"encoding/json"
	"errors"
	"net/http"
)

func ParseJSON(
	r *http.Request,
	dst any,
) error {

	defer r.Body.Close()

	decoder := json.NewDecoder(r.Body)

	decoder.DisallowUnknownFields()

	if err := decoder.Decode(dst); err != nil {

		return errors.New(
			"invalid request body",
		)
	}

	return nil
}

