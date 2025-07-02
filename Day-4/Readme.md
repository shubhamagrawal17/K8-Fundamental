Here's your content professionally formatted as a `README.md` file for a GitHub repo — with clear structure, code blocks, and section highlights:



````markdown
# 🚀 Kubernetes ReplicaSet & Deployment Demo

This guide walks you through hands-on examples of using **ReplicaSets** and **Deployments** in Kubernetes — including self-healing, rolling updates, and rollbacks.

---

## 🧱 Part 1: ReplicaSet Demo

### 1️⃣ Apply the ReplicaSet

```bash
kubectl apply -f replicaset-nginx.yaml
````

---

### 2️⃣ View Pods and the ReplicaSet

```bash
kubectl get pods
kubectl get rs
```

---

### 3️⃣ Test Self-Healing: Delete a Pod

```bash
kubectl delete pod <pod-name>
```

> ⚙️ The ReplicaSet will automatically create a new Pod to maintain the desired state.

---

### 4️⃣ Clean Up the ReplicaSet

```bash
kubectl delete -f replicaset-nginx.yaml
```

---

## 🚀 Part 2: Deployment Demo

### 1️⃣ Apply the Deployment

```bash
kubectl apply -f deployment-nginx.yaml
```

---

### 2️⃣ View the Created Resources

```bash
kubectl get pods
kubectl get rs
kubectl get deploy
```

---

### 3️⃣ Perform a Rolling Update

1. Modify `deployment-nginx.yaml` and change the image version:

   ```yaml
   image: nginx:1.16.1
   ```
2. Apply the updated Deployment:

   ```bash
   kubectl apply -f deployment-nginx.yaml
   ```
3. Watch the update process live:

   ```bash
   kubectl get pods -w
   ```

✅ You’ll see:

* New Pods being created with updated image
* Old Pods terminating gracefully

> This is called a **Rolling Update**, ensuring **zero downtime**!

4. Check the Deployment rollout history:

```bash
kubectl rollout history deployment nginx-deployment
```

---

### 4️⃣ Rollback to the Previous Version

```bash
kubectl rollout undo deployment nginx-deployment
```

---

### 5️⃣ Clean Up the Deployment

```bash
kubectl delete -f deployment-nginx.yaml
```

---

## 📝 Note

> In real-world or production Kubernetes environments, you **rarely create a standalone ReplicaSet** directly.
> Instead, you define a **Deployment**, which manages ReplicaSets and provides versioning, rolling updates, and rollback capabilities.

---

📘 **Happy Learning Kubernetes!**

```
