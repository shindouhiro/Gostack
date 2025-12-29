package main

import (
	_ "myapp/backend/routers"
	beego "github.com/beego/beego/v2/server/web"
    "github.com/beego/beego/v2/client/orm"
    _ "github.com/go-sql-driver/mysql"
)

func init() {
    // 注册数据库，这里使用默认配置，实际使用请修改 conf/app.conf 中的 sqlconn
    conn, _ := beego.AppConfig.String("sqlconn")
    orm.RegisterDriver("mysql", orm.DRMySQL)
    orm.RegisterDataBase("default", "mysql", conn)
    
    // 自动建表 (开发模式)
    orm.RunSyncdb("default", false, true)
}

func main() {
	if beego.BConfig.RunMode == "dev" {
		beego.BConfig.WebConfig.DirectoryIndex = true
		beego.BConfig.WebConfig.StaticDir["/swagger"] = "swagger"
	}
	beego.Run()
}
