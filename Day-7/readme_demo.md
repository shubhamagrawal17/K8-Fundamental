# Redis Guestbook Demo on Kubernetes

This guide demonstrates how to deploy a **stateful Redis backend** with a **stateless frontend** (Guestbook app) on Kubernetes using a combination of StatefulSets, headless services, and persistent volumes.

---

## 📁 File Structure

```bash
├── redis-headless-service.yaml
├── redis-statefulset.yaml
├── guestbook-frontend-service.yaml
└── guestbook-frontend-deployment.yaml
```

---

## 🧱 Step 1: Create Redis Headless Service

```bash
kubectl apply -f redis-headless-service.yaml
```

**Why?**
Creates a *headless* service (`clusterIP: None`) so each Redis pod has a stable DNS. Required by StatefulSets.

**Verify:**

```bash
kubectl get svc redis-headless
```

> You should see `CLUSTER-IP` as `<None>`.

---

## 🧠 Step 2: Deploy Redis StatefulSet

```bash
kubectl apply -f redis-statefulset.yaml
```

**Why?**

* Creates a **single Redis instance** with persistent storage.
* Uses `--appendonly yes` to persist data.
* Mounts a volume at `/data`.
* Uses `volumeClaimTemplates` to automatically provision storage per pod.

**Verify:**

```bash
kubectl get pods -w -l app=redis
kubectl get pvc -l app=redis
```

> You should see a pod `redis-0` and a PVC `redis-data-redis-0`.

---

## 🌐 Step 3: Create Guestbook Frontend Service

```bash
kubectl apply -f guestbook-frontend-service.yaml
```

**Why?**
Exposes the frontend on NodePort **30120** to access the app externally.

**Verify:**

```bash
kubectl get svc guestbook-frontend
```

---

## 🖥 Step 4: Deploy Guestbook Frontend (Stateless)

```bash
kubectl apply -f guestbook-frontend-deployment.yaml
```

**Why?**

* Deploys 2 frontend pods.
* Connects to Redis using the DNS: `redis-0.redis-headless`.

**Verify:**

```bash
kubectl get pods -w -l app=guestbook
```

---

## 🌍 Step 5: Access the Guestbook App

### If using Minikube:

```bash
minikube service guestbook-frontend --url
```

### On other clusters:

```bash
kubectl get nodes -o wide
```

Access in browser:

```
http://<NODE_IP>:30120
```

> Add a few entries to the guestbook.

---

## 💥 Step 6: Simulate Redis Failure (and Test Persistence)

```bash
kubectl delete pod redis-0
```

**Watch:**

```bash
kubectl get pods -w -l app=redis
```

> A new pod `redis-0` is created with the same name and volume.

Refresh the Guestbook — your messages should still be there!

✅ **Persistence verified** using StatefulSet + PVC.

---

## 📈 Step 7: Scale the Frontend

### Scale up:

```bash
kubectl scale deployment guestbook-frontend --replicas=5
```

### Verify:

```bash
kubectl get pods -l app=guestbook -w
```

### Scale down:

```bash
kubectl scale deployment guestbook-frontend --replicas=1
```

> Stateless frontend can be scaled freely.

---

## 🧹 Step 8: Cleanup

```bash
kubectl delete -f guestbook-frontend-deployment.yaml
kubectl delete -f guestbook-frontend-service.yaml
kubectl delete -f redis-statefulset.yaml
kubectl delete -f redis-headless-service.yaml
```

### ⚠️ PVC Warning

PVCs created by the StatefulSet are **not auto-deleted**. To delete Redis data:

```bash
kubectl delete pvc -l app=redis
```

> Be careful! This permanently deletes your Redis data.

---

## ✅ Summary

* **Headless service** gives Redis pods stable DNS.
* **StatefulSet** ensures persistent identity + storage.
* **PVCs** preserve Redis data across restarts.
* **Stateless frontend** connects to stable Redis backend.
* Easy to **scale frontend**; **persistent backend** ensures data integrity.

---
