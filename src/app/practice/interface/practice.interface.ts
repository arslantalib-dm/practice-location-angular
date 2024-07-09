// Billing interface
interface Billing {
  id: number | null;
  provider_name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  floor: string;
  phone: string;
  email: string;
  ext_no: string;
  cell_no: string;
  npi: string;
  dol: string;
  tax_id_check: number;
  tin: number | null;
  ssn: number | null;
}

// Location interface
interface Location {
  id: number | null;
  address: string;
  city: string;
  state: string;
  zip: string;
  floor: string;
  phone: string;
  email: string;
  ext_no: string;
  cell_no: string;
  fax: string;
  same_as_provider: boolean;
  dean: string;
  billing: Billing; // Use the Billing interface here
}

// Practice interface
export interface Practice {
  id: number | null;
  name: string;
  qualifier: string;
  generate_document_using: string;
  location: Location; // Use the Location interface here
  signature_title: string;
  signature_file: File; // Adjust this type according to your needs
}
