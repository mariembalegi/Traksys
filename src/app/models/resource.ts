export interface Resource {
  id: string;                  // Unique identifier for the resource
  name: string;                // Name of the person or machine
  type: 'Person' | 'Machine';  // Type of resource
}
