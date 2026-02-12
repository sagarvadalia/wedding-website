# Deployment

This project deploys to **Render** using **config as code**.

- **Build and deploy settings** are in the repo root: [`render.yaml`](../render.yaml) (Render Blueprint).
- To deploy: connect this repo to Render via **New → Blueprint** (or **New → Web Service**), set **Environment** variables (see `server/.env.example`) in the Render dashboard, and push. Render uses `render.yaml` for build command, start command, healthcheck, and build filter.
