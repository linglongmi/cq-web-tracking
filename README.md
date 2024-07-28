
# cq-web-tracing

安装
```bash
npm i cq-web-tracing
```

使用方法如下：
```ecmascript 6
import WebTracking from 'cq-web-tracing'
const tracking = new WebTracking({
  reportUrl: "/tracking/web",
  uid: "12345",
  afterSend() {
    console.log("上报完成！");
  },
});


```