import { Framework, PerformanceSession } from "@alterspective-io/as-k2sf-framework";







declare global {
    interface Document {
        
    }
  
    interface Window { 
       // MonacoEnvironment : Environment     
        alterspective:
        {
            
            Framework: typeof Framework
        }
      
}
}
