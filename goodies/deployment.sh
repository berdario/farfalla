# Deployment.sh -  A shell script to upload Farfalla on a remote web server.

cd /Library/WebServer/Documents/farfalla_deploy
cp -r ../farfalla/* .
rm backend/app/config/database.php
rm goodies/deployment.sh
rm goodies/deploy.php
find . -name *.DS_Store -type f -exec rm {} \;

tar -cvf farfalla.tar.gz *
