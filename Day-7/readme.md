# 📝 Guestbook with Redis – StatefulSet Kubernetes Demo

This demo showcases how to use a **StatefulSet** for a Redis backend and a **Deployment** for a stateless Guestbook frontend in Kubernetes.

---

## 📦 What’s Included

| File                             | Purpose                                 |
|----------------------------------|------------------------------------------|
| `redis-headless-service.yaml`   | Gives Redis pods stable DNS names        |
| `redis-statefulset.yaml`        | Deploys Redis with persistent storage    |
| `guestbook-frontend-service.yaml` | Exposes Guestbook frontend via NodePort |
| `guestbook-frontend-deployment.yaml` | Deploys scalable, stateless frontend  |

---

## 🧠 Why You Need All 4 Files

### 1. `redis-headless-service.yaml` – Stable Redis Pod Identity
- **Type**: Headless Service (`clusterIP: None`)
- **Purpose**: Allows other pods to access Redis directly via DNS (e.g., `redis-0.redis-headless`)
- **Why**: StatefulSets **require** headless services to provide **stable network identity**.

---

### 2. `redis-statefulset.yaml` – Persistent Redis Deployment
- **Type**: StatefulSet
- **Purpose**: Ensures Redis pod:
  - Has a **stable name** (`redis-0`)
  - Gets a **PersistentVolumeClaim** for data storage
- **Why**: Unlike stateless apps, Redis needs its data to **survive restarts**.

---

### 3. `guestbook-frontend-service.yaml` – Expose the Frontend
- **Type**: NodePort Service
- **Purpose**: Makes the frontend UI accessible outside the cluster on a fixed port (`30120`)
- **Bonus**: Provides **load balancing** if frontend has multiple replicas.

---

### 4. `guestbook-frontend-deployment.yaml` – Stateless Frontend UI
- **Type**: Deployment
- **Purpose**: Runs and manages 2+ instances of the Guestbook app
- **Env Vars**:
  - `REDIS_HOST=redis-0.redis-headless` — connects to Redis backend
- **Why**: Stateless apps can be **scaled** and **replaced** easily.

---

## ✅ Summary

| Component        | Purpose                                | Type           |
|------------------|----------------------------------------|----------------|
| Redis Service     | Stable identity for Redis pods          | Headless Service |
| Redis Database    | Persistent, stateful backend             | StatefulSet    |
| Guestbook Service | External access to UI                   | NodePort Service |
| Guestbook Frontend| Stateless, scalable UI connecting to Redis | Deployment     |

---

## 🚀 How It Works Together

1. Redis runs as a **StatefulSet** with a **persistent volume**.
2. Each Redis pod has a stable name like `redis-0.redis-headless`.
3. Guestbook frontend (Deployment) connects to Redis via this stable DNS.
4. Guestbook UI is exposed using a **NodePort Service**.
5. You can scale frontend up/down **without breaking Redis**.
6. Redis data persists even if the pod restarts.

---

## 🧹 Cleanup

To delete all resources:

```bash
kubectl delete -f guestbook-frontend-deployment.yaml
kubectl delete -f guestbook-frontend-service.yaml
kubectl delete -f redis-statefulset.yaml
kubectl delete -f redis-headless-service.yaml

