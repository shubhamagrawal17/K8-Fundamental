Here is your content formatted exactly like your example — clean, emoji-enhanced, and ready to be used as a `README.md` for your GitHub or documentation:

---

````markdown
# 🎯 Working with Kubernetes Namespaces (Hands-on Demo)

This guide walks you through how to create, use, and manage **Kubernetes Namespaces** using simple `kubectl` commands — perfect for beginners.

---

## 📋 Prerequisites

- A running Kubernetes cluster (e.g., Docker Desktop, Minikube, AKS, EKS, etc.)
- `kubectl` CLI configured and connected to your cluster
- Basic understanding of YAML files

---

## 🔍 Step 1: Check Existing Namespaces

```bash
kubectl get namespaces
````

This command lists all the Namespaces currently available in your cluster.



## 🏗️ Step 2: Create a New Namespace

```bash
kubectl create namespace development
```

This creates a new Namespace named `development`.

---

## 🚀 Step 3: Deploy a Pod into the `development` Namespace

First, create a file named `pod-nginx-dev.yaml` with the following content:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-dev-pod
  namespace: development
  labels:
    app: nginx
spec:
  containers:
    - name: nginx
      image: nginx
      ports:
        - containerPort: 80
```

Then apply the YAML file:

```bash
kubectl apply -f pod-nginx-dev.yaml
```

This deploys the `nginx-dev-pod` into the `development` Namespace.

---

## 🔎 Step 4: Verify Pods in Different Namespaces

### a. Check Pods in Default Namespace

```bash
kubectl get pods
```

🔸 You won’t see the `nginx-dev-pod` here, because it’s not in the `default` Namespace.

### b. Check Pods in the `development` Namespace

```bash
kubectl get pods -n development
# OR
kubectl get pods --namespace=development
```

Expected Output:

```
NAME             READY   STATUS    RESTARTS   AGE
nginx-dev-pod    1/1     Running   0          1m
```

---

## 🧹 Step 5: Delete the Namespace (Cleanup)

```bash
kubectl delete namespace development
```

This deletes the entire `development` Namespace along with the pod and any other resources inside it.

---

## 📘 Summary

| Step | Description                        |
| ---- | ---------------------------------- |
| ✅ 1  | View existing Namespaces           |
| ✅ 2  | Create a new Namespace             |
| ✅ 3  | Deploy a Pod in the new Namespace  |
| ✅ 4  | Verify Pods using `-n` flag        |
| ✅ 5  | Clean up by deleting the Namespace |

---

Namespaces help you:

* Organize your resources
* Isolate different environments (dev, test, prod)
* Apply resource limits (quotas)
* Manage user access (RBAC)

---

Happy Learning! 🎓🚀

```

Let me know if you'd like a downloadable `.md` file or a sample YAML manifest included in your repo.
```
