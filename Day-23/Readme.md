# StorageClasses Demo

1. Verify Existing StorageClasses:

```bash
kubectl get storageclass
```
You should see an output similar to this, with one marked as (default):
```bash
NAME                 PROVISIONER          RECLAIMPOLICY   VOLUMEBINDINGMODE   ALLOWVOLUMEEXPANSION   AGE
hostpath (default)   docker.io/hostpath   Delete          Immediate           false                  16m
```

Docker Desktop provides a default StorageClass named hostpath.

2. Create a Custom StorageClass

- We'll still use hostpath as the provisioner, but give it a custom name and a different reclaimPolicy.

- Create a file named my-storageclass.yaml
```bash
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: my-fast-storage
provisioner: docker.io/hostpath # Using the built-in hostpath provisioner for Docker Desktop
reclaimPolicy: Retain 
volumeBindingMode: Immediate
parameters:
  type: fast # A dummy parameter
```
Verify the new StorageClass: You'll now see two StorageClasses.

```python
PS D:\Demo> kubectl get storageclass
NAME                 PROVISIONER          RECLAIMPOLICY   VOLUMEBINDINGMODE   ALLOWVOLUMEEXPANSION   AGE
hostpath (default)   docker.io/hostpath   Delete          Immediate           false                  16m
my-fast-storage      docker.io/hostpath   Retain          Immediate           false                  11m
```

3. Create a PersistentVolumeClaim (PVC) using our Custom StorageClass.
- Now, let's request storage using our new StorageClass.
```python
# nginx-pvc.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: nginx-data-pvc
spec:
  accessModes:
    - ReadWriteOnce # This volume can be mounted as read-write by a single node
  storageClassName: my-fast-storage # Referencing our custom StorageClass
  resources:
    requests:
      storage: 1Gi # Requesting 1 Gigabyte of storage
```
- Apply the PVC and Verify PVC and PV status You should see your nginx-data-pvc in "Bound" status, and a dynamically created PersistentVolume (PV) also in "Bound" status, linked to your my-fast-storage StorageClass.

```python
PS D:\Demo> kubectl get pvc -o wide
NAME             STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS      VOLUMEATTRIBUTESCLASS   AGE   VOLUMEMODE
nginx-data-pvc   Bound    pvc-8261f3c2-82c1-4ea5-9c0b-d7d1916ffe93   1Gi        RWO            my-fast-storage   <unset>                 22m   Filesystem
```
```python
PS D:\Demo> kubectl get pv
NAME                                       CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                    STORAGECLASS      VOLUMEATTRIBUTESCLASS   
REASON   AGE
pvc-8261f3c2-82c1-4ea5-9c0b-d7d1916ffe93   1Gi        RWO            Retain           Bound    default/nginx-data-pvc   my-fast-storage   <unset>
```
4. Deploy an Application (Nginx) that uses the PVC
```python
# nginx-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-web
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:latest
          ports:
            - containerPort: 80
          volumeMounts:
            - name: nginx-persistent-storage
              mountPath: /usr/share/nginx/html # Nginx serves content from here
      volumes:
        - name: nginx-persistent-storage
          persistentVolumeClaim:
            claimName: nginx-data-pvc # Referencing our PVC
```
5. Write Data to the Persistent Volume
```python
kubectl exec -it $POD_NAME -- sh -c "echo 'Hello from Persistent Storage!' > /usr/share/nginx/html/index.html"
```
6. Expose Nginx with a Service
```python
# nginx-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx
  type: LoadBalancer
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
```
7. Demonstrate Persistence (Delete Pod, Verify Data)

8. Demonstrate Retain Reclaim Policy (Delete PVC, Verify PV remains):
