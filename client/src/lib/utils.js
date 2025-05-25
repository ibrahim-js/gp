import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function translateAction(action) {
  switch (action) {
    case "ADD_USER":
      return "Ajout d'utilisateur";
    case "UPDATE_USER":
      return "Modification d'utilisateur";
    case "DELETE_USER":
      return "Suppression d'utilisateur";
    case "ADD_PROJECT":
      return "Ajout de projet";
    case "UPDATE_PROJECT":
      return "Modification de projet";
    case "DELETE_PROJECT":
      return "Suppression de projet";
    case "REFUSE_PROJECT":
      return "Refus de projet";
    case "APPROVE_PROJECT":
      return "Approbation de projet";
    default:
      return action;
  }
}

export const getRoleLabel = (role) => {
  switch (role) {
    case "admin":
      return "Administrateur";
    case "editor":
      return "Éditeur";
    case "user":
      return "Utilisateur";
    default:
      return "Utilisateur";
  }
};
