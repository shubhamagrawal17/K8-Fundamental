# Step-1 Apply the CronJob

Foobar is a Python library for dealing with word pluralization.


```bash
kubectl apply -f demo-cronjob.yaml

```

## Step-2 Check CronJob Status

```python
kubectl get cronjob
```
Look for output like:
```python
NAME            SCHEDULE      SUSPEND   ACTIVE   LAST SCHEDULE   AGE
demo-cronjob    */1 * * * *   False     0        <timestamp>     <time>
```

## Step-3 Watch for Job Creation
```python
kubectl get jobs --watch
```
You should see Jobs created every minute, like:
```python
NAME                      COMPLETIONS   DURATION   AGE
demo-cronjob-29198481     1/1           6s         1m
demo-cronjob-29198542     1/1           5s         2m
```
## Step-4  List the Pods
```python
kubectl get pods
```
## Step -5 Check the Logs
```python
kubectl logs <pod-name>
```
And verify that old jobs are automatically cleaned up beyond the limits.


You should see:
```python
Scheduled task running at: Mon Jul  7 12:47:00 UTC 2025
Task complete for this minute.
```
## Step-6 Check Job History Cleanup
```python
kubectl get jobs
```
And verify that old jobs are automatically cleaned up beyond the limits.

