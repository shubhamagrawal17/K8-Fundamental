# Part 1: ReplicaSet Demo
1.  apply this ReplicaSet - kubectl apply -f replicaset-nginx.yaml
2. Let's see our Pods and the ReplicaSet: - kubectl get pods , kubectl get rs
4. Now, for the self-healing magic! Let's manually delete one of these Pods - kubectl delete pod <pod-name>
5. let's clean up this ReplicaSet - kubectl delete -f replicaset-nginx.yaml

# Part 2: Deployment Demo
1. apply this Deployment: kubectl apply -f deployment-nginx.yaml
2. Now, let's see what Kubernetes created for us: kubectl get pods , kubectl get rs , kubectl get deploy
3. The power of Rolling Updates! - Modify deployment-nginx.yaml to change image: nginx:1.16.1
- kubectl apply -f deployment-nginx.yaml
- Now, quickly run kubectl get pods -w
- You can see new Pods coming up with new names, and old ones gracefully shutting down. This is a rolling update – ensuring no downtime for your users!
- Let's check the Deployment history: kubectl rollout history deployment nginx-deployment
4. Rollbacks! Let's revert to our previous stable version.
- kubectl rollout undo deployment nginx-deployment
5. Let's clean up our Deployment:
- kubectl delete -f deployment-nginx.yaml

# In real-time or production Kubernetes environments, you almost never directly create a standalone ReplicaSet file.