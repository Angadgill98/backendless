package main

import (
	"log"
	"net/http"
	"os"
	"validation/graph"
	"validation/internals/postgres"
	"validation/internals/redis"
	"validation/internals/repo"
	"validation/internals/services"
	"validation/internals/utils"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/handler/extension"
	"github.com/99designs/gqlgen/graphql/handler/lru"
	"github.com/99designs/gqlgen/graphql/handler/transport"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/joho/godotenv"
	"github.com/vektah/gqlparser/v2/ast"
)

const defaultPort = "8080"

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("No .env file found")
	}
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	util:=utils.CreateUtilService()

	pgDb:=postgres.SetupPostgres()
	rdb:=redis.SetupRedis()
	defer pgDb.Close()
	tabe_row_repo:=repo.CreateTable_RowRepo(pgDb)
	TableRowSerice:=services.CreateTable_RowService(tabe_row_repo,pgDb,rdb,util)
	
	srv := handler.New(graph.NewExecutableSchema(graph.Config{Resolvers: &graph.Resolver{
		//redis db here
		Redis: rdb,
		Db:pgDb,
		TableRow: TableRowSerice,
	}}))

	srv.AddTransport(transport.Options{})
	srv.AddTransport(transport.GET{})
	srv.AddTransport(transport.POST{})

	srv.SetQueryCache(lru.New[*ast.QueryDocument](1000))

	srv.Use(extension.Introspection{})
	srv.Use(extension.AutomaticPersistedQuery{
		Cache: lru.New[string](100),
	})

	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
