package models

import (
	"github.com/beego/beego/v2/client/orm"
)

type Category struct {
	Id       int    `orm:"auto"`
	Name     string `orm:"size(100)"`
	ParentId int    `orm:"default(0)"`
	Order    int    `orm:"default(0)"`
}

func init() {
	orm.RegisterModel(new(Category))
}

func AddCategory(c *Category) (int64, error) {
	o := orm.NewOrm()
	return o.Insert(c)
}

func GetCategory(id int) (c *Category, err error) {
	o := orm.NewOrm()
	v := &Category{Id: id}
	if err = o.Read(v); err == nil {
		return v, nil
	}
	return nil, err
}

func GetAllCategories() ([]*Category, error) {
	o := orm.NewOrm()
	var categories []*Category
	_, err := o.QueryTable("category").All(&categories)
	return categories, err
}

func UpdateCategory(id int, c *Category) (int64, error) {
	o := orm.NewOrm()
	v := Category{Id: id}
	if err := o.Read(&v); err == nil {
		v.Name = c.Name
		v.ParentId = c.ParentId
		v.Order = c.Order
		return o.Update(&v)
	}
	return 0, nil
}

func DeleteCategory(id int) (int64, error) {
	o := orm.NewOrm()
	v := Category{Id: id}
	if err := o.Read(&v); err == nil {
		return o.Delete(&v)
	}
	return 0, nil
}
