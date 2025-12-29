package models

import (
	"crypto/md5"
	"encoding/hex"
	"time"

	"github.com/beego/beego/v2/client/orm"
)

type User struct {
	Id        int       `orm:"auto" json:"Id"`
	Username  string    `orm:"size(50);unique" json:"Username"`
	Password  string    `orm:"size(100)" json:"-"`
	Nickname  string    `orm:"size(50)" json:"Nickname"`
	Avatar    string    `orm:"size(255);null" json:"Avatar"`
	Role      string    `orm:"size(20);default(user)" json:"Role"`
	CreatedAt time.Time `orm:"auto_now_add;type(datetime)" json:"CreatedAt"`
	UpdatedAt time.Time `orm:"auto_now;type(datetime)" json:"UpdatedAt"`
}

func init() {
	orm.RegisterModel(new(User))
}

// 密码加密
func HashPassword(password string) string {
	hash := md5.Sum([]byte(password + "salt_secret_key"))
	return hex.EncodeToString(hash[:])
}

// 验证密码
func CheckPassword(password, hashedPassword string) bool {
	return HashPassword(password) == hashedPassword
}

// 创建用户
func CreateUser(u *User) (int64, error) {
	o := orm.NewOrm()
	u.Password = HashPassword(u.Password)
	return o.Insert(u)
}

// 根据用户名获取用户
func GetUserByUsername(username string) (*User, error) {
	o := orm.NewOrm()
	user := &User{Username: username}
	err := o.Read(user, "Username")
	if err != nil {
		return nil, err
	}
	return user, nil
}

// 根据ID获取用户
func GetUserById(id int) (*User, error) {
	o := orm.NewOrm()
	user := &User{Id: id}
	err := o.Read(user)
	if err != nil {
		return nil, err
	}
	return user, nil
}

// 更新用户
func UpdateUser(u *User) error {
	o := orm.NewOrm()
	_, err := o.Update(u)
	return err
}

// 初始化管理员账号
func InitAdminUser() {
	o := orm.NewOrm()
	user := &User{Username: "admin"}
	err := o.Read(user, "Username")
	if err == orm.ErrNoRows {
		admin := &User{
			Username: "admin",
			Password: "admin123",
			Nickname: "管理员",
			Role:     "admin",
		}
		CreateUser(admin)
	}
}
