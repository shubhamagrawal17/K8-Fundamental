---


# 🚦 Kubernetes Liveness & Readiness Probes (Day 5)

This guide covers how to use **Liveness** and **Readiness Probes** in Kubernetes to monitor and manage the health of your applications — with hands-on demos using simple NGINX deployments.

---

## 🧰 Prerequisites

- A running Kubernetes cluster (e.g., Minikube)
- `kubectl` CLI configured
- Optional: Clean up existing resources  
  ```bash
  kubectl delete all --all
````

---

## 🧪 Part 1: Basic NGINX Deployment (No Probes)

1. Create a basic Deployment for NGINX with no probes.
2. Apply it using:

   ```bash
   kubectl apply -f deployment-nginx-noprobe.yaml
   kubectl get pods
   ```
3. The Pod will show as `Running` and `1/1 Ready`, but there’s no way to verify the actual application health.

---

## 💥 Part 2: Liveness Probe Demo

1. Modify the Deployment to include a **Liveness Probe** that points to a non-existing path (`/nonexistent-health-check`).
2. Apply the file:

   ```bash
   kubectl apply -f deployment-nginx-liveness.yaml
   ```
3. Watch the Pod status:

   ```bash
   watch kubectl get pods
   ```
4. The Pod will restart repeatedly — this is Kubernetes detecting a failed health check and auto-restarting the container.
5. View events for details:

   ```bash
   kubectl describe pod <pod-name>
   ```

### ✅ Fix the Probe

1. Update the Liveness Probe to a valid path (`/`).
2. Reapply the Deployment:

   ```bash
   kubectl apply -f deployment-nginx-liveness.yaml
   watch kubectl get pods
   ```
3. The Pod will stabilize, and restarts will stop.

---

## 🚦 Part 3: Readiness Probe Demo

1. Delete the Liveness Deployment:

   ```bash
   kubectl delete -f deployment-nginx-liveness.yaml
   ```
2. Create a new Deployment with a **Readiness Probe** and delayed startup (e.g., initial delay of 15s).
3. Apply it:

   ```bash
   kubectl apply -f deployment-nginx-readiness.yaml
   watch kubectl get pods
   ```
4. Observe: Pod status will be `Running` but `0/1 Ready` initially, and change to `1/1` once the probe succeeds.
5. Check service routing:

   ```bash
   kubectl get endpoints nginx-readiness-service
   ```

---

## ✅ Best Practices

* **Use both probes**:

  * *Liveness* → restart broken containers
  * *Readiness* → control traffic flow to healthy Pods

* **Don’t duplicate logic**:
  Use separate endpoints for liveness and readiness if possible.

* **Keep probes light**:
  Avoid expensive checks like DB queries.

* **Tune parameters**:

  * `initialDelaySeconds`
  * `periodSeconds`
  * `failureThreshold`
  * `timeoutSeconds`

---

## 🧹 Cleanup

```bash
kubectl delete -f deployment-nginx-noprobe.yaml
kubectl delete -f deployment-nginx-liveness.yaml
kubectl delete -f deployment-nginx-readiness.yaml
```

---

## 🎯 Summary

| Probe     | Purpose                       | Action on Failure           |
| --------- | ----------------------------- | --------------------------- |
| Liveness  | Is the app alive?             | Kubernetes restarts the Pod |
| Readiness | Is the app ready for traffic? | Pod removed from Service    |

---
