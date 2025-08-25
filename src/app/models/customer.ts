export interface Customer {
  id: string;
  name: string;
  projectIds: string[];    // FKs → Projects
}
