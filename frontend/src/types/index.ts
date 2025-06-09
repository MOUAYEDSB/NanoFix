export interface Client {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  adresse: string;
  dateCreation: string;
}

export interface Appareil {
  id: string;
  clientId: string;
  marque: string;
  modele: string;
  imei: string;
  couleur: string;
  motDePasseEcran?: string;
  accessoires: string[];
}

export interface Reparation {
  id: string;
  clientId: string;
  appareilId: string;
  categorieProbleme: string;
  descriptionProbleme: string;
  diagnosticTechnicien: string;
  piecesNecessaires: string[];
  coutEstime: number;
  coutFinal?: number;
  statut: 'En attente' | 'En cours' | 'Terminé' | 'Livré' | 'Annulé';
  priorite: 'Basse' | 'Normale' | 'Haute' | 'Urgente';
  dateCreation: string;
  dateDebutReparation?: string;
  dateFinReparation?: string;
  dateLivraison?: string;
  technicien: string;
  notes: string[];
}

export interface Facture {
  id: string;
  reparationId: string;
  numeroFacture: string;
  montantHT: number;
  tva: number;
  montantTTC: number;
  dateEmission: string;
  datePaiement?: string;
  statutPaiement: 'En attente' | 'Payé' | 'Partiellement payé' | 'Annulé';
  methodePaiement?: string;
}

export const categoriesProblemes = [
  'Écran cassé/fissuré',
  'Problème de batterie',
  'Problème de charge',
  'Problème audio/micro',
  'Problème caméra',
  'Problème boutons',
  'Problème logiciel/OS',
  'Problème réseau/WiFi',
  'Dégât des eaux',
  'Autre'
];

export const marquesTelephones = [
  'Apple',
  'Samsung',
  'Huawei',
  'Xiaomi',
  'OnePlus',
  'Google',
  'Sony',
  'LG',
  'Oppo',
  'Vivo',
  'Nokia',
  'Motorola',
  'Autre'
];