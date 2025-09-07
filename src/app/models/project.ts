export interface Project {
  id: string;
  name: string;
  description: string;
  designPicture?: string;
  designFile?: string;
  customerId: string;
  pieceIds: string[];
  progress: number;
  opened: Date;
  delivery: Date;
  invoiceAmount: number;
  currency: string;
  isOpen: boolean;
  createdBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
