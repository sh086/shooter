# XXL-Job分布式定时任务调度平台

```
环境说明：
- JDK版本：jdk8.0
- Docker版本：20.10.17
- Docker-Compose版本: 3.1
```

**参考文档：**

- [XXL-Job官方文档](https://www.xuxueli.com/xxl-job/)
- [测试环境XXL-JOB地址]( http://10.12.0.77:9898/xxl-job-admin/)
- [SpringBoot对接案例](https://github.com/xuxueli/xxl-job/tree/master/xxl-job-executor-samples/xxl-job-executor-sample-springboot)

## 服务器搭建

​	首先，需要根据[这个SQL](https://github.com/xuxueli/xxl-job/blob/master/doc/db/tables_xxl_job.sql)初始化`XXL-Job数据库`，然后在如下命令中修改**数据库IP**、**数据库密码**、**数据库名称**，配置完成后，直接运行即可启动`XXL-Job`。

```shell
docker run -e PARAMS="--spring.datasource.url=jdbc:mysql://数据库IP:3306/数据库名称?characterEncoding=utf8&useSSL=true --spring.datasource.username=crm --spring.datasource.password=数据库密码" -p 9898:8080 -v /tmp:/data/applogs --name xxl-job-admin  -d xuxueli/xxl-job-admin:2.3.0
```

说明：如果启动不了，可能是数据库没加白名单的原因。

​	启动成功后，访问  ` http://10.12.0.77:9898/xxl-job-admin/` ，管理员账户是：`admin`，默认密码是：`123456`，登录后可以修改管理员密码。

![image-20221024163514324](D:\desktop\table\image-20221024163514324.png)

​	至此，XXL-Job服务端已经部署完成。



## 客户端对接

​	首先，需要在应用中引入如下依赖。

```xml
 <!-- xxl-job Start -->
<dependency>
    <groupId>com.xuxueli</groupId>
    <artifactId>xxl-job-core</artifactId>
</dependency>
<!-- xxl-job End -->
```

​	然后，将这个`XxlJobConfig`配置复制到项目中。

```java
package com.ywwl.customer.config;

import com.xxl.job.core.executor.impl.XxlJobSpringExecutor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
/**
 * xxl-job config
 *
 * @author xuxueli 2017-04-28
 */
@Configuration
public class XxlJobConfig {
    private Logger logger = LoggerFactory.getLogger(XxlJobConfig.class);

    @Value("${xxl.job.admin.addresses}")
    private String adminAddresses;

    @Value("${xxl.job.executor.appname}")
    private String appname;

    @Value("${xxl.job.executor.address}")
    private String address;

    @Value("${xxl.job.executor.ip}")
    private String ip;

    @Value("${xxl.job.executor.port}")
    private int port;

    @Value("${xxl.job.executor.logpath}")
    private String logPath;

    @Value("${xxl.job.executor.logretentiondays}")
    private int logRetentionDays;

    @Bean
    public XxlJobSpringExecutor xxlJobExecutor() {
        logger.info(">>>>>>>>>>> xxl-job config init.");
        XxlJobSpringExecutor xxlJobSpringExecutor = new XxlJobSpringExecutor();
        xxlJobSpringExecutor.setAdminAddresses(adminAddresses);
        xxlJobSpringExecutor.setAppname(appname);
        xxlJobSpringExecutor.setAddress(address);
        xxlJobSpringExecutor.setIp(ip);
        xxlJobSpringExecutor.setPort(port);
        xxlJobSpringExecutor.setAccessToken("");
        xxlJobSpringExecutor.setLogPath(logPath);
        xxlJobSpringExecutor.setLogRetentionDays(logRetentionDays);

        return xxlJobSpringExecutor;
    }

}
```

​	最后，将[logback.xml](https://github.com/xuxueli/xxl-job/blob/master/xxl-job-executor-samples/xxl-job-executor-sample-springboot/src/main/resources/logback.xml)这个文件也复制到项目的`resources`目录下。



说明：项目配置完后，文件结构如下：

```
-- main
------config
---------XxlJobConfig.java
------task
----------XxlJobTask.java
------Application.java
-- resources
------application.xml
------logback.xml
```



### 容器化应用对接

​	如果项目是部署在`Docker`中，可以采用如下方案对接。

​	首先，在`application.yml`中新增如下配置，注意如下三点配置。

```yaml
# XXL-JOB配置
logging:
  config: classpath:logback.xml
xxl:
  job:
    admin:
      # ① 配置的是xxl-job服务端地址
      addresses: http://10.12.0.77:9898/xxl-job-admin
    executor:
      # ② 配置的是xxl-job执行器下的AppName
      appname: crm-search-test
      address: ''
      # ③ XXL_JOB_IP 和 XXL_JOB_PORT 是在容器启动时注入的
      ip: ${XXL_JOB_IP}
      port: ${XXL_JOB_PORT}
      logpath: /data/applogs/xxl-job/jobhandler
      logretentiondays: 30
```

​	配置完成后，还需要在`docker-compose.yml`文件中动态配置`XXL_JOB_PORT`和`XXL_JOB_IP`，以及在`ports`开放`XXL_JOB_PORT`端口的映射。示例如下：

```yaml
version: '3.1'
services:
  customerinfo_01:
    restart: always
    image: customer-search
    container_name: customer-search_01
    ports:
      - 8091:8091
      - 9091:9091
    environment:
      TZ: Asia/Shanghai
      SPRING_PROFILES_ACTIVE: test
      SERVER_PORT: 8091
      XXL_JOB_PORT: 9091
      XXL_JOB_IP: 10.12.0.14

  customerinfo_02:
    restart: always
    image: customer-search
    container_name: customer-search_02
    ports:
      - 8092:8092
      - 9092:9092
    environment:
      TZ: Asia/Shanghai
      SPRING_PROFILES_ACTIVE: test
      SERVER_PORT: 8092
      XXL_JOB_PORT: 9092
      XXL_JOB_IP: 10.12.0.14
```

​	至此，客户端已经对接完毕。然后，在**服务器上**启动应用后，在执行器管理页面即可看到注册成功的执行器了。

![image-20221024165900880](D:\desktop\table\image-20221024165900880.png)

​	注意，**本地启动xxl-job客户端的话，因为远程服务器访问不了本地，故执行器可以注册成功，但是任务是执行不了的**。



### Tomcat应用对接

​	与容器化部署类似，不使用Docker部署的话，**只需要在应用启动的时候，动态设置`ip`和`port`即可**。如配置可以新增如下：

```yaml
# XXL-JOB配置
logging:
  config: classpath:logback.xml
xxl:
  job:
    admin:
      # ① 配置的是xxl-job服务端地址
      addresses: http://10.12.0.77:9898/xxl-job-admin
    executor:
      # ② 配置的是xxl-job执行器下的AppName
      appname: crm-search-test
      address: ''
      # ③ XXL_JOB_IP 和 XXL_JOB_PORT 是在启动时注入的
      ip: ''
      port: ''
      logpath: /data/applogs/xxl-job/jobhandler
      logretentiondays: 30
```

​	启动时参考使用如下命令启动：

```shell
// 运行服务1
java -jar app.jar --server.port=8091 --spring.profiles.active=test --xxl.job.executor.ip=10.12.0.14 --xxl.job.executor.port=9091

// 运行服务2
java -jar app.jar --server.port=8092 --spring.profiles.active=test --xxl.job.executor.ip=10.12.0.14 --xxl.job.executor.port=9092
```



## 分片广播策略

​	我们最常使用的就应该是分片广播策略了，如果中途某一服务器掉线或者有新增负载上线，分片总数值和分片序号值都会进行动态更新的，这样可以保证我们服务的正常运行。这里我们重点说一下。

​	首先，在代码中通过 `@XxlJob` 注解表示该服务通过`xxl-job`服务端进行调度。

```java
@Component
@Slf4j
public class CustomerMqPushTask {

    @Resource
    private CustomerChangeLogService customerChangeLogService;

    /**
     * 推送到MQ
     * */
    @XxlJob("pushToMq")
    public void pushToMq() {
        // 分片序号,从0开始计算
        int shardIndex = XxlJobHelper.getShardIndex();
        // 分片总数,从0开始计算,如当前共3服务器，则此处值为2
        int shardTotal = XxlJobHelper.getShardTotal();
        // 查询SQL最后加入 and mod(id, shardTotal) = shardIndex 即可
        val list= customerChangeLogService.selectUnPush(0,shardIndex,shardTotal);
        list.forEach(x-> {
            // XxlJobHelper.log是用于将日志打印到xxl-job服务端 调度日志 页面上的, 不是打印在控制台上的
            XxlJobHelper.log("id {} 当前分片序号 = {}, 总分片数 = {}",x.getId(),shardIndex, shardTotal);
        });
    }
}
```

​	通过 `XxlJobHelper.getShardIndex()`和 `XxlJobHelper.getShardTotal()`可以获取当前分片序号和分片总数，然后在查询SQL中最后加入 `and mod(id, shardTotal) = shardIndex` 即可。

​	接着，在 **任务调度页面** 面进行如下配置，注意红色箭头即可。

![image-20221024173457140](D:\desktop\table\image-20221024173457140.png)

​	配置完成后，点击 `启动` ，即可运行定时任务。然后，点击`查询日志`，即可查询运行日志。

![image-20221024173830258](D:\desktop\table\image-20221024173830258.png)



