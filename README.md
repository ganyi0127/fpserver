# fpserver

### 注册
* action ```register```
* params ```username``` ```password```
* return ```tokenId```

### 登录
* action ```login```
* params ```username``` ```password```
* return ```tokenId```

### 上传分数
* action ```addscore```
* params ```score``` ```uuid``` ```username```
* return ```id```

### 获取排行榜
* action ```list```
* params ```offset``` ```limit```
* return ```result``` ```offset``` ```limit```

### 获取排名
* action ```getranking```
* params ```uuid```
* return ```ranking```
