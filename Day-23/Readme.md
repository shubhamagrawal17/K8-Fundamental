Here’s a clean and professional **README.md** you can use for your content:

````markdown
# Kubernetes User Certificate & RBAC Setup

This guide walks through the process of creating a new Kubernetes user (`shubham`) using **Certificates and RBAC**. It covers generating keys, submitting and approving a CSR, creating a kubeconfig file, and assigning RBAC permissions.

---

## 📌 Steps Overview
1. Generate a **private key** and **CSR** for the new user.
2. Submit the CSR to the Kubernetes cluster.
3. Approve the CSR and retrieve the signed certificate.
4. Configure the user-specific **kubeconfig** file.
5. Grant permissions using **RBAC**.
6. Test access and deploy a sample **Nginx pod**.

---

## 🚀 Step 1: Create a Certificate Signing Request (CSR)

Generate a private key and CSR for the new user `shubham`.

```bash
# Generate private key
openssl genrsa -out shubham.key 2048

# Generate CSR
openssl req -new -key shubham.key -subj "/CN=shubham/O=admin-team" -out shubham.csr
````

* **CN (Common Name):** Username (`shubham`)
* **O (Organization):** Group (`admin-team`)

---

## 🚀 Step 2: Submit the CSR to the Kubernetes Cluster

### Base64 encode the CSR

* **PowerShell**

  ```powershell
  [System.Convert]::ToBase64String([System.IO.File]::ReadAllBytes("shubham.csr"))
  ```
* **Git Bash / WSL**

  ```bash
  cat shubham.csr | base64 | tr -d '\n'
  ```

### Create the CSR YAML file (`shubham-csr.yaml`)

```yaml
apiVersion: certificates.k8s.io/v1
kind: CertificateSigningRequest
metadata:
  name: shubham-csr-request
spec:
  request: <base64-encoded-csr>
  signerName: kubernetes.io/kube-apiserver-client
  usages:
  - client auth
```

### Apply the CSR

```bash
kubectl apply -f shubham-csr.yaml --kubeconfig C:\Users\<Your_Username>\.kube\config
```

---

## 🚀 Step 3: Approve the CSR and Retrieve the Certificate

### Approve CSR

```bash
kubectl certificate approve shubham-csr-request --kubeconfig C:\Users\<Your_Username>\.kube\config
```

### Retrieve Signed Certificate

* **PowerShell**

  ```powershell
  $certificate = kubectl get csr shubham-csr-request -o jsonpath='{.status.certificate}' --kubeconfig C:\Users\<Your_Username>\.kube\config
  [System.IO.File]::WriteAllBytes("shubham.crt", [System.Convert]::FromBase64String($certificate))
  ```

* **Git Bash / WSL**

  ```bash
  kubectl get csr shubham-csr-request -o jsonpath='{.status.certificate}' \
    --kubeconfig C:\Users\<Your_Username>\.kube\config | base64 --decode > shubham.crt
  ```

---

## 🚀 Step 4: Configure User Kubeconfig

### Get Cluster CA Data

```bash
kubectl config view --raw --minify --flatten -o jsonpath='{.clusters[0].cluster.certificate-authority-data}' \
--kubeconfig C:\Users\<Your_Username>\.kube\config
```

### Base64 Encode Certificate and Key

* **Certificate**

  ```bash
  cat shubham.crt | base64 | tr -d '\n'
  ```
* **Private Key**

  ```bash
  cat shubham.key | base64 | tr -d '\n'
  ```

### Create Kubeconfig (`shubham-kubeconfig`)

```yaml
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: <paste_cluster_ca_data>
    server: https://127.0.0.1:58537
  name: docker-desktop
contexts:
- context:
    cluster: docker-desktop
    user: shubham
  name: docker-desktop-shubham
current-context: docker-desktop-shubham
kind: Config
users:
- name: shubham
  user:
    client-certificate-data: <paste_shubham.crt_data>
    client-key-data: <paste_shubham.key_data>
```

---

## 🚀 Step 5: Grant Permissions with RBAC

### Create `shubham-rbac.yaml`

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: shubham-cluster-admin-binding
subjects:
- kind: User
  name: shubham
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: cluster-admin
  apiGroup: rbac.authorization.k8s.io
```

### Apply RBAC

```bash
kubectl apply -f shubham-rbac.yaml --kubeconfig C:\Users\<Your_Username>\.kube\config
```

---

## 🔍 Verification & Debugging

### Check who you are

```bash
kubectl auth whoami --kubeconfig shubham-kubeconfig
```

### Example output

```
Username: shubham
Groups:   [admin-team system:authenticated]
```

### Fixing API server connection errors

If you see:

```
No connection could be made because the target machine actively refused it
```

Run:

```bash
kubectl config view --kubeconfig C:\Users\shubham\.kube\config --minify --output 'jsonpath={.clusters[].cluster.server}'
```

Update the `server:` field in `shubham-kubeconfig` with the correct API server address.

---

## 🚀 Step 6: Deploy an Nginx Pod as "shubham"

### Create `nginx-pod.yaml`

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod-shubham
  labels:
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx:latest
    ports:
    - containerPort: 80
```

### Deploy Pod

```bash
kubectl apply -f nginx-pod.yaml --kubeconfig shubham-kubeconfig
```

### Verify Deployment

```bash
kubectl get pods --kubeconfig shubham-kubeconfig
```

Expected output:

```
NAME               READY   STATUS    RESTARTS   AGE
nginx-pod-shubham  1/1     Running   0          1m
```

---

## ✅ Summary

* Created **user certificates** for `shubham`.
* Approved CSR and retrieved a **signed certificate**.
* Configured a **custom kubeconfig**.
* Granted **cluster-admin** permissions using RBAC.
* Verified access and deployed an **Nginx pod** as `shubham`.

---

```

Do you want me to also add a **diagram (PNG)** showing the flow (User → CSR → K8s CA → Signed Cert → Kubeconfig → RBAC → Access)? That would make the README more visually clear.
```
