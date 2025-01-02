# Documentation

## Table of contents

- Provision the infrastructures in local development
- Run database migration files

## Provision the infrastructures in local development

```bash
docker compose --env-file docker.env up -d
```

## Run database migration files

```bash
yarn typeorm migration:run
```
