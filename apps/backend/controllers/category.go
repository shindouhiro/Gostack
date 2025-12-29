package controllers

import (
	"encoding/json"
	"myapp/backend/models"
	beego "github.com/beego/beego/v2/server/web"
    "strconv"
)

type CategoryController struct {
	beego.Controller
}

func (c *CategoryController) URLMapping() {
	c.Mapping("Post", c.Post)
	c.Mapping("GetOne", c.GetOne)
	c.Mapping("GetAll", c.GetAll)
	c.Mapping("Put", c.Put)
	c.Mapping("Delete", c.Delete)
}

// @Title Create
// @Description create object
// @Param	body		body 	models.Category	true		"The object content"
// @Success 200 {string} models.Category.Id
// @Failure 403 body is empty
// @router / [post]
func (c *CategoryController) Post() {
	var v models.Category
	if err := json.Unmarshal(c.Ctx.Input.RequestBody, &v); err == nil {
		if id, err := models.AddCategory(&v); err == nil {
			c.Data["json"] = map[string]int64{"id": id}
		} else {
			c.Data["json"] = err.Error()
		}
	} else {
		c.Data["json"] = err.Error()
	}
	c.ServeJSON()
}

// @Title Get One
// @Description get object by id
// @Param	id		path 	string	true		"The key for staticblock"
// @Success 200 {object} models.Category
// @Failure 403 :id is empty
// @router /:id [get]
func (c *CategoryController) GetOne() {
	idStr := c.Ctx.Input.Param(":id")
	id, _ := strconv.Atoi(idStr)
	v, err := models.GetCategory(id)
	if err != nil {
		c.Data["json"] = err.Error()
	} else {
		c.Data["json"] = v
	}
	c.ServeJSON()
}

// @Title Get All
// @Description get all objects
// @Success 200 {object} models.Category
// @Failure 403 
// @router / [get]
func (c *CategoryController) GetAll() {
	l, err := models.GetAllCategories()
	if err != nil {
		c.Data["json"] = err.Error()
	} else {
		c.Data["json"] = l
	}
	c.ServeJSON()
}

// @Title Update
// @Description update the object
// @Param	id		path 	string	true		"The id you want to update"
// @Param	body		body 	models.Category	true		"The body"
// @Success 200 {object} models.Category
// @Failure 403 :id is empty
// @router /:id [put]
func (c *CategoryController) Put() {
	idStr := c.Ctx.Input.Param(":id")
	id, _ := strconv.Atoi(idStr)
	var v models.Category
	if err := json.Unmarshal(c.Ctx.Input.RequestBody, &v); err == nil {
		if _, err := models.UpdateCategory(id, &v); err == nil {
			c.Data["json"] = "OK"
		} else {
			c.Data["json"] = err.Error()
		}
	} else {
		c.Data["json"] = err.Error()
	}
	c.ServeJSON()
}

// @Title Delete
// @Description delete the object
// @Param	id		path 	string	true		"The id you want to delete"
// @Success 200 {string} delete success!
// @Failure 403 id is empty
// @router /:id [delete]
func (c *CategoryController) Delete() {
	idStr := c.Ctx.Input.Param(":id")
	id, _ := strconv.Atoi(idStr)
	if _, err := models.DeleteCategory(id); err == nil {
		c.Data["json"] = "OK"
	} else {
		c.Data["json"] = err.Error()
	}
	c.ServeJSON()
}
