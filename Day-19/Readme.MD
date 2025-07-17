# For a HostPath volume, the crucial point is that the path must exist on the specific node where your Pod is scheduled. By default, Kubernetes will schedule pods wherever it finds resources.


## Step 1: Identify Your Worker Node Name

```bash
kubectl get nodes
NAME                    STATUS   ROLES           AGE   VERSION
desktop-control-plane   Ready    control-plane   12m   v1.32.5
desktop-worker          Ready    <none>          12m   v1.32.5
```

## Step 2: Create the Directory for HostPath on the Worker Node VM
- We need to create the directory on the desktop-worker node

```python
kubectl debug node/desktop-worker -it --image=busybox
```
Wait for the debug pod to start and for you to get a shell prompt like / #.
- Inside the debug shell (/ # prompt):
- Change directory to the host's root: cd /host
- Create the desired directory for your HostPath volume:
## What it actually does:
- It schedules a temporary pod on the specified node (desktop-worker).
- That pod runs the busybox image so you can interact with it like a shell.
- You can then run commands like ls, top, ps, df, etc., to inspect the node's environment, filesystem, and processes.
- It's very useful when you don’t have direct SSH access to nodes but still need to inspect or troubleshoot issues.

```python
mkdir -p /mnt/hostpath-demo
```
Verify the directory was created:
```python
ls -l /mnt
ls -l /mnt/hostpath-demo
```
- Exit the debug shell:
## Step 3: Create the Kubernetes Pod YAML (hostpath-pod.yaml) with Node Affinity
- We'll add a nodeSelector to ensure our Pod runs on the desktop-worker node.
- Create a new file named hostpath-pod.yaml with the following content:
```python
apiVersion: v1
kind: Pod
metadata:
  name: hostpath-demo-pod
spec:
  containers:
  - name: demo-container
    image: busybox:latest
    command: ["/bin/sh", "-c", "while true; do echo $(date) >> /mnt/data/log.txt; sleep 5; done"]
    volumeMounts:
    - name: hostpath-volume
      mountPath: /mnt/data
  volumes:
  - name: hostpath-volume
    hostPath:
      path: /mnt/hostpath-demo
      type: DirectoryOrCreate
  nodeSelector: #  Add this section to target the worker node
    kubernetes.io/hostname: desktop-worker # Match the worker node's hostname
#nodeSelector: This is key. It tells Kubernetes to schedule this Pod only on a node where the label kubernetes.io/hostname has the value desktop-worker.
```
## Step 4: Deploy the Kubernetes Pod
```python
kubectl apply -f hostpath-pod.yaml
kubectl get pods -o wide
```
## Step 5: Verify Data Persistence
- Access the worker node VM again using kubectl debug to inspect the host file:
```python
kubectl debug node/desktop-worker -it --image=busybox
#
```
- Inside the debug shell (/ # prompt):
- Change directory to where your HostPath is located on the host:
```python
cd /host/mnt/hostpath-demo
#List the contents:
ls -l
#View the content of the file:
cat log.txt
#Exit the debug shell
```
## Step 6: Clean Up delete the POD and again verify the file
