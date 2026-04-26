
---

# EventHub — Plateforme de gestion d'événements

EventHub est une application web de gestion d'événements développée en architecture microservices, containerisée avec Docker et orchestrée avec Kubernetes.

**Binôme :** Rica Mouele Yandza Itotoba + Khanh Nguyen Ho Bao
**Cours :** Master 1 — Programmation Distribuée
**GitHub :** https://github.com/Aplus59/EventHub-K8s-Project

---

## Architecture

```
EventHub-K8s-Project/
├── auth-service/              # Microservice authentification (Node.js)
├── event-service/             # Microservice événements (Node.js)
├── eventhub-frontend-v2/      # Frontend React + Vite
│   ├── Dockerfile             # Build multi-stage Vite + Nginx
│   └── nginx.conf             # Configuration Nginx
├── db/
│   └── init.sql               # Schéma PostgreSQL (auto-exécuté)
├── docker-compose.yml         # Orchestration locale
└── k8s/                       # Manifestes Kubernetes
    ├── secrets.yaml           # Credentials encodés base64
    ├── rbac.yaml              # ServiceAccount + Role + RoleBinding
    ├── network-policy.yaml    # Isolation réseau PostgreSQL
    ├── postgres-deployment.yaml # BDD + PV + PVC + ConfigMap
    ├── auth-deployment.yaml
    ├── event-deployment.yaml
    ├── frontend-deployment.yaml
    └── ingress.yaml           # Gateway HTTP/HTTPS
```

---

## Composants

| Service | Technologie | Port | Rôle |
|---|---|---|---|
| auth-service | Node.js / Express | 5000 | Login, signup, JWT, participants |
| event-service | Node.js / Express | 5000 | Événements, inscriptions, dashboard |
| frontend | React + Vite + Nginx | 80 | Interface utilisateur |
| PostgreSQL | postgres:15-alpine | 5432 | Base de données persistante |

---

## Images Docker Hub

Les 3 images sont publiques sur Docker Hub sous le compte `ricaml` :

Pour linux
- `ricaml/auth-service:v3`
- `ricaml/event-service:v3`
- `ricaml/eventhub-frontend:v3`

Pour Mac
- `ricaml/auth-service:v2`
- `ricaml/event-service:v2`
- `ricaml/eventhub-frontend:v2`

https://hub.docker.com/u/ricaml

---

## Prérequis

- Docker Desktop installé et démarré
- Minikube installé
- kubectl installé

---

## Lancer le projet en local (Minikube)

### 1. Démarre Minikube

```bash
minikube start --memory=4096 --cpus=2
```

### 2. Active l'Ingress

```bash
minikube addons enable ingress
kubectl get pods -n ingress-nginx --watch
# Attends que ingress-nginx-controller soit Running
```

### 3. Déploie dans l'ordre

```bash
kubectl apply -f k8s/rbac.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/network-policy.yaml
kubectl apply -f k8s/postgres-deployment.yaml

# Attends que PostgreSQL soit prêt
kubectl wait --for=condition=ready pod -l app=postgres --timeout=120s

kubectl apply -f k8s/auth-deployment.yaml
kubectl apply -f k8s/event-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml
```

### 4. Vérifie que tout tourne

```bash
kubectl get pods
# Tous les pods doivent être en statut Running
```

### 5. Configure l'accès

```bash
# Ajoute eventhub.local dans /etc/hosts
echo "127.0.0.1 eventhub.local" | sudo tee -a /etc/hosts

# Lance le tunnel dans un terminal séparé
sudo minikube tunnel
```

### 6. Accède à l'application

Ouvre **https://eventhub.local** dans Chrome.

---

## Créer un utilisateur admin

```bash
# Génère un hash bcrypt
kubectl exec -it deployment/auth-service -- node -e \
  "const b=require('bcryptjs');b.hash('TonMotDePasse',10).then(h=>console.log(h))"

# Ouvre psql
kubectl exec -it deployment/postgres -- psql -U postgres -d eventhub

# Insère l'admin
INSERT INTO eventhub.users (username, first_name, last_name, email, password_hash, role, status)
VALUES ('admin', 'Admin', 'User', 'admin@eventhub.com', 'HASH_ICI', 'admin', 'active');
\q
```

---

## Test rapide avec Docker Compose (sans Kubernetes)

```bash
docker compose up --build
```

- auth-service disponible sur http://localhost:5001/api/docs
- event-service disponible sur http://localhost:5002/api/docs

---

## Sécurité implémentée

| Mécanisme | Détail |
|---|---|
| Secrets K8s | Credentials encodés base64, jamais en clair |
| RBAC | ServiceAccount `backend-sa` avec permissions minimales |
| NetworkPolicy | Seuls auth-service et event-service accèdent à PostgreSQL |
| Images non-root | Conteneurs tournent sous USER 1001 |
| HTTPS / TLS | Certificat TLS auto-signé, Ingress sur port 443 |

---

## Vérification de la sécurité

```bash
# Vérifie les permissions RBAC
kubectl auth can-i get secrets --as=system:serviceaccount:default:backend-sa
# → yes

kubectl auth can-i delete pods --as=system:serviceaccount:default:backend-sa
# → no

# Vérifie l'isolation réseau
kubectl describe networkpolicy postgres-isolation

# Vue globale sécurité
kubectl get roles,rolebindings,serviceaccounts,networkpolicies,secrets
```

---

## API Documentation (Swagger)

Accessible uniquement en local via Docker Compose :

- Auth API : http://localhost:5001/api/docs
- Events API : http://localhost:5002/api/docs

---

## Fonctionnalités

- Authentification JWT (login / signup / logout)
- Gestion des événements (création, modification, suppression) — admin uniquement
- Inscription aux événements — participants
- Dashboard administrateur avec statistiques
- Interface multilingue (français / anglais)
- Thème clair / sombre
- Documentation API Swagger

---

## Barème atteint

|  Réalisation |
|---|---|
| Dockerfile multi-stage, Docker Hub, Deployments + Services K8s |
| Ingress Gateway Nginx avec routage HTTP/HTTPS |
| 2 microservices Node.js indépendants reliés via K8s DNS |
| PostgreSQL avec PersistentVolume + PVC + init.sql automatique |
| Secrets + RBAC + NetworkPolicy + Images non-root + HTTPS/TLS |