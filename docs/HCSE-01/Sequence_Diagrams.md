# Sequence Diagrams

```mermaid
sequenceDiagram
    participant App
    participant SocietyManager
    participant Specialist
    participant HCNS
    App->>SocietyManager: registerSpecialist()
    SocietyManager->>Specialist: initialize()
    SocietyManager->>SpecialistRegistry: add()
    SocietyManager->>Specialist: activate()
    SocietyManager->>HCNS: publishStateTransition()
```
