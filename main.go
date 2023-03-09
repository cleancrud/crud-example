package main

import (
	"context"
	"embed"
	"flag"
	"fmt"
	"io/fs"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	grpc_auth "github.com/grpc-ecosystem/go-grpc-middleware/auth"
	"github.com/happycrud/crud-example/api"
	"github.com/happycrud/crud-example/crud"
	"github.com/happycrud/crud-example/service"
	"github.com/improbable-eng/grpc-web/go/grpcweb"
	"github.com/rs/cors"

	"github.com/gin-gonic/gin"
	"github.com/happycrud/crud/xsql"
	"github.com/soheilhy/cmux"
	"google.golang.org/grpc"
	"google.golang.org/grpc/health"
	"google.golang.org/grpc/health/grpc_health_v1"
	"google.golang.org/grpc/reflection"
)

var port int
var dsn string

const (
	appID = "crud-example.user"
)

//go:embed web/dist
var content embed.FS

func init() {
	flag.IntVar(&port, "port", 9000, "server listen on port")
	flag.StringVar(&dsn, "dsn", "root:123456@tcp(127.0.0.1:3306)/test?parseTime=true&loc=Local", "mysql dsn github.com/happycrud/crud-example(root:123456@tcp(127.0.0.1:3306)/github.com/happycrud/crud-example?parseTime=true)")
}
func main() {
	flag.Parse()
	l, err := net.Listen("tcp", fmt.Sprintf(":%d", port))
	if err != nil {
		panic(err)
	}
	svr := grpc.NewServer(grpc.UnaryInterceptor(grpc_auth.UnaryServerInterceptor(service.NoAuthFunc)))
	client, err := crud.NewClient(&xsql.Config{
		DSN:          dsn,
		ReadDSN:      []string{dsn},
		Active:       20,
		Idle:         10,
		IdleTimeout:  time.Hour * 4,
		QueryTimeout: time.Second,
		ExecTimeout:  time.Second,
	})
	if err != nil {
		panic(err)
	}
	u := &service.UserServiceImpl{Client: client}
	al := &service.AllTypeTableServiceImpl{Client: client}

	api.RegisterAllTypeTableServiceServer(svr, al)
	api.RegisterUserServiceServer(svr, u)
	grpc_health_v1.RegisterHealthServer(svr, health.NewServer())
	reflection.Register(svr)

	m := cmux.New(l)

	e := gin.Default()
	var staticFS = fs.FS(content)
	htmlContent, err := fs.Sub(staticFS, "web/dist")
	if err != nil {
		log.Fatal(err)
	}
	e.StaticFS("/", http.FS(htmlContent))

	grpcL := m.MatchWithWriters(cmux.HTTP2MatchHeaderFieldPrefixSendSettings("content-type", "application/grpc"))
	httpL := m.Match(cmux.HTTP1Fast())

	hsvr := &http.Server{}
	wrappedGrpc := grpcweb.WrapServer(svr)

	h := http.HandlerFunc(func(resp http.ResponseWriter, req *http.Request) {
		if wrappedGrpc.IsGrpcWebRequest(req) {
			wrappedGrpc.ServeHTTP(resp, req)
			return
		}
		// Fall back to other servers.
		e.ServeHTTP(resp, req)
	})
	corsh := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowCredentials: true,
		AllowedHeaders:   []string{"*"},
		Debug:            false,
	}).Handler(h)
	hsvr.Handler = corsh

	go func() {
		go svr.Serve(grpcL)
		go hsvr.Serve(httpL)
		m.Serve()
	}()

	c := make(chan os.Signal, 1)
	signal.Notify(c, syscall.SIGHUP, syscall.SIGQUIT, syscall.SIGTERM, syscall.SIGINT)
	for {
		s := <-c
		switch s {
		case syscall.SIGQUIT, syscall.SIGTERM, syscall.SIGINT:
			//discovery.DeleteRegister(context.Background(), instanceID)
			hsvr.Shutdown(context.Background())
			svr.GracefulStop()
			m.Close()
			return
		case syscall.SIGHUP:
		default:
			return
		}
	}
}
