# Docker

Run the docker images to emulate a cloud deployment locally on your machine. Docker and Docker
Compose are required. The easiest way is to install [Docker
Desktop](https://docs.docker.com/desktop/) but [Podman](https://podman.io/docs/installation) is also
supported if you manually install [Docker Compose](https://github.com/docker/compose).

To get started, run `docker compose build` to build the required images. Run `docker compose up` to
start the deployment. The sites are available at:

- partners: http://localhost:3001
- public: http://localhost:3000

> [!NOTE]
> If running on mac apple silicon, docker and podman run a linux VM where the images are build and
> run. We have hit issues when the VM does not have enough disk space and memory. We've found the
> following limits to work okay:
>
> - 8 CPU
> - 12GB memory
> - 200GB disk space

## Containers

The following containers are defined in the [docker-compose.yml](./docker-compose.yml) file:

- `lb`: a nginx load balancer that fronts the `api`, `partners`, and `public` containers. A LB is
  required to run multiple replicas of these containers.
- `db`: the postgres database.
- `dbseed`: runs a [db seed script](./api/Dockerfile.dbseed.dev).
- `api`: the [api](./api).
- `partners`: the [partners site](./sites/partners).
- `public`: the [public site](./sites/partners).

Build, start, and tear down containers with the following commands. Each command takes an optional
list of containers to operate on. By default the command operates on all containers.

- `docker compose build [container...]`
- `docker compose up [container...]`
- `docker compose down [container...]`

For example, to rebuild just the api and partners site docker images, run:

```bash
docker compose build api partners
```

### Multiple replicas

By default the `api`, `partners`, and `public` containers each run with 1 replica. To control the
number of replicas, use the `API_REPLICAS`, `PARTNERS_REPLICAS`, and `PUBLIC_REPLICAS` environment
variables. For example, the following command runs 3 replicas for each service:

```bash
API_REPLICAS=3 PARTNERS_REPLICAS=3 PUBLIC_REPLICAS=3 docker compose up
```

### Restarting and rebuilding

By default the containers are just stopped and not deleted when you exit the `docker compose up`
command. If you run `docker compose up` again the containers will be restarted. This means the `db`
container will have the prior state from the last run. This causes the `dbseed` container to fail
because it already seeded the database on the previous run. Either:

- Run `docker compose down` between running `docker compose up`. This wipes the database state
  clean.
- Run `docker compose up lb db api partners public` to restart just the `lb`, `db`, `api`, `partners`, and
  `public` containers.

By default `docker compose up` will not rebuild images. Rebuild with `docker compose build`.

## Debugging

### Run a command in an existing container

To run a command inside one of the containers defined in the docker-compose.yml file, first get its
container ID:

```bash
docker container ls
```

For example, the ID of of the public site container in the following example output is
`62de5c066288`:

```
$ docker container ls
CONTAINER ID  IMAGE                                    COMMAND               CREATED         STATUS                   PORTS                   NAMES
5b4b92589171  docker.io/library/postgres:18            postgres              13 minutes ago  Up 13 minutes (healthy)  5432/tcp                bloom-db-1
3fb2c2f39540  docker.io/library/bloom-api:latest       /bin/bash -c yarn...  13 minutes ago  Up 13 minutes (healthy)  0.0.0.0:3100->3100/tcp  bloom-api-1
d111808885be  docker.io/library/bloom-partners:latest  /bin/bash -c yarn...  13 minutes ago  Up 13 minutes            0.0.0.0:3001->3001/tcp  bloom-partners-1
62de5c066288  docker.io/library/bloom-public:latest    /bin/bash -c yarn...  13 minutes ago  Up 13 minutes            0.0.0.0:3000->3000/tcp  bloom-public-1
```

Then, use `docker exec` to run a command. For example, the following command runs `ls
/app/sites/public/.next/server/chunks` in the public site container:

```bash
docker exec 62de5c066288 ls /app/sites/public/.next/server/chunks
```

To run a command that expects stdin like bash, use `docker exec -it`. For example, the following
command runs a bash process inside the public site container:

```bash
docker exec -it 62de5c066288 /bin/bash
```

### Start an additional container in the network

The docker-compose.yml file creates a docker network called `bloom_default`. To run a new container
inside the network, use the `--network=bloom_default` flag in `docker container run`. For example, the
following command starts a python docker image and runs a bash shell in it. Then in the shell it
curls the api and pretty-prints the result using python:

```
docker container run --network=bloom_default --rm -it python:latest /bin/bash
root@c89395fd8af3:/# curl api:3100/jurisdictions | python -m json
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 26650  100 26650    0     0  1824k      0 --:--:-- --:--:-- --:--:-- 1858k
[
    {
        "id": "1f5639e2-5de0-40b3-8e32-ed5dca4d22f2",
        "createdAt": "2025-10-20T23:01:27.920Z",
        "updatedAt": "2025-10-20T23:01:27.920Z",
        "name": "Revitalizing Rosewood",
        "notificationsSignUpUrl": "https://www.exygy.com",
        "languages": [
            "en",
             ...
```

The `--rm` flag removes the container when the command exits. Otherwise the container still exits
but with an Exited status. Run `docker container ls -a` to list all containers including ones that
are not running.

## Database seeding

The database is seeded with the `yarn:dbseed:staging` script by default. To use the dev seed script,
edit the `command:` field for the `dbseed` service in the [docker-compose.yml](./docker-compose.yml)
file:

```yaml
  dbseed:
    build:
      context: ./api
      dockerfile: Dockerfile.dbseed.dev
    restart: no
    environment:
      DATABASE_URL: "postgres://postgres:example@db:5432/bloom_prisma"
    command:
    - "yarn"
    - "db:seed:development" # <- change this line to your desired DB seed
                            # script in ./api/package.json
    depends_on:
      api:
        condition: service_healthy
```

