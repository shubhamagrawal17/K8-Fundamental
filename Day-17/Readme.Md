# Goal: Show that a pod in one namespace can reach a service in another namespace using its Fully Qualified Domain Name (FQDN).

Components:

- service-producer namespace: Will contain a simple Nginx web server and its service.

- service-consumer namespace: Will contain a busybox pod that attempts to curl the Nginx service in the service-producer namespace.

## Simple Cross-Namespace Demo: Nginx & Busybox

## 1. Create Namespaces
 - First, create the two namespaces:

```bash
# 01-namespaces.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: service-producer
---
apiVersion: v1
kind: Namespace
metadata:
  name: service-consumer
```

## 2. Deploy Nginx (Service Producer)
 - We'll deploy an Nginx web server in the service-producer namespace and expose it via a ClusterIP Service.
```python
# 02-nginx-producer.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-producer-app
  namespace: service-producer
  labels:
    app: nginx-producer
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx-producer
  template:
    metadata:
      labels:
        app: nginx-producer
    spec:
      containers:
      - name: nginx-container
        image: nginx:latest
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: nginx-producer-service
  namespace: service-producer
spec:
  selector:
    app: nginx-producer
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
  type: ClusterIP
```

## 3. Deploy Busybox (Service Consumer)
This pod will be our "frontend" that attempts to reach the Nginx service. 

# 03-busybox-consumer.yaml
```python
apiVersion: v1
kind: Pod
metadata:
  name: busybox-consumer-pod
  namespace: service-consumer
spec:
  containers:
  - name: busybox-container
    image: busybox:latest
    command: ["sh", "-c", "echo 'Waiting for commands...' && sleep 3600"] # Keep container running
    # No port needed for this demo, just for outbound connections
  restartPolicy: Always
```
## 4. Verify Communication

- Get the name of your busybox pod
```python
kubectl get pod -n service-consumer
```

Exec into the busybox pod:
```python
kubectl exec -it busybox-consumer-pod -n service-consumer -- sh
```
 - From inside the busybox pod, try to wget the Nginx service using its FQDN:
 - The FQDN format for a Kubernetes service is:
<service-name>.<namespace-name>.svc.cluster.local
 - In our case, the service name is nginx-producer-service and the namespace is service-producer. So, the FQDN is:
nginx-producer-service.service-producer.svc.cluster.local
- Run this command in the busybox pod's shell:
```python
wget -O - http://nginx-producer-service.service-producer.svc.cluster.local/
```
Expected Output:
You should see the HTML content of the Nginx welcome page
---