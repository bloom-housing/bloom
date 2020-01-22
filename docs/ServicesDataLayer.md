# Bloom Services Data Layer Standards

The reference implementation of each Bloom service must be designed and implemented consistent with the standards in this document so that reference Bloom systems meet user, administrator, and jurisdiction needs with respect to data security, auditability, and maintainability.

## Versioning, Auditing and Soft-Deletion

Services should store their data in a way that preserves a version history for all significant objects, including past an end-user delete action. All deletes should be considered "soft" deletes, meaning they preserve the object underneath, even if it's no longer visible to end-users.