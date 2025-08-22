

### 1\. Create the Kind Cluster

Create a configuration file to disable Kind's default CNI. Name it `kind-config.yaml`.

```yaml
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
networking:
  disableDefaultCNI: true
```

Then, create the cluster using this configuration.

```bash
kind create cluster --config kind-config.yaml
```

### 2\. Install Calico

Install Calico to provide CNI and network policy enforcement.

```bash
kubectl apply -f https://raw.githubusercontent.com/projectcalico/calico/v3.27.3/manifests/calico.yaml
```

Wait for the Calico pods to be `Running`. You can check their status with `kubectl get pods -n kube-system`.

### 3\. Deploy the Applications

Deploy the `frontend` and `backend` services.

```yaml
# frontend.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  labels:
    app: frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
        - name: frontend
          image: nginx
          ports:
            - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: frontend
spec:
  selector:
    app: frontend
  ports:
    - port: 80
      targetPort: 80
---
# backend.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  labels:
    app: backend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
        - name: backend
          image: nginx
          ports:
            - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: backend
spec:
  selector:
    app: backend
  ports:
    - port: 80
      targetPort: 80
```

Apply the application manifests.

```bash
kubectl apply -f frontend.yaml -f backend.yaml
```

### 4\. Verify Initial Communication

Confirm that communication works before applying any policies.

```bash
kubectl exec -it deploy/frontend -- curl backend:80
```

This should return the Nginx welcome page, as there are no network policies restricting traffic yet.

-----

### 5\. Apply Network Policies

The correct approach is to apply the policies in a logical order. First, apply a policy that allows DNS traffic globally, and then a policy that blocks all other traffic. A more robust solution is a single policy that handles both. Here, we'll use two separate policies for clarity, ensuring the DNS policy is applied first.

#### Policy 1: Allow DNS

This policy allows all pods in the `default` namespace to make DNS queries. This is crucial for hostname resolution.

```yaml
# allow-dns.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-dns
  namespace: default
spec:
  podSelector: {}
  policyTypes:
    - Egress
  egress:
    - to:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: kube-system
          podSelector:
            matchLabels:
              k8s-app: kube-dns
      ports:
        - protocol: UDP
          port: 53
        - protocol: TCP
          port: 53
```

Apply this policy.

```bash
kubectl apply -f allow-dns.yaml
```

#### Policy 2: Deny All Ingress and Egress

This policy blocks all other traffic.

```yaml
# deny-all.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
  namespace: default
spec:
  podSelector: {}
  policyTypes:
    - Ingress
    - Egress
  ingress: []
  egress: []
```

Apply this policy.

```bash
kubectl apply -f deny-all.yaml
```

Now, re-run the test command. It will hang or time out because the `deny-all` policy is in effect, blocking all traffic except DNS. DNS resolution will succeed, but the subsequent connection attempt will fail.

```bash
kubectl exec -it deploy/frontend -- curl backend:80
```

#### Policy 3: Allow Frontend to Backend

This policy will explicitly allow the `frontend` pod to communicate with the `backend` pod. This is an **ingress** policy on the `backend` that allows traffic from the `frontend`.

```yaml
# allow-frontend-to-backend.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend-to-backend
  namespace: default
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: frontend
      ports:
        - protocol: TCP
          port: 80
```

Apply this policy.

```bash
kubectl apply -f allow-frontend-to-backend.yaml
```

-----

### 6\. Verify the Final Configuration

Now, with all policies in place (allow-DNS, deny-all, and allow-frontend-to-backend), run the test command again.

```bash
kubectl exec -it deploy/frontend -- curl backend:80
```

The output should now be the Nginx welcome page. The traffic flow is now working as intended because:

1.  The `deny-all` policy blocks everything by default.
2.  The `allow-dns` policy creates an exception for DNS queries (egress).
3.  The `allow-frontend-to-backend` policy creates an exception for the specific pod-to-pod communication (ingress to the backend).

## The error message Failed to connect to backend port 80 indicates that the frontend pod successfully resolved the backend hostname to an IP address (so DNS is working), but the network connection itself was blocked. 🔒

- This happens because your network policies are not fully allowing the traffic in both directions. The allow-frontend-to-backend policy is an ingress policy applied to the backend pod, but you also need to allow the egress traffic from the frontend pod.

## Explanation of the Error
- When you apply the deny-all network policy, it sets default-deny rules for both ingress and egress traffic.

- Egress: The frontend pod is prevented from sending any packets out.

- Ingress: The backend pod is prevented from receiving any packets.

Your allow-frontend-to-backend policy correctly opens up the ingress for the backend pod. However, it does not open up the egress for the frontend pod. The traffic flow looks like this:

The frontend pod initiates a connection to the backend pod. This is an egress event for the frontend.

The deny-all egress policy on the frontend pod blocks this traffic.

The connection attempt fails with a timeout, resulting in the Failed to connect error.

The allow-dns policy you applied only allows egress to the DNS server, which is why the hostname resolution worked and the error changed from Could not resolve host to Failed to connect.

## Solution: 
Add an Egress Policy for Frontend
To fix this, you must explicitly allow the frontend pod to send traffic to the backend pod. You can do this by creating a new egress policy or by modifying the allow-frontend-to-backend policy to also include an egress rule.

Here is a new network policy that allows egress traffic from the frontend to the backend.
```bash
# allow-frontend-egress.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend-egress
  namespace: default
spec:
  podSelector:
    matchLabels:
      app: frontend
  policyTypes:
    - Egress
  egress:
    - to:
        - podSelector:
            matchLabels:
              app: backend
      ports:
        - protocol: TCP
          port: 80

```