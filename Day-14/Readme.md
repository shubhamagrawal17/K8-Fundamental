# Demo of Taints and Tolerations with NoSchedule Effect



## 1. Identify Your Node

```bash
kubectl get nodes
```
Note the name of your single node (e.g., docker-desktop).

## 2. Apply a Taint to Your Node

```python
kubectl taint nodes docker-desktop env=prod:NoSchedule
```
This taint means: "Don't schedule any pod unless it tolerates this taint.
```python
kubectl describe node docker-desktop | grep Taint
```

## 3. Try Deploying a Pod Without Toleration (It Will Fail)
```python
# pod-without-toleration.yaml
apiVersion: v1
kind: Pod
metadata:
  name: no-toleration-pod
spec:
  containers:
  - name: nginx
    image: nginx
```
Apply it:
```python
kubectl apply -f pod-without-toleration.yaml
kubectl get pods
```
Check pod status — it should remain in Pending.

##  4. Now Deploy a Pod With Matching Toleration (It Will Work)
```python
# pod-with-toleration.yaml
apiVersion: v1
kind: Pod
metadata:
  name: toleration-pod
spec:
  containers:
  - name: nginx
    image: nginx
  tolerations:
  - key: "env"
    operator: "Equal"
    value: "prod"
    effect: "NoSchedule"
```
Apply it:
```python
kubectl apply -f pod-with-toleration.yaml
kubectl get pods
```
############################################################################################

# Demo of Taints and Tolerations with NoExecute Effect

## 1. Create a Pod Without Toleration
## 2. Apply a NoExecute Taint to the Node
```python
kubectl taint nodes docker-desktop gpu=true:NoExecute
```
Now, watch:
```python
kubectl get pods -w
```
Within a few seconds, the pod will be terminated (evicted).

Now Try With Toleration
```python
# pod-noexecute-toleration.yaml
apiVersion: v1
kind: Pod
metadata:
  name: toleration-pod
spec:
  containers:
  - name: nginx
    image: nginx
  tolerations:
  - key: "key"
    operator: "Equal"
    value: "value"
    effect: "NoExecute"
    tolerationSeconds: 60 # This pod will not be evicted immediately, but after 60 seconds.
                          #If you don’t use tolerationSeconds, the pod will never be evicted:
```

 Behavior:
If the pod is already running:

 - With matching toleration + no tolerationSeconds → ✅ Pod stays

 - With matching toleration + tolerationSeconds: X → 🕒 Pod stays for X seconds, then evicted

 - Without toleration → ❌ Pod evicted immediately

If the pod is newly scheduled:

 - With matching toleration → ✅ Allowed to schedule

 - Without toleration → ❌ Not scheduled

                         