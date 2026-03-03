export interface IProduct {
  _id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  imageUrl?: string;
  /** UPC (Universal Product Code), 12-digit number. Required when creating/editing. */
  upc?: string;
}

