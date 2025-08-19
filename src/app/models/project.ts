export interface Project {
  id: number;
  name: string;
  designPicture: string;
  designFile: string;
  description: string;
  customerId: string;
  progress: number;
  opened: Date;
  delivery: Date;
  invoiceAmount: number;
  currency: string;
  isOpen: boolean;
}
