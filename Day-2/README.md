Here's your content converted into a properly formatted `README.md` file suitable for GitHub:

---

````markdown
# 🎯 Demonstrating Selectors with `kubectl get`

This guide demonstrates how to use `kubectl get` with label **selectors** to filter and retrieve specific Kubernetes Pods based on their labels.

---

## 📋 Prerequisites

- A running Kubernetes cluster (e.g., Docker Desktop).
- `kubectl` CLI configured to access the cluster.
- The following Pods already deployed:

| Pod Name            | Labels                                                                 |
|---------------------|------------------------------------------------------------------------|
| `nginx-v1-dev-pod`  | `app=nginx`, `environment=dev`, `version=1.0`, `tier=frontend`         |
| `nginx-v2-prod-pod` | `app=nginx`, `environment=prod`, `version=2.0`, `tier=frontend`        |
| `db-pod`            | `app=database`, `environment=dev`, `type=postgres`                     |

---

## 🔍 Step 1: View All Pods and Their Labels

```bash
kubectl get pods --show-labels
````

**Expected Output:**

```
NAME                READY   STATUS    RESTARTS   AGE   LABELS
db-pod              1/1     Running   0          5m    app=database,environment=dev,type=postgres
nginx-v1-dev-pod    1/1     Running   0          5m    app=nginx,environment=dev,tier=frontend,version=1.0
nginx-v2-prod-pod   1/1     Running   0          5m    app=nginx,environment=prod,tier=frontend,version=2.0
```

---

## ✅ Step 2: Basic Equality Selector (`-l key=value`)

### a. Find all Nginx Pods:

```bash
kubectl get pods -l app=nginx
```

**Expected Output:**

```
NAME                READY   STATUS    RESTARTS   AGE   LABELS
nginx-v1-dev-pod    1/1     Running   0          6m    ...
nginx-v2-prod-pod   1/1     Running   0          6m    ...
```

### b. Find all Development Environment Pods:

```bash
kubectl get pods -l environment=dev
```

**Expected Output:**

```
NAME               READY   STATUS    RESTARTS   AGE   LABELS
db-pod             1/1     Running   0          7m    ...
nginx-v1-dev-pod   1/1     Running   0          7m    ...
```

---

## 🧩 Step 3: Multiple Equality Selectors (AND Logic)

### Find Nginx Pods in the Production Environment:

```bash
kubectl get pods -l app=nginx,environment=prod
```

**Expected Output:**

```
NAME                READY   STATUS    RESTARTS   AGE   LABELS
nginx-v2-prod-pod   1/1     Running   0          7m    ...
```

---

## 🔎 Step 4: Label Existence Selector (`-l key`)

```bash
kubectl get pods -l tier
```

**Expected Output:**

```
NAME                READY   STATUS    RESTARTS   AGE   LABELS
nginx-v1-dev-pod    1/1     Running   0          8m    ...
nginx-v2-prod-pod   1/1     Running   0          8m    ...
```

---

## 🚫 Step 5: Label Non-Existence Selector (`-l !key`)

```bash
kubectl get pods -l '!tier'
```

**Expected Output:**

```
NAME     READY   STATUS    RESTARTS   AGE   LABELS
db-pod   1/1     Running   0          9m    ...
```

---

## 🧠 Step 6: Set-Based Selectors

### a. Select Pods where `environment` is either `dev` or `prod`:

```bash
kubectl get pods -l 'environment in (dev,prod)'
```

**Expected Output:**

```
NAME                READY   STATUS    RESTARTS   AGE   LABELS
db-pod              1/1     Running   0          10m   ...
nginx-v1-dev-pod    1/1     Running   0          10m   ...
nginx-v2-prod-pod   1/1     Running   0          10m   ...
```

### b. Select Pods where `version` is NOT `1.0`:

```bash
kubectl get pods -l 'version notin (1.0)'
```

**Expected Output:**

```
NAME                READY   STATUS    RESTARTS   AGE   LABELS
db-pod              1/1     Running   0          11m   ...
nginx-v2-prod-pod   1/1     Running   0          11m   ...
```

---

## 🧹 Cleanup

To delete the Pods used for this demo:

```bash
kubectl delete pod nginx-v1-dev-pod nginx-v2-prod-pod db-pod
```

---

## 📘 Summary

This guide covered:

* Equality selectors (`key=value`)
* Multiple selectors with AND logic
* Existence and non-existence of labels
* Set-based label filtering using `in`, `notin`

Selectors are powerful tools for targeting specific Kubernetes resources in real-time, making management and automation much easier.

---
