export interface Project {
  id: string;
  name: string;

  description: string;
  designPicture: string;
  designFile: string;

  customerId: string;      // FK → Customer
  pieceIds: string[];      // FKs → Pieces

  progress: number;
  opened: Date;
  delivery: Date;
  invoiceAmount: number;
  currency: string;
  isOpen: boolean;
}
