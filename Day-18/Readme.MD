# emptydir Volume Demo

## Create the emptydir-pod.yaml and apply it.
```bash
apiVersion: v1
kind: Pod
metadata:
  name: my-emptydir-app
spec:
  containers:
    - name: busybox-container
      image: busybox:latest
      command:
        ["sh", "-c", "while true; do echo 'App is running...'; sleep 5; done"]
      # Define how the volume will be used inside this container
      volumeMounts:
        - name: my-temp-storage # This must match the 'name' of a volume defined below
          mountPath: /data/temp # The path *inside the container* where the volume content will appear

  # Define the volumes for this Pod
  volumes:
    - name: my-temp-storage # A unique name for this volume within the Pod
      emptyDir:
        {} # This specifies that it is an emptyDir type volume.
        # It starts empty and gets created when the Pod is scheduled.
        # Its content is deleted when the Pod is deleted.

```

## Get an interactive shell into your container

```python
kubectl exec -it my-emptydir-app -- sh
# -it: Stands for -i (interactive) and -t (pseudo-TTY), which gives you a proper interactive terminal.
# sh: The shell you want to open inside the container.
```

## Navigate to the mounted volume path
```python
cd /data/temp/
```
Now, manually create your file using a text editor or echo
 - Using echo
```python
echo "This data lives on emptyDir! (Manually created)" > demo.txt
```
- Using vi
```python
vi demo.txt
```
Verify the file from within the container
```python
cat my_emptydir_file.txt
ls -l
```
Now delete the Pod, recreate it, and check if the file we created still exists.