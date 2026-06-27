package postgres

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
)

func SetupPostgres() *pgxpool.Pool{
	db:=Dbconfig()
	log.Println("Postgres connected")
	return db
}

func Dbconfig() *pgxpool.Pool{
	dbURL := fmt.Sprintf(
		"postgres://%s:%s@%s:%s/%s",
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_NAME"),
	)
	
	db, err := pgxpool.New(context.Background(), dbURL)
	if err != nil {
		panic(err)
	}

	
	return db
}