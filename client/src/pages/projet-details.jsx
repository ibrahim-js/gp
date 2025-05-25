import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, AlertTriangle } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { deleteProject, fetchProjectById, updateProject } from "@/api/projects";
import Layout from "@/components/layout";
import { ProjectFiles } from "@/components/projet-files";
import { toast } from "sonner";
import { logAction } from "@/api/logs";
import { useAuth } from "@/hooks/auth";

export default function ProjectDetails({ params }) {
  const navigate = useNavigate();
  const projectId = useParams().id;
  const { user, loading: userLoading } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userLoading && user) {
      fetchProjectById(projectId)
        .then((data) => {
          setLoading(false);
          setProject(data);

          logAction({
            action: "VIEW_PROJECT",
            translated_action: "Consultation de projet",
            entity_type: "project",
            entity_id: data.id,
            message: `${user.fname} ${user.lname} a consulté le projet avec l'index : ${data.index}.`,
          });
        })
        .catch((error) => {
          setLoading(false);
          setProject(null);
        });
    }
  }, [projectId, userLoading]);

  const handleChange = (field, value) => {
    setProject((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    updateProject(project)
      .then((data) => {
        setProject(data.project);
        toast.success(data.message);

        logAction({
          action: "UPDATE_PROJECT",
          translated_action: "Modification de projet",
          entity_type: "project",
          entity_id: projectId,
          message: `${user.fname} ${user.lname} a modifié le projet avec l'index : ${project?.index}`,
        });
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message || "Une erreur est survenue."
        );
      });
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleDelete = () => {
    if (
      !confirm(
        `Êtes-vous sûr de vouloir supprimer ce projet ? Cette action est irréversible.`
      )
    )
      return;

    deleteProject(project.id)
      .then((data) => {
        toast.success(data.message);

        logAction({
          action: "DELETE_PROJECT",
          translated_action: "Suppression de projet",
          entity_type: "project",
          entity_id: project.id,
          message: `${user.fname} ${user.lname} a supprimé le projet avec l'index : ${project.index}.`,
        }).then(() => {
          setTimeout(() => {
            navigate(-1);
          }, 2000);
        });
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message || "Une erreur est survenue."
        );
      });
  };

  if (loading || userLoading) {
    return (
      <Layout>
        <div className="container py-6">
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-center items-center h-40">
                <p className="text-sm">Chargement des données...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="container py-6">
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="flex justify-center items-center h-40">
                <p className="text-sm">Projet non trouvé</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-6">
        <Card className="shadow-sm overflow-hidden p-0 gap-0">
          <div className="bg-gradient-to-r from-gray-50 to-white border-b">
            <CardHeader className="pb-4 pt-6">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBack}
                  className="h-7 !text-[11px]"
                >
                  <ArrowLeft className="h-3 w-3 mr-1" />
                  Retour
                </Button>
                <CardTitle className="text-lg font-medium">
                  Détails du Projet #{project.index}
                </CardTitle>
                {user.role == "admin" && (
                  <Button
                    onClick={handleDelete}
                    variant="destructive"
                    size="sm"
                    className="h-7 text-xs"
                  >
                    Supprimer
                  </Button>
                )}
              </div>
            </CardHeader>
          </div>
          <CardContent className="p-4 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0">
              <div className="space-y-1 p-2 rounded-md">
                <Label htmlFor="index" className="text-xs font-medium">
                  Indice
                </Label>
                <Input
                  id="index"
                  value={project.index || ""}
                  onChange={(e) => handleChange("index", e.target.value)}
                  className="h-7 !text-[11px]"
                  readOnly={!["admin", "editor"].includes(user.role)}
                />
              </div>
              <div className="space-y-1 p-2 rounded-md">
                <Label htmlFor="epi" className="text-xs font-medium">
                  EPI
                </Label>
                <Input
                  id="epi"
                  value={project.epi || ""}
                  onChange={(e) => handleChange("epi", e.target.value)}
                  className="h-7 !text-[11px]"
                  readOnly={!["admin", "editor"].includes(user.role)}
                />
              </div>
              <div className="space-y-1 p-2 rounded-md">
                <Label htmlFor="ar" className="text-xs font-medium">
                  AR
                </Label>
                <Input
                  id="ar"
                  value={project.ar || ""}
                  onChange={(e) => handleChange("ar", e.target.value)}
                  className="h-7 !text-[11px]"
                  readOnly={!["admin", "editor"].includes(user.role)}
                />
              </div>
              <div className="space-y-1 p-2 rounded-md">
                <Label htmlFor="et" className="text-xs font-medium">
                  ET
                </Label>
                <Input
                  id="et"
                  value={project.et || ""}
                  onChange={(e) => handleChange("et", e.target.value)}
                  className="h-7 !text-[11px]"
                  readOnly={!["admin", "editor"].includes(user.role)}
                />
              </div>
              <div className="space-y-1 p-2 rounded-md">
                <Label htmlFor="nbr_boite" className="text-xs font-medium">
                  N° Boite
                </Label>
                <Input
                  id="nbr_boite"
                  value={project.nbr_boite || ""}
                  onChange={(e) => handleChange("nbr_boite", e.target.value)}
                  className="h-7 !text-[11px]"
                  readOnly={!["admin", "editor"].includes(user.role)}
                />
              </div>
              <div className="space-y-1 p-2 rounded-md">
                <Label htmlFor="name_project" className="text-xs font-medium">
                  Intitulé du projet
                </Label>
                <Input
                  id="name_project"
                  value={project.name_project || ""}
                  onChange={(e) => handleChange("name_project", e.target.value)}
                  className="h-7 !text-[11px]"
                  readOnly={!["admin", "editor"].includes(user.role)}
                />
              </div>
              <div className="space-y-1 p-2 rounded-md">
                <Label htmlFor="etude" className="text-xs font-medium">
                  Étude
                </Label>
                <Input
                  id="etude"
                  value={project.etude || ""}
                  onChange={(e) => handleChange("etude", e.target.value)}
                  className="h-7 !text-[11px]"
                  readOnly={!["admin", "editor"].includes(user.role)}
                />
              </div>
              <div className="space-y-1 p-2 rounded-md">
                <Label htmlFor="date" className="text-xs font-medium">
                  Date
                </Label>
                <Input
                  id="date"
                  value={project.date || ""}
                  onChange={(e) => handleChange("date", e.target.value)}
                  className="h-7 !text-[11px]"
                  readOnly={!["admin", "editor"].includes(user.role)}
                />
              </div>
              <div className="space-y-1 p-2 rounded-md">
                <Label htmlFor="secteur" className="text-xs font-medium">
                  Secteur
                </Label>
                <Input
                  id="secteur"
                  value={project.secteur || ""}
                  onChange={(e) => handleChange("secteur", e.target.value)}
                  className="h-7 !text-[11px]"
                  readOnly={!["admin", "editor"].includes(user.role)}
                />
              </div>
              {/* Autres champs avec le même style */}
              <div className="space-y-1 p-2 rounded-md">
                <Label htmlFor="ti" className="text-xs font-medium">
                  TI
                </Label>
                <Input
                  id="ti"
                  value={project.ti || ""}
                  onChange={(e) => handleChange("ti", e.target.value)}
                  className="h-7 !text-[11px]"
                  readOnly={!["admin", "editor"].includes(user.role)}
                />
              </div>
              <div className="space-y-1 p-2 rounded-md">
                <Label htmlFor="name_document" className="text-xs font-medium">
                  Titre du document
                </Label>
                <Input
                  id="name_document"
                  value={project.name_document || ""}
                  onChange={(e) =>
                    handleChange("name_document", e.target.value)
                  }
                  className="h-7 !text-[11px]"
                  readOnly={!["admin", "editor"].includes(user.role)}
                />
              </div>
              <div className="space-y-1 p-2 rounded-md">
                <Label
                  htmlFor="nbr_document_a3"
                  className="text-xs font-medium"
                >
                  Nbre des documents A3
                </Label>
                <Input
                  id="nbr_document_a3"
                  value={project.nbr_document_a3 || ""}
                  onChange={(e) =>
                    handleChange("nbr_document_a3", e.target.value)
                  }
                  className="h-7 !text-[11px]"
                  readOnly={!["admin", "editor"].includes(user.role)}
                />
              </div>
              {/* Continuer avec les autres champs */}
              <div className="space-y-1 p-2 rounded-md">
                <Label
                  htmlFor="nbr_document_a4"
                  className="text-xs font-medium"
                >
                  Nbre des documents A4
                </Label>
                <Input
                  id="nbr_document_a4"
                  value={project.nbr_document_a4 || ""}
                  onChange={(e) =>
                    handleChange("nbr_document_a4", e.target.value)
                  }
                  className="h-7 !text-[11px]"
                  readOnly={!["admin", "editor"].includes(user.role)}
                />
              </div>
              <div className="space-y-1 p-2 rounded-md">
                <Label htmlFor="nbr_plan" className="text-xs font-medium">
                  Nbre des plans
                </Label>
                <Input
                  id="nbr_plan"
                  value={project.nbr_plan || ""}
                  onChange={(e) => handleChange("nbr_plan", e.target.value)}
                  className="h-7 !text-[11px]"
                  readOnly={!["admin", "editor"].includes(user.role)}
                />
              </div>
              <div className="space-y-1 p-2 rounded-md">
                <Label
                  htmlFor="type_document_a3"
                  className="text-xs font-medium"
                >
                  Type de document A3
                </Label>
                <Input
                  id="type_document_a3"
                  value={project.type_document_a3 || ""}
                  onChange={(e) =>
                    handleChange("type_document_a3", e.target.value)
                  }
                  className="h-7 !text-[11px]"
                  readOnly={!["admin", "editor"].includes(user.role)}
                />
              </div>
              <div className="space-y-1 p-2 rounded-md">
                <Label
                  htmlFor="type_document_a4"
                  className="text-xs font-medium"
                >
                  Type de document A4
                </Label>
                <Input
                  id="type_document_a4"
                  value={project.type_document_a4 || ""}
                  onChange={(e) =>
                    handleChange("type_document_a4", e.target.value)
                  }
                  className="h-7 !text-[11px]"
                  readOnly={!["admin", "editor"].includes(user.role)}
                />
              </div>
              <div className="space-y-1 p-2 rounded-md">
                <Label
                  htmlFor="type_document_a0"
                  className="text-xs font-medium"
                >
                  Type de document A0
                </Label>
                <Input
                  id="type_document_a0"
                  value={project.type_document_a0 || ""}
                  onChange={(e) =>
                    handleChange("type_document_a0", e.target.value)
                  }
                  className="h-7 !text-[11px]"
                  readOnly={!["admin", "editor"].includes(user.role)}
                />
              </div>
              <div className="space-y-1 p-2 rounded-md">
                <Label htmlFor="nbr_copy" className="text-xs font-medium">
                  Nbre des copies
                </Label>
                <Input
                  id="nbr_copy"
                  value={project.nbr_copy || ""}
                  onChange={(e) => handleChange("nbr_copy", e.target.value)}
                  className="h-7 !text-[11px]"
                  readOnly={!["admin", "editor"].includes(user.role)}
                />
              </div>
              <div className="space-y-1 p-2 rounded-md">
                <Label htmlFor="nbr_exemplaire" className="text-xs font-medium">
                  Nbre des exemplaires
                </Label>
                <Input
                  id="nbr_exemplaire"
                  value={project.nbr_exemplaire || ""}
                  onChange={(e) =>
                    handleChange("nbr_exemplaire", e.target.value)
                  }
                  className="h-7 !text-[11px]"
                  readOnly={!["admin", "editor"].includes(user.role)}
                />
              </div>
              <div className="space-y-1 p-2 rounded-md">
                <Label htmlFor="nbr_folder" className="text-xs font-medium">
                  N° dossier
                </Label>
                <Input
                  id="nbr_folder"
                  value={project.nbr_folder || ""}
                  onChange={(e) => handleChange("nbr_folder", e.target.value)}
                  className="h-7 !text-[11px]"
                  readOnly={!["admin", "editor"].includes(user.role)}
                />
              </div>
              <div className="space-y-1 p-2 rounded-md">
                <Label htmlFor="salle" className="text-xs font-medium">
                  Salle
                </Label>
                <Input
                  id="salle"
                  value={project.salle || ""}
                  onChange={(e) => handleChange("salle", e.target.value)}
                  className="h-7 !text-[11px]"
                  readOnly={!["admin", "editor"].includes(user.role)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end !p-3 bg-gray-50 border-t">
            {["admin", "editor"].includes(user.role) ? (
              <Button
                onClick={handleSave}
                className="flex items-center gap-1 h-7 text-xs bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600"
              >
                <Save className="h-3 w-3" />
                Enregistrer
              </Button>
            ) : (
              <p className="text-xs">
                Vous n'avez pas les droits pour modifier.
              </p>
            )}
          </CardFooter>
        </Card>
        {/* Section des fichiers attachés */}
        <ProjectFiles projectId={projectId} projectIndex={project.index} />
      </div>
    </Layout>
  );
}
