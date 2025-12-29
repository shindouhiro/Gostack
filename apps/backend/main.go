package main

import (
	"myapp/backend/models"
	_ "myapp/backend/routers"

	"github.com/beego/beego/v2/client/orm"
	beego "github.com/beego/beego/v2/server/web"
	"github.com/beego/beego/v2/server/web/filter/cors"
	_ "github.com/go-sql-driver/mysql"
)

func init() {
	// 注册数据库，这里使用默认配置，实际使用请修改 conf/app.conf 中的 sqlconn
	conn, _ := beego.AppConfig.String("sqlconn")
	orm.RegisterDriver("mysql", orm.DRMySQL)
	orm.RegisterDataBase("default", "mysql", conn)

	// 自动建表 (开发模式)
	orm.RunSyncdb("default", false, true)

	// 初始化管理员账号
	models.InitAdminUser()
}

func main() {
	if beego.BConfig.RunMode == "dev" {
		beego.BConfig.WebConfig.DirectoryIndex = true
		beego.BConfig.WebConfig.StaticDir["/docs"] = "swagger"
		
		// 启用 CORS
		beego.InsertFilter("*", beego.BeforeRouter, cors.Allow(&cors.Options{
			AllowOrigins:     []string{"*"},
			AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
			AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
			ExposeHeaders:    []string{"Content-Length"},
			AllowCredentials: true,
		}))
	}
	beego.Run()
}

