# Let's break down the resources section:

- requests.cpu: "100m": We're telling Kubernetes, "This Nginx container needs at least 100 millicores of CPU." Kubernetes will only schedule this Pod on a Node that has at least 100m of CPU available for requests.

- requests.memory: "128Mi": "This container needs at least 128 MiB of memory." Kubernetes will ensure this amount is available on the Node during scheduling.

- limits.cpu: "200m": "This container is not allowed to use more than 200 millicores of CPU." If it tries to burst beyond that, it will be throttled.
- limits.memory: "256Mi": "This container must not use more than 256 MiB of memory." If it attempts to, it will be terminated with an Out-Of-Memory error.
## Kubernetes QoS (Quality of Service) Classes

1. Guaranteed

- The Pod is given the highest priority.

- All containers in the Pod must have CPU and Memory requests equal to their limits.

2. Burstable

- This is our case!

- A Pod is Burstable if

  - At least one resource (CPU or Memory) has a request less than its limit, or Requests are set but limits are missing (not ideal, but valid).
  - These Pods can use more than their requested resources, up to the limit, if the node has extra capacity.
3. BestEffort
 - Lowest priority.

- No CPU or Memory requests or limits are set at all.

- These are the first to be terminated when resources are tight.

## Example: Our Nginx Pod

- CPU: Request = 100m, Limit = 200m

- Memory: Request = 128Mi, Limit = 256Mi

- Since requests < limits and are set, Kubernetes classifies it as Burstable.

That means:
- The Pod is guaranteed at least 100m CPU and 128Mi memory.

- It can use more (up to 200m CPU and 256Mi memory) if resources are available.

- It has higher priority than BestEffort, so it won't be killed first if the node is under pressure.