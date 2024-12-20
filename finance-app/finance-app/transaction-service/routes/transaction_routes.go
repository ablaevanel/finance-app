package routes

import (
	"github.com/gin-gonic/gin"
	"net/http"
	"transaction-service/controllers"
)

func SetupRoutes(router *gin.Engine) {
	router.GET("/api/transactions", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})
	router.GET("/api/transactions/:id", func(c *gin.Context) {
		c.HTML(http.StatusOK, "edit_transaction.html", nil)
	})
	router.GET("/api/transactions/add", func(c *gin.Context) {
		c.HTML(http.StatusOK, "add_transaction.html", nil)
	})
	router.POST("/api/transactions/add", controllers.AddTransaction)
	router.PUT("/api/transactions/:id", controllers.EditTransaction)
	router.DELETE("/api/transactions/:id", controllers.DeleteTransaction)
	router.GET("/api/transactions/list/statistics", controllers.GetStatistics)
	router.GET("/api/transactions/list", controllers.GetTransactions)
	router.GET("/api/transactions/:id/data", controllers.GetTransactionByID)
}
