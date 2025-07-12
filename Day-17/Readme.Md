# Create YAML file

```bash
apiVersion: v1
kind: Pod
metadata:
  name: my-app
spec:
  containers:
  - name: busybox-container
    image: busybox:latest
    command: ["sh", "-c", "while true; do echo 'App is running...'; sleep 5; done"]
```

## Create a file inside the container

```python
kubectl exec my-app -- sh -c "echo 'This is my important data!' > /tmp/demo.txt"
```

## Verify the file exists inside the container
```python
kubectl exec my-app -- cat /tmp/demo.txt
```
## Simulate a Pod restart/recreation and verify the file
