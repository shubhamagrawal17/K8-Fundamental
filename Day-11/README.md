# For this demo, we're going to deploy a super simple Nginx application, and we'll use a ConfigMap to serve a custom index.html file.



## Steps

 First, let's define our ConfigMap. We'll create a file called my-configmap.yaml.

```bash
kubectl apply -f my-configmap.yaml
```

## We can verify our ConfigMap is there:

```python
kubectl get configmap nginx-custom-page -o yaml
```

## Now, let's create a deployment that uses this ConfigMap. We'll mount it as a volume into our Nginx container.
```python
kubectl apply -f nginx-deployment.yaml
```
 Now, let's expose our Nginx deployment with a Service so we can access it from outside the cluster.
```python
kubectl apply -f nginx-service.yaml
```
Let's say we want to update the message on our page. We don't need to rebuild our Nginx image. We just edit the ConfigMap.

Go back to the my-configmap.yaml file in the editor and Let's change the heading to something different and reapply it.
```python
kubectl apply -f my-configmap.yaml
```

When you update a ConfigMap, Pods using that ConfigMap via mounted volumes don't automatically see the changes immediately. They need to be restarted to pick up the new configuration.

The easiest way to trigger this is to perform a "rolling restart" of your deployment.
```python
kubectl rollout restart deployment/nginx-configmap-demo
```
- It creates new pods with the current configuration (including any updates to ConfigMaps or Secrets that are mounted as volumes and are not automatically reloaded by the application).

- Once the new pods are healthy and ready, it gradually terminates the old pods.

- This ensures that your application remains available throughout the restart process with minimal or no downtime.
