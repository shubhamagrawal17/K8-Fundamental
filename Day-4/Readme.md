Here is your **fully formatted and cleaned `README.md`** file, ideal for a GitHub repo with clear structure, markdown best practices, and consistent formatting:

---

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

* New Pods being created with the updated image
* Old Pods terminating gracefully

> This is called a **Rolling Update**, which ensures **zero downtime** for your application.

---

### 🔍 4️⃣ Check the Deployment Rollout History

To view the revision history of your Deployment:

```bash
kubectl rollout history deployment nginx-deployment
```

📌 You might notice the `CHANGE-CAUSE` column says `<none>`.
This is because Kubernetes doesn't automatically track why a change was made.

---

### 🛠 How to Record Change History

To make your rollout history more meaningful, use the `--record` flag when applying changes.

1. Make a small change in `deployment-nginx.yaml` (e.g., update the image to `nginx:1.18.0`).

2. Add the kubernetes.io/change-cause annotation under metadata.annotations in your Deployment's YAML.

   ```bash
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: nginx-deployment
     annotations: # <<< Add this section
       kubernetes.io/change-cause: # Apply the change
   ```

3. Check the updated rollout history again:

   ```bash
   kubectl rollout history deployment nginx-deployment
   ```

---

### ⏪ 5️⃣ Rollback to the Previous Version

If something goes wrong with the new version, you can roll back easily:

```bash
kubectl rollout undo deployment nginx-deployment
```

> 🧠 This command reverts the Deployment to the previous stable revision.

---

### 🧹 6️⃣ Clean Up the Deployment

```bash
kubectl delete -f deployment-nginx.yaml
```

---

## 📝 Note

> In real-world or production Kubernetes environments, you **rarely create a standalone ReplicaSet** directly.
> Instead, you define a **Deployment**, which manages ReplicaSets and provides versioning, rolling updates, and rollback capabilities automatically.

---

📘 **Happy Learning Kubernetes!**

```
