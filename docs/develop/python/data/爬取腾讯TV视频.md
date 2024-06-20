# 爬取腾讯TV视频

## 概述

### 业务需求

​	　爬取 [腾讯视频](https://v.qq.com/) 首页的任意一个视频到本地，这里选择的是 **玫瑰的故事**。

### 抓包分析

​	　在腾讯视频网页经F12抓包可知，视频数据来源为 xxx ,post 接口

代码实现思路如下：

1、发送请求

![image-20240620233613394](.\images\爬取腾讯TV视频_02.png)



![image-20240620221807539](.\images\爬取腾讯TV视频_01.png)

## 开发

### 准备

（1）开发环境

```
解释器：Python 3.11.4
IDE版本：PyCharm 2023.1.3 (Professional Edition)
```



（2）安装第三方模块



```


requests.exceptions.SSLError: HTTPSConnectionPool(host='vd6.l.qq.com', port=443): Max retries exceeded with url: /proxyhttp (Caused by SSLError(SSLError(1, '[SSL: WRONG_VERSION_NUMBER] wrong version number (_ssl.c:1002)')))

{
    "vl": {
        "vi": [
            {
                "ul": {
                    "m3u8": "这是一个m3u8链接"
                }
            }
        ]
    }
}
{"errCode":-7610, "retMsg":"无效的cgi"}

{"ip":"183.247.4.228","retry":1,"s":"f","em":85,"exem":-3,"msg":"这个视频被外星人劫走，暂时看不了了~","type":-3,"curTime":1718887533,"rand":"o77cp3tMXxx7UJYk1YpfHw==","code":"85.-3"}
```



### 编码

（1）获取数据

（2）解析m3u8链接地址



### 测试

![image-20240620232620775](D:\codehub\shooter\docs\develop\python\data\images\image-20240620232620775.png)

## 常见错误

（1）SSLError

```
requests.exceptions.SSLError: HTTPSConnectionPool(host='vd6.l.qq.com', port=443): Max retries exceeded with url: /proxyhttp (Caused by SSLError(SSLError(1, '[SSL: WRONG_VERSION_NUMBER] wrong version number (_ssl.c:1002)')))
```

