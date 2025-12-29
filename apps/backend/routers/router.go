package routers

import (
	"myapp/backend/controllers"
	beego "github.com/beego/beego/v2/server/web"
)

func init() {
	beego.Router("/", &controllers.MainController{})
    ns := beego.NewNamespace("/v1",
        beego.NSNamespace("/categories",
            beego.NSInclude(
                &controllers.CategoryController{},
            ),
        ),
    )
    beego.AddNamespace(ns)
}
