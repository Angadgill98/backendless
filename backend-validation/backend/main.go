package main

// import (
// 	"fmt"
// 	"os"

// 	"github.com/gin-gonic/gin"
// 	"github.com/joho/godotenv"
// )

// func main() {
// 	server := gin.Default()
// 	err:=godotenv.Load()
// 	if err!=nil{
// 		fmt.Println("no env detected")
// 	}
// 	port:=os.Getenv("PORT")
// 	if port==""{
// 		port="8080"
// 	}
// 	server.Run(port)
// }