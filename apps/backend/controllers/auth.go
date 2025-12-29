package controllers

import (
	"encoding/json"
	"myapp/backend/models"
	"time"

	beego "github.com/beego/beego/v2/server/web"
	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret = []byte("your-secret-key-change-in-production")

type AuthController struct {
	beego.Controller
}

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Token string       `json:"token"`
	User  *models.User `json:"user"`
}

type Claims struct {
	UserId   int    `json:"userId"`
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

// 生成 JWT Token
func GenerateToken(user *models.User) (string, error) {
	claims := Claims{
		UserId:   user.Id,
		Username: user.Username,
		Role:     user.Role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			Issuer:    "myapp",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

// 解析 JWT Token
func ParseToken(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}

	return nil, jwt.ErrSignatureInvalid
}

// @Title Login
// @Description 用户登录
// @Param body body LoginRequest true "登录信息"
// @Success 200 {object} LoginResponse
// @Failure 400 用户名或密码错误
// @router /login [post]
func (c *AuthController) Login() {
	var req LoginRequest
	if err := json.Unmarshal(c.Ctx.Input.RequestBody, &req); err != nil {
		c.Data["json"] = map[string]interface{}{
			"success": false,
			"message": "请求参数错误",
		}
		c.ServeJSON()
		return
	}

	// 验证用户
	user, err := models.GetUserByUsername(req.Username)
	if err != nil {
		c.Data["json"] = map[string]interface{}{
			"success": false,
			"message": "用户名或密码错误",
		}
		c.ServeJSON()
		return
	}

	// 验证密码
	if !models.CheckPassword(req.Password, user.Password) {
		c.Data["json"] = map[string]interface{}{
			"success": false,
			"message": "用户名或密码错误",
		}
		c.ServeJSON()
		return
	}

	// 生成 token
	token, err := GenerateToken(user)
	if err != nil {
		c.Data["json"] = map[string]interface{}{
			"success": false,
			"message": "生成 token 失败",
		}
		c.ServeJSON()
		return
	}

	c.Data["json"] = map[string]interface{}{
		"success": true,
		"data": LoginResponse{
			Token: token,
			User:  user,
		},
	}
	c.ServeJSON()
}

// @Title GetUserInfo
// @Description 获取当前用户信息
// @Success 200 {object} models.User
// @Failure 401 未授权
// @router /userinfo [get]
func (c *AuthController) GetUserInfo() {
	// 从 header 获取 token
	tokenString := c.Ctx.Input.Header("Authorization")
	if len(tokenString) > 7 && tokenString[:7] == "Bearer " {
		tokenString = tokenString[7:]
	}

	if tokenString == "" {
		c.Ctx.Output.SetStatus(401)
		c.Data["json"] = map[string]interface{}{
			"success": false,
			"message": "未授权",
		}
		c.ServeJSON()
		return
	}

	// 解析 token
	claims, err := ParseToken(tokenString)
	if err != nil {
		c.Ctx.Output.SetStatus(401)
		c.Data["json"] = map[string]interface{}{
			"success": false,
			"message": "token 无效或已过期",
		}
		c.ServeJSON()
		return
	}

	// 获取用户信息
	user, err := models.GetUserById(claims.UserId)
	if err != nil {
		c.Ctx.Output.SetStatus(401)
		c.Data["json"] = map[string]interface{}{
			"success": false,
			"message": "用户不存在",
		}
		c.ServeJSON()
		return
	}

	c.Data["json"] = map[string]interface{}{
		"success": true,
		"data":    user,
	}
	c.ServeJSON()
}

// @Title Logout
// @Description 用户登出
// @Success 200 {string} success
// @router /logout [post]
func (c *AuthController) Logout() {
	c.Data["json"] = map[string]interface{}{
		"success": true,
		"message": "登出成功",
	}
	c.ServeJSON()
}
