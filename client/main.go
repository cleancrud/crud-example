package main

import (
	"context"
	"fmt"

	"github.com/happycrud/crud-example/api"
	"github.com/happycrud/crud-example/discovery"
	"google.golang.org/grpc"
)

func main() {
	envoy()
}

func envoy() {
	conn, err := grpc.Dial("127.0.0.1:8081", grpc.WithInsecure())
	if err != nil {
		panic(err)
	}
	client := api.NewUserServiceClient(conn)
	for range []int{1, 2, 3, 4, 5} {
		resp, err := client.GetUser(context.Background(), &api.UserId{Id: 1})
		fmt.Println(resp, err)
	}

}

func etcd() {
	conn, err := discovery.NewConn("crud-example.user")
	if err != nil {
		panic(err)
	}
	client := api.NewUserServiceClient(conn)
	for range []int{1, 2, 3, 4, 5} {
		resp, err := client.GetUser(context.Background(), &api.UserId{Id: 1})
		fmt.Println(resp, err)
	}

}
