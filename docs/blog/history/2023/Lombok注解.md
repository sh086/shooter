# Lombok注解

## 简化代码

### @NonNull

```java{13-15}
/**
* @NonNull，用于方法参数，会自动在方法内对该参数进行是否为空的校验
* 如果为空，则抛出NullPointerException（也可配置成抛出IllegalArgumentException）
*/
public void test(@NonNull User user) {

}

/**
* 相当于如下代码
*/
public void test(@NonNull User user) {
    if (user == null) {
        throw new NullPointerException("user is marked non-null but is null");
    }
}
```



### @Cleanup

```java{27,34-38}
public void testCleanup() throws IOException {
    String path =  System.getProperty("user.dir");
    /**
    * @Cleanup 用在局部变量之前，在当前变量范围内执行完毕后，自动生成try-finally并清理资源
    **/
    @Cleanup
    InputStream in = new FileInputStream(path+"/pom.xml");
    @Cleanup
    OutputStream out = new FileOutputStream(path+"/pomCopy.txt");
    byte[] b = new byte[10000];
    while (true) {
        int r = in.read(b);
        if (r == -1)
            break;
        out.write(b, 0, r);
    }
}

/**
* 相当于如下代码
**/
public void testCleanup() throws IOException {
    String path = System.getProperty("user.dir");
    InputStream in = new FileInputStream(path+"/pom.xml");
    try {
        OutputStream out = new FileOutputStream(path+"/pomCopy.txt");
        try {
            byte[] b = new byte[10000];
            while (true) {
                int r = in.read(b);
                if (r == -1) break;
                out.write(b, 0, r);
            }
        } finally {
            if (out != null) {
                out.close();
            }
        }
    } finally {
        if (in != null) {
            in.close();
        }
    }
}
```



### @SneakyThrows

```java{12}
/**
* @SneakyThrows：自动抛受检异常，而无需显式在方法上使用throws语句
*/
@SneakyThrows
public void testCleanup()  {
 
}

/**
* 相当于如下代码
**/
public void testCleanup() throws IOException {
 
}
```



## 构造器注解

### @AllArgsConstructor

```java{16-21}
/**
* @AllArgsConstructor:创建带有每个成员变量参数的构造函数
*/
@AllArgsConstructor
public class User {
    private String name;
    
    private Integer age;
    
    private final Integer sex;
    
    /**
    * @AllArgsConstructor相当于这个构造函数
    * 注意，这个构造函数与@AllArgsConstructor是不能共存的
    */
    public User(String nama,Integer age,Integer sex){
        super();
        this.name = name;
        this.age = age;
        this.sex = sex;
    }
}
```

### @RequiredArgsConstructor

```java{16-19}
/**
* @RequiredArgsConstructor:创建带有每个 final成员变量参数的构造函数
*/
@AllArgsConstructor
public class User {
    private String name;
    
    private Integer age;
    
    private final Integer sex;
    
    /**
    * @RequiredArgsConstructor相当于这个构造函数
    * 注意，这个构造函数与@RequiredArgsConstructor是不能共存的
    */
    public User(Integer sex){
        super();
        this.sex = sex;
    }
}
```

### @NoArgsConstructor

```java{17-19}
/**
* @NoArgsConstructor:若自定义构造器后，可通过该注解创建一个没有参数的构造器
*/
@NoArgsConstructor
public class User {
    private String name;
    
    private Integer age;
    
    // 使用@NoArgsConstructor修饰的不能有final成员变量，因为无法初始化，所以会报错
    // private final Integer sex;
    
    /**
    * @NoArgsConstructor相当于定义了这个构造函数
    * 注意，这个构造函数与@NoArgsConstructor是不能共存的
    */
    public User(){
        super();
    }
}

```



## 类方法重写

### @Getter和@Setter

```java
/**
* 在类级别上使用，表示为每个成员变量生成 getter和 setter
*/
@Getter
@Setter
public class User {
    private String name;
    private Integer age;
}

public class User {
    /**
    * 在变量级别上使用，表示为该变量生成 getter和 setter 方法
    * 但只能在非 final 成员变量上使用 @Setter，在 final成员变量上使用将导致编译错误
    */
    @Getter
    @Setter
    private String name;
}
```



### @ToString

（1）重写toString()方法

```java{16-19,24-27}
/**
* 默认情况下，自动重写 toString() 方法，包含所有变量
* 排除单个变量：ToString(exclude="name")
* 排除多个变量：ToString(exclude={"name","age"})
* 是否显示显示属性名称，@ToString(includeFieldNames = false) 默认为true
*/
@ToString
public class User {
    private String name;

    private Integer age;
    
    /**
    * 相当于如下代码
    */
    @Override
    public String toString() {
        return "User(name=" + this.getName() + ", age=" + this.getAge() + ")";
    }
    
    /**
    * 若includeFieldNames = false，则相当于如下代码
    */
    @Override
    public String toString() {
        return "User(" + this.name + ", " + this.age + ")";
    }
}
```

（2）调用父类的toString方法

```java{13-16}
/**
* 调用父类的toString方法：@ToString(callSuper=true)
*/
@ToString(callSuper=true)
public class User extends Person{
    private String name;
    
    private Integer age;
    
    /**
    * 相当于如下代码
    */
    @Override
    public String toString() {
        return "User(super=" + super.toString() + ", name=" + this.name + ", age=" + this.age + ")";
    }
}
```



