Here’s a **simplified and cleaner version** of your `README.md` — ideal for a beginner-friendly GitHub repository. It keeps the core instructions intact but reduces wordiness and complexity:

---

````markdown
# Kubernetes DaemonSet Demo (Docker Desktop)

This repo contains a simple demo showing how to use a **DaemonSet** in Kubernetes with Docker Desktop.

## 🔍 What’s a DaemonSet?

A **DaemonSet** ensures that a specific Pod runs on **every node** (or selected nodes) in your Kubernetes cluster. It’s great for tools like:

- Log collectors (e.g., Fluentd, Filebeat)
- Monitoring agents (e.g., Prometheus Node Exporter)
- Network plugins (e.g., Calico)
- Security or storage daemons

In this demo, we use a lightweight `busybox` container that logs the node’s hostname — showing the Pod is truly running on your node.

---

## ✅ Prerequisites

Make sure you have the following installed:

1. [Docker Desktop](https://www.docker.com/products/docker-desktop)
2. Kubernetes enabled in Docker Desktop (Settings → Kubernetes → Enable)
3. `kubectl` configured (usually done automatically)

Check `kubectl`:
```bash
kubectl version --client
````

---

## 🚀 How to Run the Demo

### 1. Check if Kubernetes is running

```bash
kubectl get nodes
```

You should see:

```
NAME             STATUS   ROLES           AGE   VERSION
docker-desktop   Ready    control-plane   ...   ...
```

---

### 2. Apply the DaemonSet

Make sure you have the `node-info-daemonset.yaml` file in this directory, then run:

```bash
kubectl apply -f node-info-daemonset.yaml
```

Expected:

```
daemonset.apps/node-info-collector created
```

---

### 3. Check if the Pod is Running

```bash
kubectl get pods -l app=node-info-collector -o wide
```

You should see a Pod running on your node (`docker-desktop`).

---

### 4. View Pod Logs

Replace `<POD_NAME>` with the actual pod name:

```bash
kubectl logs <POD_NAME>
```

You should see messages like:

```
Hello from node: docker-desktop at Fri Jul  4 12:01:21 UTC 2025
```

---

## 🧠 Note on Single-Node Clusters

Docker Desktop runs a **single-node Kubernetes cluster**, so you’ll only see **one Pod**. But this still shows the key concept: **one Pod per node**.

In a real multi-node cluster, Kubernetes would run one Pod per node automatically.

---

### 🧹 Clean Up

To delete the DaemonSet and its Pod:

```bash
kubectl delete -f node-info-daemonset.yaml
```

---

## 📂 Files in This Repo

* `node-info-daemonset.yaml` – The DaemonSet manifest file

```
```
