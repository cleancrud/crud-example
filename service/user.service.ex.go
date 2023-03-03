package service

import (
	"context"

	"github.com/golang-jwt/jwt/v4"
	grpc_auth "github.com/grpc-ecosystem/go-grpc-middleware/auth"
	grpc_ctxtags "github.com/grpc-ecosystem/go-grpc-middleware/tags"
	"github.com/hongshengjie/crud-example/api"
	"google.golang.org/grpc/codes"

	"google.golang.org/grpc/status"
)

func (s *UserServiceImpl) ValidateUser(u *api.User) error {
	if u.Age > 100 {
		return status.Error(codes.InvalidArgument, "age >100")
	}
	return nil
}

func (s *UserServiceImpl) AuthFuncOverride(ctx context.Context, fullMethodName string) (context.Context, error) {

	switch fullMethodName {
	case "":
		token, err := grpc_auth.AuthFromMD(ctx, "bearer")
		if err != nil {
			return ctx, err
		}
		t, err := ParseToken(token)
		if err != nil {
			return nil, err
		}
		grpc_ctxtags.Extract(ctx).Set("registeredclaims", t)
		return ctx, nil
	default:
		return ctx, nil
	}

}

func GuestAuthFunc(ctx context.Context) (context.Context, error) {
	token, _ := grpc_auth.AuthFromMD(ctx, "bearer")
	if token != "" {
		t, _ := ParseToken(token)
		if t != nil {
			grpc_ctxtags.Extract(ctx).Set("registeredclaims", t)
		}
	}
	return ctx, nil
}

func NoAuthFunc(ctx context.Context) (context.Context, error) {
	return ctx, nil
}

var key = "xxxx"

func ParseToken(token string) (*jwt.RegisteredClaims, error) {
	c := &jwt.RegisteredClaims{}
	token1, err := jwt.ParseWithClaims(token, c, func(t *jwt.Token) (interface{}, error) {
		return []byte(key), nil
	})
	if err != nil {
		return nil, err
	}
	ret := token1.Claims.(*jwt.RegisteredClaims)
	if ret.Valid() != nil {
		return nil, status.Error(codes.Unauthenticated, "token is not valid")

	}
	return ret, nil
}
