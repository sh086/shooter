# 哔哩哔哩 (゜-゜)つロ

## 概述

### 业务需求

### 抓包分析

![image-20240623170615332](.\images\image-20240623170615332.png)

![image-20240623165020286](.\images\image-20240623165020286.png)

## 视频

### 下载

B站视频画面和视频声音是分开的



### 弹幕

​	　首先，在看B站视频时，在`bilibili.com`域名前面加个`i`字母，即可访问爱哔哩工具站，该网页中由解析好的弹幕地址。

![image-20240622180632657](.\images\image-20240622180632657.png)

​	　代码实现：

```python
import requests
import re

# 发送请求
# 此处的oid就是cid,也可在网页中获取
url = 'https://api.bilibili.com/x/v1/dm/list.so?oid=1562982127'
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'}

response = requests.get(url=url, headers=headers)
response.encoding = 'utf-8'
# print(response.text)

# 解析数据
content_list = re.findall(r'<d p=".*?">(.*?)</d>', response.text)
content_str = '\n'.join(content_list)
with open('弹幕.txt', 'w', encoding='utf-8') as fw:
    fw.write(content_str)
```

### 评论

```python
# 导入csv模块
import csv
# 导入HTTP模块
import requests
# 导入加密模块
import hashlib
# 导入内置时间模块
import time
# 导入URL编码模块
from urllib.parse import quote
# 导入第三方时间模块
from datetime import datetime

# 设置固定参数
# oid: 视频的cid
# web_location: 在请求中查看
oid = '1605209994'
web_location = 1315875


# 获取加密参数w_rid
# pagination_str: 下一页请求值，通过接口获取
# wts: 时间戳
def get_w_rid(pagination_str, wts):
    en = ['mode=3',
          f'oid={oid}',
          f'pagination_str={pagination_str}',
          'plat=1',
          'seek_rpid=',
          'type=1',
          f'web_location={web_location}',
          f'wts={wts}']
    string = '&'.join(en) + "ea1db124af3c7062474693fa704f4ff8"
    MD5 = hashlib.md5()
    MD5.update(string.encode('utf-8'))
    return MD5.hexdigest()


# 原视频地址
# https://www.bilibili.com/video/BV1bm421N7ru/?spm_id_from=333.788&vd_source=f87f39b1af12eeb6301c7d9944f97ec9
# 设置请求地址和请求头
base_url = 'https://api.bilibili.com/x/v2/reply/wbi/main?type=1&mode=3&plat=1&seek_rpid='
headers = {
    # 没有Cookie的话获取不到location信息
    'Cookie': "buvid3=E689D31C-EBE7-0D4D-F07C-0FD19B512FC184128infoc; b_nut=1714830384; _uuid=24564A210-F44E-5615-101C9-35F2412C8D5B30414infoc; rpdid=|(u)~m~lRlR|0J'u~uR)JuYJ|; DedeUserID=393064787; DedeUserID__ckMd5=7da7c00dbacf7351; enable_web_push=DISABLE; header_theme_version=CLOSE; buvid_fp_plain=undefined; buvid4=77EF1CDA-1F19-25A6-D9CE-AE8E6F4C589884128-024050413-YRhbWcuExuOyrC%2FRS1ie5g%3D%3D; CURRENT_BLACKGAP=0; CURRENT_FNVAL=4048; home_feed_column=5; fingerprint=c4aba8e230d8c85eb5b332b68407a873; SESSDATA=31e4a46e%2C1734621838%2C0680d%2A62CjA5gNJx6_SFUXVH693qEjWCJVF20OGNhoJacoum3wGK9vCQWhrSbrLybkrCZ9gjCYUSVmxlYmdwYnFyZHNvU1F5QXNOT0JQNXlCSmNCMFNVU09GdHVDNE1xOGdzTG5ZaFFuZ2M1azJ0dWZVdHRLcHRrN2dEemdFMjdJUjZiUlVrUHdtajZacTJnIIEC; bili_jct=5bd71cb03eae07548266197ef035aa50; sid=6i5o8z4i; buvid_fp=c4aba8e230d8c85eb5b332b68407a873; LIVE_BUVID=AUTO4217191050884049; bili_ticket=eyJhbGciOiJIUzI1NiIsImtpZCI6InMwMyIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTkzNjQzMTUsImlhdCI6MTcxOTEwNTA1NSwicGx0IjotMX0.Go5urrrucXNDkh5t4Qzdy9V6BAdzHDUmhfWV2EKlheY; bili_ticket_expires=1719364255; PVID=4; bp_t_offset_393064787=946163587158638592; browser_resolution=2058-1638; b_lsid=B3926D22_19044A1067E",
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
}

# 设置导出结果文件名
data_str = datetime.now().strftime("%Y%m%d%H%M%S")
cvs_file_name = f"B站评论_{data_str}.csv"
# 保存csv文件头部
f = open(cvs_file_name, mode='w', encoding='utf-8-sig', newline='')
csv_writer = csv.DictWriter(f, fieldnames=[
    '昵称', '性别', '地区', '评论', '时间'
])
csv_writer.writeheader()

# 第一页的offset为空，其余页通过接口获取
offset = ''

while True:
    # 设置参数
    wts = int(time.time())
    # pagination_str需要进行url编码
    pagination_str = quote('{"offset":"%s"}' % offset)
    # 加密 获取w_rid参数
    w_rid = get_w_rid(pagination_str, wts)

    # 发送请求
    url = f"{base_url}&oid={oid}&pagination_str={pagination_str}" \
          f"&w_rid={w_rid}&wts={wts}&web_location={web_location}"
    response = requests.get(url=url, headers=headers)
    if response.status_code != 200 | response.json()['code'] != '0':
        print('HTTP请求失败:', response.text)
        break

    # 获取数据
    replies = response.json()['data']['replies']
    if len(replies) <= 0:
        print("下载评论完成")
        break

    # 写入csv文件
    for index in replies:
        # 格式化时间
        date_time = datetime.fromtimestamp(index['ctime']).strftime("%Y-%m-%d %H:%M:%S")
        dit = {
            '昵称': index['member']['uname'],
            '性别': index['member']['sex'],
            # 若location不为空则去除 IP属性 字样
            '地区': index['reply_control']['location'].replace('IP属性', '') if 'location' in index[
                'reply_control'] else "-",
            '评论': index['content']['message'],
            '时间': date_time,
        }
        csv_writer.writerow(dit)

    offset = response.json()['data']['cursor']['pagination_reply']['next_offset']
    # 保证offset打印的是如下格式的字符
    # "{\"type\":1,\"direction\":1,\"session_id\":\"1760406203972306\",\"data\":{}}"
    offset = str(offset).replace('"', '\\\"')
# 关闭文件
f.close()
```



### 合集

## 直播

### 下载

### 弹幕

```python
import requests
# 导入内置时间模块
import time

# 设置请求地址和请求头
url = "https://api.live.bilibili.com/xlive/web-room/v1/dM/gethistory?roomid=47867&room_type=0"
headers = {
   'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
}

barrage_list = []
while True:
    response = requests.get(url=url, headers=headers)
    if response.status_code != 200 | response.json()['code'] != '0':
        print('HTTP请求失败:', response.text)
        break

    # 获取数据
    data_list = response.json()['data']['room']
    # 解析数据
    for index in data_list:
        barrage = index['text']
        if barrage not in barrage_list:
            barrage_list.append(barrage)
            print(barrage)
            if len(barrage_list) > 10:
                barrage_list = barrage_list[1:11]

    time.sleep(1)
```



## 信息

### 热门视频排行

### UP主信息

​		