### @EqualsAndHashCode

​	　对象比较时，默认比较的是地址，可以通过`@EqualsAndHashCode`注解**重写包含所有成员变量的`equals方法` 和 `hashCode 方法`**，包括所有非静态变量和非 transient 的变量，使其在对象比较时，进行的是成员变量值比较。 

```java

/**
* @EqualsAndHashCode : 重写包含所有成员变量的equals()和hashCode()
* @EqualsAndHashCode(exclude = "name") : exclude选项用于排除某些成员变量
* @EqualsAndHashCode(callSuper = true) : 用子类的属性和从父类继承的属性重写,默认为false
*/
@EqualsAndHashCode
public class User {
    private String name;

    private Integer age;
}
```

​	　注意，在 Java 中有规定，**当两个对象 equals 时，它们的 hashcode 一定要相同**，但hashcode 相同时，对象不一定 equals。所以 equals 和 hashcode 要一起实现，以免出现错误。



### @Data

```java
/**
* @Data= @Getter + @Setter + @ToString + @EqualsAndHashCode + @RequiredArgsConstructor
*/
@Data
public class User {
    private String name;

    private Integer age;
}

// 注意，若显示声明已包含的注解，会以显示声明的为主
@ToString(includeFieldNames = false)
@Data
public class User {
    private String name;

    private Integer age;
}
```



### @Value

```java{16,18}
/**
* @Value= @Getter + @ToString + @EqualsAndHashCode + @RequiredArgsConstructor
* @Value注解会把所有的变量都加上 final 修饰符
*/
@Value
public class User {
    private String name;

    private Integer age;
}

/**
* 相当于如下代码
*/
public class User {
    private final String name;

    private final Integer age;
    
    public String getName(){
        return name;
    }
    
    public Integer getAge(){
        return age;
    }
}
```



## 对象构造

### @Builder

```java
/**
* @Builder：默认，可以通过构建者模式简化配置代码
* @Builder(toBuilder = true) ：表示可以获取Builder，默认是false
*/
@Builder(toBuilder = true)
@Data
public class User {

    private String name;

    /**
    * @Builder.Default 使定义的默认值生效
    */
    @Builder.Default
    private Integer age = 12;
}
```

​	　首先，创建一个名为 `UserBuilder`的内部静态类，包含目标类中的**所有的属性**和未初始化的 final 字段、一个无参的**默认构造函数**、可以根据设置的值进行创建实体对象的`build()方法` 以及 方法名与该参数名相同的  `setter 方法`并且返回值是构建器本身（便于链式调用）,参考实现代码如下。

```java
@Data
@AllArgsConstructor
public class User {
    private String name;
    private Integer age;

    public static User.UserBuilder builder() {
        return new User.UserBuilder();
    }

    public User.UserBuilder toBuilder() {
        return (new User.UserBuilder()).name(this.name).age(this.age);
    }

    private static Integer defaultAge() {
        return 12;
    }

    public static class UserBuilder {
        private String name;
        private Integer age;

        public UserBuilder name(String name) {
            this.name = name;
            return this;
        }

        public UserBuilder age(Integer age) {
            this.age = age;
            return this;
        }

        public User build() {
            Integer age = this.age;
            if (age == null) {
                age = User.defaultAge();
            }
            return new User(this.name, age);
        }
    }
}
```

​	　测试用例如下，`@Builder`和`自定义UserBuilder`都可以达到如下测试效果。

```java
@SpringBootTest
public class CodeGeneratorTest {
    @Test
    public void testBuilder(){
        // 实例化User对象
        User user = User.builder().build();
        System.out.println(user.toString());
        // 打印结果：User(name=null, age=12)
        
		// 二次赋值
        user = user.toBuilder().name("mi").build();
        System.out.println(user.toString());
        // 打印结果：User(name=mi, age=12)
    }
}
```



### @Singular

​	　`@Builder.Default`只能为成员变量声明有默认值；`@Singular`注解可以为List、Set、Map声明有默认值，**且默认值必须为空对象**。

```java
@Data
@Builder
public class User {
    private String name;

    @Builder.Default
    private Integer age = 12;

    @Singular(value = "phone")
    private List<String> phone;
}
```

​	　测试用例如下：

```java
@SpringBootTest
public class UserTest {
    @Test
    public void testUser(){
        // 实例化User对象
        val user = User.builder().name("mi").build();
        System.out.println(user.toString());
        // 打印结果：User(name=mi, age=12, phone=[])
        
        // 实例化User对象
        val user2 = User.builder().name("mi").phone("123").phone("456").build();
        System.out.println(user2.toString());
        // 打印结果：User(name=mi, age=12, phone=[123, 456])
    }
}
```

​	　另外，还有些错误写法，如下请注意。

```java
// 已声明@Builder.Default，但是没有设定默认值，会提示错误的
@Builder.Default
private Integer age;

// @Singula必须设定value，否则会提示错误的
// @Singula只能初始化为 [] , 这样写仍是初始化为 []
@Singular(value = "phone")
private List<String> phone = new ArrayList<String>(Arrays.asList("o1", "o2"));
```



## 日志

### @Slf4j

```java
@Slf4j
public class UserService {
    public void test() {
        log.debug("doing stuff....");
    }
}
```

