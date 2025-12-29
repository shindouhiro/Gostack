package main

import (
	"fmt"
	"myapp/backend/models"

	"github.com/beego/beego/v2/client/orm"
	beego "github.com/beego/beego/v2/server/web"
	_ "github.com/go-sql-driver/mysql"
)

func init() {
	// 注册数据库
	conn, _ := beego.AppConfig.String("sqlconn")
	orm.RegisterDriver("mysql", orm.DRMySQL)
	orm.RegisterDataBase("default", "mysql", conn)

	// 自动建表
	orm.RunSyncdb("default", false, true)
}

func main() {
	fmt.Println("🌱 开始填充种子数据...")

	// 创建用户
	seedUsers()

	// 创建分类
	seedCategories()

	fmt.Println("✅ 种子数据填充完成!")
}

func seedUsers() {
	fmt.Println("\n📝 创建用户...")

	users := []models.User{
		{Username: "admin", Password: "admin123", Nickname: "超级管理员", Role: "admin"},
		{Username: "editor", Password: "editor123", Nickname: "编辑", Role: "editor"},
		{Username: "user", Password: "user123", Nickname: "普通用户", Role: "user"},
	}

	for _, u := range users {
		existing, err := models.GetUserByUsername(u.Username)
		if err != nil {
			// 用户不存在，创建
			id, err := models.CreateUser(&u)
			if err != nil {
				fmt.Printf("   ❌ 创建用户 %s 失败: %v\n", u.Username, err)
			} else {
				fmt.Printf("   ✅ 创建用户 %s (ID: %d)\n", u.Username, id)
			}
		} else {
			fmt.Printf("   ⏭️  用户 %s 已存在 (ID: %d)\n", existing.Username, existing.Id)
		}
	}
}

func seedCategories() {
	fmt.Println("\n📁 创建分类...")

	categories := []models.Category{
		{Name: "技术文章", ParentId: 0, Order: 1},
		{Name: "生活随笔", ParentId: 0, Order: 2},
		{Name: "学习笔记", ParentId: 0, Order: 3},
		{Name: "项目分享", ParentId: 0, Order: 4},
	}

	// 先创建顶级分类
	for i, c := range categories {
		existing, _ := models.GetAllCategories()
		found := false
		for _, e := range existing {
			if e.Name == c.Name {
				found = true
				fmt.Printf("   ⏭️  分类 %s 已存在 (ID: %d)\n", e.Name, e.Id)
				categories[i].Id = e.Id
				break
			}
		}
		if !found {
			id, err := models.AddCategory(&c)
			if err != nil {
				fmt.Printf("   ❌ 创建分类 %s 失败: %v\n", c.Name, err)
			} else {
				fmt.Printf("   ✅ 创建分类 %s (ID: %d)\n", c.Name, id)
				categories[i].Id = int(id)
			}
		}
	}

	// 创建子分类
	subCategories := []models.Category{
		{Name: "Go 语言", ParentId: 1, Order: 1},
		{Name: "React/Next.js", ParentId: 1, Order: 2},
		{Name: "Docker/K8s", ParentId: 1, Order: 3},
		{Name: "数据库", ParentId: 1, Order: 4},
		{Name: "旅行", ParentId: 2, Order: 1},
		{Name: "美食", ParentId: 2, Order: 2},
		{Name: "读书", ParentId: 3, Order: 1},
		{Name: "课程", ParentId: 3, Order: 2},
	}

	for _, c := range subCategories {
		existing, _ := models.GetAllCategories()
		found := false
		for _, e := range existing {
			if e.Name == c.Name {
				found = true
				fmt.Printf("   ⏭️  分类 %s 已存在 (ID: %d)\n", e.Name, e.Id)
				break
			}
		}
		if !found {
			id, err := models.AddCategory(&c)
			if err != nil {
				fmt.Printf("   ❌ 创建分类 %s 失败: %v\n", c.Name, err)
			} else {
				fmt.Printf("   ✅ 创建分类 %s (ID: %d)\n", c.Name, id)
			}
		}
	}
}
