# Deployment

This project deploys to **Railway** using **config as code** only (no Terraform).

- **Build and deploy settings** are in the repo root: [`railway.json`](../railway.json).
- To deploy: connect this repo to Railway (e.g. [railway.com/new](https://railway.com/new)), set your **variables** (see `server/.env.example`) in the Railway dashboard, and push. Railway will use `railway.json` for the build command, start command, healthcheck, and watch paths.
