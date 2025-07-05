To verify whether your Kubernetes **Job** has completed, you can use the following commands:

---

### ✅ **1. Check Job Status**

```bash
kubectl get jobs hello-k8s-job
```

This will show output like:

```
NAME             COMPLETIONS   DURATION   AGE
hello-k8s-job    1/1           10s        1m
```

If you see `1/1` under COMPLETIONS, it means the job completed successfully.

---

### ✅ **2. Describe the Job (for more detail)**

```bash
kubectl describe job hello-k8s-job
```

This will show detailed status, including events like `Completed successfully`.

---

### ✅ **3. Check the Pod Created by the Job**

List the pods associated with the job:

```bash
kubectl get pods --selector=job-name=hello-k8s-job
```

Output will show the pod name and its status. For example:

```
hello-k8s-job-xxxxx   Completed   ...
```

---

### ✅ **4. View Logs to Confirm Job Output**

Once the pod is `Completed`, check the logs:

```bash
kubectl logs <pod-name>
```

You should see:

```
Hello from my Kubernetes Job!
Task Finished Successfully!
```

### This (failing-job.yaml) Kubernetes Job is intentionally designed to **fail** by exiting with code `1`. Let’s walk through how to verify and observe the retry behavior:

---

### 🔍 1. **Apply the Job**

```bash
kubectl apply -f retry-fail-job.yaml
```

---

### 📋 2. **Check Job Status**

```bash
kubectl get jobs retry-fail-job
```

You’ll likely see:

```
NAME              COMPLETIONS   DURATION   AGE
retry-fail-job    0/1           30s        1m
```

If it shows `0/1` for a while, it means it’s retrying. Once retries are exhausted:

```bash
kubectl describe job retry-fail-job
```

Look for this in the output:

```
BackoffLimitExceeded
```

This confirms the job has failed after exhausting its retries.

---

### 🔄 3. **List All Pods (Each Retry Creates a Pod)**

```bash
kubectl get pods --selector=job-name=retry-fail-job
```

Expected output:

```
retry-fail-job-xxxxx   Error     ...
retry-fail-job-yyyyy   Error     ...
retry-fail-job-zzzzz   Error     ...
```

Each pod corresponds to one retry attempt.

---

### 📦 4. **Check Logs of a Pod**

To view why it failed:

```bash
kubectl logs <pod-name>
```

Expected output:

```
Simulating a failure...
```

(And it exits immediately.)

---

### 📌 Summary

* `backoffLimit: 3` means 4 total attempts (1 initial + 3 retries).
* Each failed attempt shows up as a separate pod.
* The Job is marked as **Failed** after `backoffLimit` is hit.
* Use `kubectl describe job <job-name>` and `kubectl get pods` to debug retry behavior.

---

