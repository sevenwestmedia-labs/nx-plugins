---
'@wanews/nx-pulumi': patch
---

Added the logic to remove pending operations in the `destroy-stack` generator
Remove the stack before deleting the stack config in the `destroy-stack` generator
Added --ignorePendingCreateOperations flag to the `destroy-stack` generator
