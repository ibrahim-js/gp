import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

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
import { ProjectFiles } from "@/components/projet2-files";
import {
  deleteProject2,
  fetchProject2ById,
  updateProject2,
} from "@/api/projects";
import Layout from "@/components/layout";
import { toast } from "sonner";
import { logAction } from "@/api/logs";
import { useAuth } from "@/hooks/auth";

export default function ProjectDetails() {
  const navigate = useNavigate();
  const projectId = useParams().id;
  const { user, loading: userLoading } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userLoading && user) {
      fetchProject2ById(projectId)
        .then((data) => {
          setLoading(false);
          setProject(data);

          logAction({
            action: "VIEW_PROJECT",
            translated_action: "Consultation de projet",
            entity_type: "project2",
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
    updateProject2(project)
      .then((data) => {
        setProject(data.project);
        toast.success(data.message);

        logAction({
          action: "UPDATE_PROJECT",
          translated_action: "Modification de projet",
          entity_type: "project2",
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

    deleteProject2(project.id)
      .then((data) => {
        toast.success(data.message);

        logAction({
          action: "DELETE_PROJECT",
          translated_action: "Suppression de projet",
          entity_type: "project2",
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
                <Label htmlFor="name" className="text-xs font-medium">
                  Nom
                </Label>
                <Input
                  id="name"
                  value={project.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="h-7 !text-[11px]"
                  readOnly={!["admin", "editor"].includes(user.role)}
                />
              </div>
              <div className="space-y-1 p-2 rounded-md">
                <Label htmlFor="type" className="text-xs font-medium">
                  Type d'ouvrage / Réseau
                </Label>
                <Input
                  id="type"
                  value={project.type || ""}
                  onChange={(e) => handleChange("type", e.target.value)}
                  className="h-7 !text-[11px]"
                  readOnly={!["admin", "editor"].includes(user.role)}
                />
              </div>
              <div className="space-y-1 p-2 rounded-md">
                <Label htmlFor="year" className="text-xs font-medium">
                  Année
                </Label>
                <Input
                  id="year"
                  value={project.year || ""}
                  onChange={(e) => handleChange("year", e.target.value)}
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
              <div className="space-y-1 p-2 rounded-md">
                <Label htmlFor="mappe" className="text-xs font-medium">
                  Mappe
                </Label>
                <Input
                  id="mappe"
                  value={project.mappe || ""}
                  onChange={(e) => handleChange("mappe", e.target.value)}
                  className="h-7 !text-[11px]"
                  readOnly={!["admin", "editor"].includes(user.role)}
                />
              </div>
              <div className="space-y-1 p-2 rounded-md">
                <Label htmlFor="producer" className="text-xs font-medium">
                  Réalisateur
                </Label>
                <Input
                  id="producer"
                  value={project.producer || ""}
                  onChange={(e) => handleChange("producer", e.target.value)}
                  className="h-7 !text-[11px]"
                  readOnly={!["admin", "editor"].includes(user.role)}
                />
              </div>
              <div className="space-y-1 p-2 rounded-md">
                <Label htmlFor="scale" className="text-xs font-medium">
                  Echelle
                </Label>
                <Input
                  id="scale"
                  value={project.scale || ""}
                  onChange={(e) => handleChange("scale", e.target.value)}
                  className="h-7 !text-[11px]"
                  readOnly={!["admin", "editor"].includes(user.role)}
                />
              </div>
              <div className="space-y-1 p-2 rounded-md">
                <Label htmlFor="sheet" className="text-xs font-medium">
                  Feuille
                </Label>
                <Input
                  id="sheet"
                  value={project.sheet || ""}
                  onChange={(e) => handleChange("sheet", e.target.value)}
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
              <div className="space-y-1 p-2 rounded-md">
                <Label htmlFor="tranche" className="text-xs font-medium">
                  Tranche d'irrigation
                </Label>
                <Input
                  id="tranche"
                  value={project.tranche || ""}
                  onChange={(e) => handleChange("tranche", e.target.value)}
                  className="h-7 !text-[11px]"
                  readOnly={!["admin", "editor"].includes(user.role)}
                />
              </div>
              <div className="space-y-1 p-2 rounded-md">
                <Label htmlFor="nature" className="text-xs font-medium">
                  Nature du plan
                </Label>
                <Input
                  id="nature"
                  value={project.nature || ""}
                  onChange={(e) => handleChange("nature", e.target.value)}
                  className="h-7 !text-[11px]"
                  readOnly={!["admin", "editor"].includes(user.role)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end p-3 bg-gray-50 border-t">
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
