# 爬取B站视频、评论和弹幕

## 视频

### 下载

（1）抓包分析

​	　首先，打开[B站视频网页](https://www.bilibili.com/video/BV1Vn4y1R7Wa/?spm_id_from=333.999.0.0&vd_source=f87f39b1af12eeb6301c7d9944f97ec9)，进入`F12`，然后再次刷新网页，接着，搜索`m4s`媒体文件对应的请求接口地址。

![image-20240625212512604](.\images\image-20240625212512604.png)

​	　以`m4s`片段请求接口的开头，再次搜索，即可定位到资源下载地址列表。列表中第一个就是最高清的视频链接。

![image-20240625212701162](.\images\image-20240625212701162.png)

​	　注意，B站视频画面和视频声音是分开的，所以需要提前下载[ffmpeg](https://www.ffmpeg.org/download.html#build-mac)用于将音频和视频进行合并。`ffmpeg`安装参考[这里](https://blog.csdn.net/qq_35164554/article/details/124866110)，下载或者合并完成的MP4文件可以在[这里](https://33tool.com/vplayer/)播放。

（2）代码实现

```python
# 导入正则模块
import re
# 导入HTTP模块
import requests
# 导入json模块
import json
# 导入进程模块
import subprocess

# 设置请求地址和请求头
url = "https://www.bilibili.com/video/BV1Vn4y1R7Wa/?spm_id_from=333.999.0.0&vd_source=f87f39b1af12eeb6301c7d9944f97ec9"
headers = {
    # Cookie 用户信息，用于检测是否登录账号, 不填只能采集游客可见的低码率视频
    "Cookie": "buvid3=E689D31C-EBE7-0D4D-F07C-0FD19B512FC184128infoc; b_nut=1714830384; _uuid=24564A210-F44E-5615-101C9-35F2412C8D5B30414infoc; rpdid=|(u)~m~lRlR|0J'u~uR)JuYJ|; DedeUserID=393064787; DedeUserID__ckMd5=7da7c00dbacf7351; enable_web_push=DISABLE; header_theme_version=CLOSE; buvid_fp_plain=undefined; buvid4=77EF1CDA-1F19-25A6-D9CE-AE8E6F4C589884128-024050413-YRhbWcuExuOyrC%2FRS1ie5g%3D%3D; CURRENT_BLACKGAP=0; CURRENT_FNVAL=4048; home_feed_column=5; fingerprint=c4aba8e230d8c85eb5b332b68407a873; SESSDATA=31e4a46e%2C1734621838%2C0680d%2A62CjA5gNJx6_SFUXVH693qEjWCJVF20OGNhoJacoum3wGK9vCQWhrSbrLybkrCZ9gjCYUSVmxlYmdwYnFyZHNvU1F5QXNOT0JQNXlCSmNCMFNVU09GdHVDNE1xOGdzTG5ZaFFuZ2M1azJ0dWZVdHRLcHRrN2dEemdFMjdJUjZiUlVrUHdtajZacTJnIIEC; bili_jct=5bd71cb03eae07548266197ef035aa50; sid=6i5o8z4i; VIP_DEFINITION_GUIDE=1; buvid_fp=c4aba8e230d8c85eb5b332b68407a873; LIVE_BUVID=AUTO4217191050884049; bili_ticket=eyJhbGciOiJIUzI1NiIsImtpZCI6InMwMyIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MTkzNjQzMTUsImlhdCI6MTcxOTEwNTA1NSwicGx0IjotMX0.Go5urrrucXNDkh5t4Qzdy9V6BAdzHDUmhfWV2EKlheY; bili_ticket_expires=1719364255; PVID=18; browser_resolution=2588-1638; bmg_af_switch=1; bmg_src_def_domain=i2.hdslb.com; bsource=search_google; bp_t_offset_393064787=946588883410223104; b_lsid=CC9A7BA1_1904A69536C",
    # 防盗链 告诉服务器请求链接是从哪里跳转过来的
    "Referer": "https://www.bilibili.com/video/BV1VS411A7UT/?spm_id_from=333.999.0.0&vd_source=f87f39b1af12eeb6301c7d9944f97ec9",
    # 用户代码 表示浏览器/设备 基本身份信息
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
}
# 下载数据
response = requests.get(url=url, headers=headers)

# 解析数据
# 音视频信息
info_list = re.findall('<script>window.__playinfo__=(.*?)</script>', response.text)
json_obj = json.loads(info_list[0])
# 音频链接 0就是最高清的 -1是最低的
audio_url = json_obj['data']['dash']['audio'][0]['baseUrl']
# 视频链接
video_url = json_obj['data']['dash']['video'][0]['baseUrl']
# 视频标题
video_title = re.findall(' title="(.*?)" class="video-title', response.text)[0]
# 去除标题中的特殊字符，只保留中午、字母和数字
video_title = re.sub('[^0-9a-zA-Z\u4e00-\u9fa5]+', '', str(video_title))
#print(video_title, audio_url, video_url)

# 下载音视频
with open('临时文件.mp3', 'wb') as audio:
    audio.write(requests.get(url=audio_url, headers=headers).content)
with open('临时文件.mp4', 'wb') as video:
    # 视频下载必须加上Referer防盗链
    video.write(requests.get(url=video_url, headers=headers).content)

# 音视频合并
cmd = f"ffmpeg -i 临时文件.mp3 -i 临时文件.mp4  -acodec copy -vcodec copy {video_title}_output.mp4"
subprocess.run(cmd)
print(f"{video_title}_output.mp4 已经下载完毕")
```



### 视频合集



### 个人空间

（1）抓包分析

​	　经上面下载B站视频下载分析，批量下载只需更换 `B站视频ID` 即可。任选一个UP主页，如[这里](https://space.bilibili.com/11130880/video)，通过`播放全部`按钮，即可获取全部的视频ID。

![image-20240624233529731](.\images\bilibili_03.png)

（2）安装第三方模块

```shell
# 安装自动化模块
pip install DrissionPage
```

（3）代码实现

```python
# 导入自动化模块
from DrissionPage import ChromiumPage

if __name__ == '__main__':
    driver = ChromiumPage()
    # 监听前缀为这个的接口返回
    driver.listen.start('https://api.bilibili.com/x/space/wbi/arc/search')
    # 访问UP主空间
    driver.get("https://space.bilibili.com/11130880/video")
    # 等待监听结果
    resp = driver.listen.wait()
    # 获取响应数据
    json_data = resp.response.body
    # 解析视频ID
    for index in json_data['data']['list']['vlist']:
        bv = index['视频ID']
        print(f'正在下载{bv}')
        # 传入bv下载并保存视频
        # 这里就是上一小节的代码，只需在url替换视频ID即可
        getVideoInfo(bv)
```



### 番剧

​	　以[猫和老鼠](https://www.bilibili.com/bangumi/play/ep249469?from_spmid=666.25.episode.0)这个番剧为例，首先搜索`m4s`媒体文件对应的请求接口地址，然后，以`m4s`片段请求接口的开头，再次搜索，即可定位到资源下载地址列表。

​	　注意，第1、2、3集的播放地址都是在页面上的，从第4集开始才可以批量从接口获取。

```python
https://api.bilibili.com/pgc/player/web/v2/playurl?support_multi_audio=true&qn=80&fnver=0&fnval=4048&fourk=1&gaia_source=&from_client=BROWSER&is_main_page=true&need_fragment=true&season_id=357&isGaiaAvoided=false&ep_id=249469&session=c734f5d2484897be4dec398280995687&voice_balance=1&drm_tech_type=2


https://api.bilibili.com/pgc/player/web/v2/playurl?support_multi_audio=true&qn=80&fnver=0&fnval=4048&fourk=1&gaia_source=&from_client=BROWSER&is_main_page=true&need_fragment=true&season_id=357&isGaiaAvoided=false&ep_id=249470&session=94c28dabc6b5e9b3467c5da125e6e2d7&voice_balance=1&drm_tech_type=2



```





![image-20240626232702528](.\images\image-20240626232702528.png)





![image-20240626233611938](.\images\image-20240626233611938.png)



### 弹幕

​	　在看B站视频时，在`bilibili.com`域名前面加个`i`字母，即可访问[爱哔哩工具站](https://www.ibilibili.com/video/BV1bm421N7ru/?spm_id_from=333.788&vd_source=f87f39b1af12eeb6301c7d9944f97ec9)，该网页中由解析好的弹幕地址。

![image-20240622180632657](.\images\bilibili_02.png)

​	　直接通过`GET`请求该弹幕地址即可获取视频完整的弹幕信息。此外，也可以通过页面进行批量采集，这里不再赘述。

```python
import requests
import re

# 发送请求
# 此处的oid就是cid,也可在网页中获取
url = 'https://api.bilibili.com/x/v1/dm/list.so?oid=1562982127'
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
}

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

（1）抓包分析

​	　打开[B站视频网页](https://www.bilibili.com/video/BV1Vn4y1R7Wa/?spm_id_from=333.999.0.0&vd_source=f87f39b1af12eeb6301c7d9944f97ec9)，进入`F12`，然后再次刷新网页，根据**评论内容**进行搜索，即可得到获取评论第一页的请求接口以及参数。

![image-20240625233137593](.\images\image-20240625233137593.png)

​	　接着，向下拉动以获取第二页评论，并按上面的方法获取评论第二页的请求接口以及参数。通过观察可分为`baseUrl`、固定参数和可变参数。

```
# 评论第一页的请求接口以及参数
https://api.bilibili.com/x/v2/reply/wbi/main?oid=1055633354&type=1&mode=3&pagination_str=%7B%22offset%22:%22%22%7D&plat=1&seek_rpid=&web_location=1315875&w_rid=5d242111f65086efb98df330463aa599&wts=1719329085
# 评论第二页的请求接口以及参数
https://api.bilibili.com/x/v2/reply/wbi/main?oid=1055633354&type=1&mode=3&pagination_str=%7B%22offset%22:%22%7B%5C%22type%5C%22:1,%5C%22direction%5C%22:1,%5C%22session_id%5C%22:%5C%221760592981052008%5C%22,%5C%22data%5C%22:%7B%7D%7D%22%7D&plat=1&web_location=1315875&w_rid=4ae34290e66f00e26b289b1a208b60bc&wts=1719329573

# baseUrl
https://api.bilibili.com/x/v2/reply/wbi/main
# 固定参数
oid=1055633354&type=1&mode=3&plat=1&seek_rpid=&web_location=1315875
# 可变参数
pagination_str: 存储的是下一页信息
w_rid：MD5加密
wts：时间戳
```

​	　经观察可知，`pagination_str`是由`URL编码`的，第一页传入的是`{"offset":""}`，第二页以及下一页由接口的`next_offset`返回。

![image-20240626000334652](.\images\image-20240626000334652.png)

​	　最后，全局搜索`w_rid`字样，并在可能的地方打上断点，刷新网页，即可获取到`w_rid`如何加密的代码。

![image-20240623170615332](.\images\bilibili_01.png)

​	　分析此段代码，可得 `w_rid`加密逻辑如下：

```
① ee 列表中存储了参数的内容
② 通过join把en列表合并成一个字符串L
③ md5(L+固定字符串z) 就是w_rid
```

（3）代码实现

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

    # 设置下一页的offset
    offset = response.json()['data']['cursor']['pagination_reply']['next_offset']
    # 保证offset打印的是如下格式的字符，否则w_rid会加密失败的
    # "{\"type\":1,\"direction\":1,\"session_id\":\"1760406203972306\",\"data\":{}}"
    offset = str(offset).replace('"', '\\\"')
# 关闭文件
f.close()
```



## 直播

### 下载

### 弹幕

（1）抓包分析

​	　打开B站直播，进入`F12`，然后再次刷新网页，接着搜索已发送的弹幕，即可获得弹幕链接地址。

![image-20240626001552513](.\images\image-20240626001552513.png)

（2）代码实现

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
        # 接口获取的是最新的10条弹幕，所以已打印的无需重复打印
        if barrage not in barrage_list:
            barrage_list.append(barrage)
            print(barrage)
            if len(barrage_list) > 10:
                barrage_list = barrage_list[1:11]
    # 间隔1s获取一次
    time.sleep(1)
```



## 信息

### 热门视频排行

### UP主信息

​		