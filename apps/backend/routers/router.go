package routers

import (
	"myapp/backend/controllers"
	beego "github.com/beego/beego/v2/server/web"
)

func init() {
	beego.Router("/", &controllers.MainController{})
	ns := beego.NewNamespace("/v1",
		// 认证相关路由
		beego.NSNamespace("/auth",
			beego.NSRouter("/login", &controllers.AuthController{}, "post:Login"),
			beego.NSRouter("/logout", &controllers.AuthController{}, "post:Logout"),
			beego.NSRouter("/userinfo", &controllers.AuthController{}, "get:GetUserInfo"),
		),
		// 分类管理路由
		beego.NSNamespace("/categories",
			beego.NSInclude(
				&controllers.CategoryController{},
			),
		),
	)
	beego.AddNamespace(ns)
}

