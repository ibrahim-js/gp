import { Routes, Route } from "react-router-dom";

import Projets from "@/pages/projets";
import ProjetDetails from "@/pages/projet-details";
import AjouterProjet from "@/pages/ajouter-projet";
import AjouterProjet2 from "@/pages/ajouter-projet2";
import Projets2 from "@/pages/projets2";
import Projet2Details from "@/pages/projet2-details";
import Utilisateurs from "@/pages/utilisateurs";
import PendingProjectsPage from "@/pages/projets-en-attente";
import HistoriquePage from "@/pages/historique";
import JournalPage from "@/pages/journal";
import Profil from "@/pages/profil";
import Acceuil from "@/pages/acceuil";
import Login from "@/pages/login";
import Protect from "@/components/protect";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <Protect>
            <Acceuil />
          </Protect>
        }
      />

      <Route
        path="/e-archive-53-2023"
        element={
          <Protect>
            <Projets />
          </Protect>
        }
      />

      <Route
        path="/e-archive-53-2023/ajouter"
        element={
          <Protect allowedRoles={["admin", "editor"]}>
            <AjouterProjet />
          </Protect>
        }
      />

      <Route
        path="/e-archive-53-2023/:id"
        element={
          <Protect>
            <ProjetDetails />
          </Protect>
        }
      />

      <Route
        path="/e-archive-18-2022"
        element={
          <Protect>
            <Projets2 />
          </Protect>
        }
      />

      <Route
        path="/e-archive-18-2022/ajouter"
        element={
          <Protect allowedRoles={["admin", "editor"]}>
            <AjouterProjet2 />
          </Protect>
        }
      />

      <Route
        path="/e-archive-18-2022/:id"
        element={
          <Protect>
            <Projet2Details />
          </Protect>
        }
      />

      <Route
        path="/utilisateurs"
        element={
          <Protect allowedRoles={["admin"]}>
            <Utilisateurs />
          </Protect>
        }
      />

      <Route
        path="/projets-en-attente"
        element={
          <Protect allowedRoles={["admin"]}>
            <PendingProjectsPage />
          </Protect>
        }
      />

      <Route
        path="/historique"
        element={
          <Protect>
            <HistoriquePage />
          </Protect>
        }
      />

      <Route
        path="/journal"
        element={
          <Protect allowedRoles={["admin"]}>
            <JournalPage />
          </Protect>
        }
      />

      <Route
        path="/profil"
        element={
          <Protect>
            <Profil />
          </Protect>
        }
      />
    </Routes>
  );
}
