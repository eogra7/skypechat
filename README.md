# Skypechat

## Usage
Deployable from a Docker container `eogra7/skypechat:latest`.

First, create a `.env` file with the secret data. This include the Skype credentials and the database connection url. 

Your `.env` file should look like this:
```
SKYPE_USERNAME=replace_me
SKYPE_PASSWORD=replace_me
DB_URL=replace_me
ENVIRONMENT=prod
```

Pull the Docker image

```console
$ docker pull eogra7/skypechat:latest
```

Spin up a Docker container. This will start both the frontend and backend servers.
```console
$ sudo docker run -d -p 80:5000 --name skypechat --env-file .env eogra7/skypechat:latest
```
Explaination:

`-d` Run the container as a daemon (i.e. keep running after we close the shell)

`-p 80:5000` Map port 80 (http) of the host machine to port 5000 (frontend server port) inside the container. `sudo` is 
required since we want to bind to port 80

`--name skypechat` Give the new container a name, so we can control it easily in the future

`--env-file .env` Load the environment variables from `.env` into the container. This way, the backend server can make 
the required connections to the database and Skype

`eogra7/skypechat:latest` The name of the Docker image.

Once the container is running, inspect the output to make sure everything is running OK. You should see something like 
this:

```console
$ docker logs skypechat
> skypechat@1.0.0 start /usr/src/app
> babel-node app.js --extensions '.js,.ts'

Running as: prod
Connecting to database...
Connected to MongoDB
Connecting to Skype...
Connected to Skype!
Listening for new skype messages...
App listening on port 5000!
```

If the output looks like this, then the application is up and running on port 80 (not port 5000, that is online inside 
the Docker container). 

**IMPORTANT**
Navigate to the IP address of the linux machine to access the app with `/chats` at the end of the
 url. For example, `http://xx.xx.xx.xx/chats`. If you see a blank page when you try to access the app make sure you are 
 not at `/index.html`, since the app is not configured to serve at that endpoint.