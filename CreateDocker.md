docker build -t as-material-design .
docker run -i -t --name asmdRun as-material-design
docker tag as-material-design igorjeri/test:asmd
docker push igorjeri/test:asmd

**Build a new docker image**

docker build -t as-material-design-image .

**Create a volume connected to the image**
docker run -v /usr/share/nginx/html --name asmd-data as-material-design-image true

docker run -d -p 80 --name www-asmd as-material-design-image

**Create a container based on nginx that uses the new volume**
docker run -d -p 80 --volumes-from asmd-data --name www-asmd nginx
//docker run -d -p 80 --volumes-from asmd-data --name www-asmd nginx

**Show the ports on the new container**
curl $(docker port www-asmd 80)
curl $(docker port www-asmd 80)/seerver.alterspective.materialdesignforK2.js

**Expose to internet with an ngrok container**
docker run -d -p 4040 --link www-asmd:http --name www-asmd_ngrok wernight/ngrok

**get back ports**
curl $(docker port www-asmd_ngrok 4040)/api/tunnels
**Open the url to ngrok log screen in the browser**
open http://$(docker port www-asmd_ngrok 4040)

Connects to a volume and changes a file
---------------------------------------

docker run --rm --volumes-from asmd as-material-design /bin/sh -c 'echo "<h1>Yo</h1>" > /usr/share/nginx/html/index.html'


docker run -d -p 80 --volumes-from asmd-data --name www-asmd2 nginx