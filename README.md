# cos-dwdm-manager-backend

# DBMS Dev
Use Mysql Docker Image for local testing. 
```docker run --name mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -e MYSQL_DATABASE=dwdm_dev -e MYSQL_USER=dev -e MYSQL_PASSWORD=password -p 3306:3306 -d mysql```


# Setup Dev Env
1) Clone repo
2) Inside repo root, run '''npm run install'''
3) Run MySQL docker instance
4) Run '''npm run serve'''

# Production Run
1) Build the repo ```npm run build```
2) Use cross-env to pass args for Linux Terminal ```DB=dwdm_prod DB_USER=dev DB_PASS=password npm run start```

# Docker Image
1) ```docker build -t dwdm-manager-service .```
2) ```docker run --name mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -e MYSQL_DATABASE=dwdm_prod -e MYSQL_USER=prod -e MYSQL_PASSWORD=hunter2 -p 3306:3306 -d mysql```
3) ```docker run -e DB_HOST=mysql -e DB_USER=prod -e DB_PASS=hunter2 dwdm-manager-service```