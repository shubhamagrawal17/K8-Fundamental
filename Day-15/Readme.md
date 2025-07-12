# Kubernetes Node Affinity - Step-by-Step

## Step 1: Label a Node

Pick a node to add a custom label — e.g., disktype=ssd.

```bash
kubectl label nodes <your-node-name> disktype=ssd
```
Verify the label:
```bash
kubectl get nodes --show-labels
```
Look for: disktype=ssd under LABELS column.

## Step 2: Create the Pod YAML with Node Affinity

```python
apiVersion: v1
kind: Pod
metadata:
  name: affinity-demo
spec:
  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: disktype
            operator: In
            values:
              - ssd
  containers:
  - name: nginx
    image: nginx
```
Apply the Pod Configuration
```python
kubectl apply -f affinity-demo.yaml
```
 Check the pod status:
```python
kubectl get pods
```
Check where the pod is scheduled
```python
kubectl get pod affinity-demo -o wide
```
Look at the NODE column — it should show the node with the disktype=ssd label.
## Negative Test
Remove the label from all nodes:
```python
kubectl label node <your-node-name> disktype-
```
Delete and recreate the pod:
```python
kubectl delete pod affinity-demo
kubectl apply -f affinity-demo.yaml
```
The pod will remain in Pending state — because it can’t find any node matching disktype=ssd.