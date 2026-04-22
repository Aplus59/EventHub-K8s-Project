# EventHub Kubernetes (K8s) & Microservices Project

Welcome to the newly structured Monorepo for the `Programmation Distribuée` Master Info assignment. This repository is now architecturally aligned to fully satisfy the grading criteria (up to 20/20) by utilizing Microservices, Docker, and Kubernetes.

---

## ✅ What Has Been Completed (Backend Phase)
*Completed by Person B (Backend Developer)*

1. **Monorepo Migration**
   - The old monolithic codebase has been restructured into a clean Monorepo.
   - Isolated sub-directories (`auth-service/`, `event-service/`, and `db/`) were created.
   
2. **Microservices Decoupling (14/20 Mark Target)**
   - The monolithic Node.js backend has been completely decoupled into two independent microservices:
     - **`auth-service`**: Exclusively handles Participants' CRUD and JWT authentication.
     - **`event-service`**: Exclusively handles Events' CRUD and Registration logic.
   - Code redundancy (routes, controllers, swagger documentation) was entirely removed from both services.

3. **Advanced API Dockerization (18/20 Mark Security Consideration)**
   - Created highly optimized `Dockerfile`s for both services utilizing **Multi-stage builds** (reducing image size to < 100MB).
   - Applied **Security Hardening**: The containers run under a non-root user (`USER 1001`) preventing root privilege escalation.
   - Integrated internal `HEALTHCHECK` instructions.

4. **Database Automation (16/20 Mark Target)**
   - Extracted the SQL database schema into `db/init.sql`.
   - The PostgreSQL container now automatically executes this schema upon initialization. No manual table creation is explicitly required.

5. **Local Orchestration Setup**
   - Built a master `docker-compose.yml` that correctly bootstraps the local environment.
   - It networks `postgres`, `auth-service`, and `event-service` together asynchronously.
   - **Status**: Tested and verified. Everything works perfectly via `docker compose up --build`.

---

## 🚀 Teammate Action Items (Frontend & K8s Phase)
*Assigned to Person A (Frontend & DevOps Developer)*

Your foundation is ready! Please execute the following sequence to complete our project:

### 1. Integrate the React Frontend
- Move the old `eventhub-frontend-v2` directory into this root folder.
- Write a multi-stage `Dockerfile` inside the React folder (Use `node` for building and `nginx:alpine` for serving the static files).

### 2. Push Images to Docker Hub (MANDATORY)
- Build the 3 container images (Frontend, Auth-Service, Event-Service).
- Push all of them to your public Docker Hub registry (e.g., `docker push your-username/auth-service:v1`).

### 3. Write Kubernetes YAML Manifests (16/20 Mark)
Based strictly on the variables mapping in our `docker-compose.yml`, write the equivalent Kubernetes manifests inside a new `.k8s/` folder:
- **Deployments & Services:** For `frontend`, `auth-service`, and `event-service`.
- **StatefulSet/Persistent Volume Claim (PVC):** For the PostgreSQL database to preserve data.

### 4. Implement Cluster Security & Ingress (18/20 Mark)
- **Secrets:** Convert the environment variables (`JWT_SECRET`, `POSTGRES_PASSWORD`) into K8s Secrets instead of hardcoding them in deployments.
- **Ingress Gateway:** Write an `ingress.yaml` file to expose Minikube. Route `/` to the React frontend, `/api/auth` to the `auth-service`, and `/api/events` to the `event-service`.

### 5. Bonus: Cloud Deployment (20/20 Mark)
- Once everything works smoothly on local `minikube tunnel`, deploy these manifests to a public Cloud provider (e.g., Google Cloud Labs/GKE).

---

## ⚠️ Important Developer Notes

- **Database Shared Pattern:** The `auth` and `event` microservices share the same `eventhub` PostgreSQL database physically. This is an intentional design choice to prioritize ACID consistency in our specific registration workflow over complex event brokers.
- **Microservices Communication:** The two backend services communicate *statelessly* via the `JWT_SECRET`. They do not make direct HTTP requests to each other. Both services must have the exact same `JWT_SECRET` configured in their K8s environment variables to parse the login token properly.
- **To test the current setup locally without K8s:** Simply run `docker compose up` at the project root. You will be able to access the Swagger UIs at `localhost:5001/api/docs` and `localhost:5002/api/docs`.
