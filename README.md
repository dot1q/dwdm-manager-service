# cos-dwdm-manager-backend

# DBMS Dev
Use Mysql Docker Image for local testing. 
```docker run --name mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -e MYSQL_DATABASE=dwdm_dev -e MYSQL_USER=dev -e MYSQL_PASSWORD=password -p 3306:3306 -d mysql```


# Setup Dev Env
1) Clone repo
2) Inside repo root, run '''npm run install'''
3) Run MySQL docker instance
4) Run '''npm run serve'''