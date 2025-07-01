# 🚀 Kubernetes Namespaces Demo (Step-by-Step)

This guide walks you through a simple, beginner-friendly demo of working with **Kubernetes Namespaces**. You'll learn how to create a Namespace, deploy a Pod inside it, and manage resources across Namespaces.

---

## 📋 Prerequisites

- A running Kubernetes cluster (Minikube, Docker Desktop, EKS, AKS, etc.)
- `kubectl` CLI installed and configured

---

## 🧪 Step-by-Step Instructions

### ✅ Step 1: Check Existing Namespaces

To view all the existing Namespaces in your cluster:

```bash
kubectl get namespaces
✅ Step 2: Create a New Namespace
Create a Namespace named development:

bash
Copy
Edit
kubectl create namespace development
You should see:

arduino
Copy
Edit
namespace/development created
✅ Step 3: Deploy a Pod into a Specific Namespace
Apply this configuration:

bash
Copy
Edit
kubectl apply -f pod-nginx-dev.yaml
✅ Step 4: Verify Pods in Different Namespaces
If you run:

bash
Copy
Edit
kubectl get pods
You won’t see nginx-dev-pod because kubectl get pods shows only the default Namespace by default.

To see the Pod in the development Namespace, use:

bash
Copy
Edit
kubectl get pods -n development
or

bash
Copy
Edit
kubectl get pods --namespace=development
Expected output:

sql
Copy
Edit
NAME             READY   STATUS    RESTARTS   AGE
nginx-dev-pod    1/1     Running   0          1m
✅ Step 5: Delete the Namespace
To clean up and remove the Namespace along with all its resources:

bash
Copy
Edit
kubectl delete namespace development
Output:

cpp
Copy
Edit
namespace "development" deleted
