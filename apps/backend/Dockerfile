# 构建阶段
FROM golang:1.24-alpine AS builder

WORKDIR /app

# 安装依赖
RUN apk add --no-cache git

# 复制 go.mod 和 go.sum
COPY go.mod go.sum ./
RUN --mount=type=cache,target=/go/pkg/mod go mod download

# 复制源代码
COPY . .

# 编译 (挂载构建缓存和模块缓存)
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# 运行阶段
FROM alpine:latest

WORKDIR /app

# 安装时区数据
RUN apk --no-cache add ca-certificates tzdata

# 设置时区
ENV TZ=Asia/Shanghai

# 从构建阶段复制二进制文件
COPY --from=builder /app/main .
COPY --from=builder /app/conf ./conf
COPY --from=builder /app/swagger ./swagger

# 暴露端口
EXPOSE 8080

# 运行
CMD ["./main"]
