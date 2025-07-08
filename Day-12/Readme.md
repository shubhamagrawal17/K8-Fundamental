# For this demo, we're going to create a simple Nginx application that uses a "secret" username and password. We'll simulate our application needing these credentials.



## Step 1: Encoding Data

 Let’s encode a sample username and password:

```bash
echo -n 'myuser' | base64
# Output: bXl1c2Vy

echo -n 'supersecretpass' | base64
# Output: c3VwZXJzZWNyZXRwYXNz

```

## Step 2: Create a Secret YAML file

## Step 3: Apply the Secret
```bash
kubectl apply -f my-secret.yaml
# Output: secret/my-app-credentials created
```
## Step 4: Check the Secret
```bash
kubectl get secret my-app-credentials
```
You’ll see that Kubernetes shows the number of items, but not the actual values — that’s for security.

To view full details
```bash
kubectl get secret my-app-credentials -o yaml
```
To decode manually:
```bash
echo 'bXl1c2Vy' | base64 --decode
```
## Step 5: Use the Secret in a Deployment

Now create a deployment that uses the Secret in two ways — as environment variables and as mounted files.

## Step 6: Apply the Deployment
```bash
kubectl apply -f nginx-secret-demo.yaml
# Output: deployment.apps/nginx-secret-demo created
```
## Step 7: Inspect Environment Variables in the Pod
```bash
kubectl exec -it <pod-name> -- /bin/bash

Output:
MY_APP_USERNAME=myuser  
MY_APP_PASSWORD=supersecretpass

```
Inspect Mounted Secret Files:
From the same shell inside the container:
```bash
ls /etc/app-secrets
You should see two files: username and password.
Read their contents:
cat /etc/app-secrets/username
cat /etc/app-secrets/password

# Output: password  username

kubectl exec $(kubectl get pod -l app=nginx-secret-demo -o jsonpath='{.items[0].metadata.name}') -- cat /etc/app-secrets/username
# Output: myuser

```
