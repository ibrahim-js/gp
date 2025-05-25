const table1 = [
  { key: "INDICE", label: "Indice" },
  { key: "EPI", label: "EPI" },
  { key: "AR", label: "AR" },
  { key: "ET", label: "ET" },
  { key: "N° Boite", label: "N° Boite" },
  { key: "Intitulé du Projet", label: "Intitulé du projet" },
  { key: "Etude", label: "Étude" },
  { key: "Date", label: "Date" },
  { key: "Secteur", label: "Secteur" },
  { key: "TI", label: "TI" },
  { key: "titre du documemt", label: "Titre du document" },
  { key: "Nbre des documents A3", label: "Nbre des documents A3" },
  { key: "Nbre des documents A4", label: "Nbre des documents A4" },
  { key: "Nbre des plans", label: "Nbre des plans" },
  { key: "TYPE DE DOCUMENT A4", label: "Type de document A4" },
  { key: "TYPE DE DOCUMENT A3", label: "Type de document A3" },
  { key: "TYPE DE DOCUMENT A0", label: "Type de document A0" },
  { key: "Nbre des copies", label: "Nbre des copies" },
  { key: "Nbre des examplaire", label: "Nbre des exemplaires" },
  { key: "N° DOSSIER", label: "N° dossier" },
  { key: "Salle", label: "Salle" },
];

const table2 = [
  { key: "indice", label: "Indice" },
  { key: "NOM", label: "Nom" },
  { key: "Nature du plan", label: "Nature du plan" },
  { key: "type d'ouvrage / réseau", label: "Type d'ouvrage / Réseau" },
  { key: "feuille", label: "Feuille" },
  { key: "Secteur", label: "Secteur" },
  { key: "realisateur", label: "Réalisateur" },
  { key: "Echelle", label: "Echelle" },
  { key: "mappe", label: "Mappe" },
  { key: "Annee", label: "Année" },
  { key: "tranche d'irrigation", label: "Tranche d'irrigation" },
];

export function getProjectSchema(type) {
  if (type == "projects1") {
    return {
      columns: table1,
      fields: table1.map((i) => ({
        name: i.key,
        label: i.label,
      })),
    };
  } else {
    return {
      columns: table2,
      fields: table2.map((i) => ({
        name: i.key,
        label: i.label,
      })),
    };
  }
}
