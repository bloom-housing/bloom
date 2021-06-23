### Rationale

We want to serve different versions of the API under different paths e.g. `/v2`, `/v3` but not necessarily reflect that convention in the code. 
To achieve that an NGINX proxy has been created and set up as an entrypoint to the entire API. It provides path level routing e.g. `/v2` will be routed to a different heroku APP then `/`.

### Setup


Based on [this tutorial](https://dashboard.heroku.com/apps/bloom-reference-backend-proxy/deploy/heroku-container). All values are for `bloom-reference-backend-proxy` and each environment requires it's own proxy.

#### Install the Heroku CLI
Download and install the Heroku CLI.

If you haven't already, log in to your Heroku account and follow the prompts to create a new SSH public key.

```
$ heroku login
```
#### Log in to Container Registry
You must have Docker set up locally to continue. You should see output when you run this command.

```
$ docker ps
```

Now you can sign into Container Registry.

```
$ heroku container:login
```

Push your Docker-based app
Build the Dockerfile in the current directory and push the Docker image.

```
# workdir: backend/proxy
$ heroku container:push --app bloom-reference-backend-proxy web
```

Deploy the changes
Release the newly pushed images to deploy your app.

```
$ heroku container:release --app bloom-reference-backend-proxy web
```

#### Configuration

Heroku Proxy app requires two environment variables to work:

```
heroku config:set --app bloom-reference-backend-proxy BACKEND_V1_HOSTNAME=example.v1.hostname.com
heroku config:set --app bloom-reference-backend-proxy BACKEND_V2_HOSTNAME=example.v2.hostname.com
```
