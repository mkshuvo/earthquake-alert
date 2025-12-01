sequenceDiagram
    participant U as User
    participant P as Page (Home)
    participant S as Store (Zustand)
    participant API as API Service
    participant C as Components (Stats, Map, List)

    Note over U, P: Initialization
    U->>P: Loads Application
    P->>S: Initialize Store
    S->>API: Fetch Initial Data
    API-->>S: Return Earthquake Data
    S-->>P: Data Ready
    P->>C: Render Components (Slate Theme)

    Note over C: Theme Application
    C->>C: Apply bg-slate-950, text-slate-200
    C->>C: Render Lucide Icons

    Note over U, P: Interaction
    U->>C: Filter / Interact
    C->>S: Update Filters
    S->>C: Re-render with filtered data
