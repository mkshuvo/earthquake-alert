flowchart TD
    Start[User Loads App] --> Init[Initialize App]
    Init --> Fetch[Fetch Data]
    Fetch --> Store[Update Store]
    
    subgraph UI_Rendering [UI Rendering (Slate Theme)]
        Store --> Layout[Render Layout (bg-slate-950)]
        Layout --> Header[Header + ConnectionStatus]
        Layout --> Banner[LatestNearMeBanner]
        Layout --> Grid[Dashboard Grid]
        
        Grid --> Stats[EarthquakeStats]
        Grid --> Filters[FilterPanel]
        Grid --> Map[EarthquakeMap (Dark Tiles)]
        Grid --> List[RecentLocalEarthquakes / EarthquakeList]
    end

    subgraph Styling [Theme System]
        Tailwind[Tailwind CSS]
        Icons[Lucide React]
        Utils[CLSX]
    end

    Styling -.-> UI_Rendering
