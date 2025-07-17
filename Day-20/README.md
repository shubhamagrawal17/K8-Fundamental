## What it means for a PV to not have storageClassName
- When you omit the storageClassName field from a PersistentVolume definition, or explicitly set it to an empty string (storageClassName: ""), it signifies that this PV does not belong to any particular StorageClass.
## The Binding Criteria (for Static Provisioning)
- When a PVC is created (and dynamic provisioning is not used or no matching StorageClass is found), the Kubernetes control plane looks for an existing PV that meets all of the following criteria:
    - Storage Class Matching - The storageClassName in the PVC must match the storageClassName in the PV.
    - Access Modes - The accessModes requested by the PVC (ReadWriteOnce, ReadOnlyMany, ReadWriteMany, ReadWriteOncePod) must be a subset or equal to the accessModes supported by the PV.
    - Capacity - The storage requested by the PVC (resources.requests.storage) must be less than or equal to the capacity.storage of the PV.
    - Selectors (Labels, Optional but Powerful): If a PVC includes a selector, it will only consider PVs that have all the labels specified in the matchLabels and satisfy the matchExpressions. This provides a powerful way to target specific PVs.
## Here's the binding logic:
- PVC requests storageClassName: "": This explicitly tells Kubernetes: "I want to bind to a PV that also has an empty or unset storageClassName."
- PV has no storageClassName (or storageClassName: ""): This PV is considered to be in the "no class" category.
- Since both the PVC and the PV are in this "no class" category, and if all other criteria (access modes, capacity) are met, they will bind.
## The Binding Process
- PVC Creation: A user creates a PersistentVolumeClaim object.
- Controller Watch: The Kubernetes volume_controller continuously monitors for new or updated PVCs that are in a Pending state (meaning they haven't found a PV yet).
- Matching Algorithm: For each Pending PVC, the controller iterates through all available (unbound) PVs in the cluster.
- First Fit: It attempts to find the first available PV that satisfies all the criteria (StorageClass, Access Modes, Capacity, Selectors).
- Binding: Once a suitable PV is found, the controller "binds" the PVC to that PV.
