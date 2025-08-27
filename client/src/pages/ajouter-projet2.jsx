import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Upload, X, FileText, File } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";
import { addProject2, uploadFiles } from "@/api/projects";
import Layout from "@/components/layout";
import { toast } from "sonner";
import { logAction } from "@/api/logs";
import { useAuth } from "@/hooks/auth";

export default function AjouterProjet2() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const { user, loading } = useAuth();

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    year: "",
    secteur: "",
    mappe: "",
    producer: "",
    scale: "",
    sheet: "",
    salle: "",
    tranche: "",
    index: "",
    nature: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e) => {
    const newSelectedFiles = e.target.files;
    if (newSelectedFiles && newSelectedFiles.length > 0) {
      setSelectedFiles(Array.from(newSelectedFiles));
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    addProject2(formData)
      .then((data) => {
        const newProjectId = data.project.id;

        if (selectedFiles.length > 0) {
          const formData = new FormData();
          selectedFiles.forEach((file) => {
            formData.append("files", file);
          });

          // Add extra fields expected by backend
          formData.append("projectId", newProjectId); // Replace with your project ID variable
          formData.append("userId", "1"); // Replace with your user ID variable
          formData.append("projectType", "projets2");

          uploadFiles(formData, "projets2")
            .then(() => {
              toast.success("Projet et fichiers enregistrés avec succès !");
            })
            .catch((error) => {
              toast.error(
                error.response?.data?.message || "Une erreur est survenue."
              );
            });
        } else {
          toast.success("Projet enregistré sans fichiers.");
        }

        logAction({
          action: "ADD_PROJECT",
          translated_action: "Ajout de projet",
          entity_type: "project2",
          entity_id: newProjectId,
          message: `a ajouté(e) le projet avec l'index : ${data.project.index}`,
        }).then(() => {
          setTimeout(() => {
            navigate(`/e-archive-18-2022/${newProjectId}`);
          }, 3000);
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

  if (loading) return <></>;

  return (
    <Layout>
      <div className="container py-6">
        <form onSubmit={handleSubmit}>
          <Card className="shadow-sm overflow-hidden gap-0 !py-0">
            <div className="bg-gradient-to-r from-gray-50 to-white border-b">
              <CardHeader className="pb-4 pt-6">
                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    className="h-7 text-xs"
                  >
                    <ArrowLeft className="h-3 w-3 mr-1" />
                    Retour
                  </Button>
                  <CardTitle className="text-lg font-medium">
                    Ajouter un nouveau projet
                  </CardTitle>
                </div>
              </CardHeader>
            </div>
            <CardContent className="p-4 bg-white">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-0">
                <div className="space-y-1 p-2 rounded-md">
                  <Label htmlFor="index" className="text-xs font-medium">
                    Indice <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="index"
                    value={formData.index}
                    onChange={(e) => handleChange("index", e.target.value)}
                    className="h-7 text-xs"
                    required
                  />
                </div>
                <div className="space-y-1 p-2 rounded-md">
                  <Label htmlFor="name" className="text-xs font-medium">
                    Nom
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="h-7 text-xs"
                  />
                </div>
                <div className="space-y-1 p-2 rounded-md">
                  <Label htmlFor="type" className="text-xs font-medium">
                    Type d'ouvrage / Réseau
                  </Label>
                  <Input
                    id="type"
                    value={formData.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                    className="h-7 text-xs"
                  />
                </div>
                <div className="space-y-1 p-2 rounded-md">
                  <Label htmlFor="year" className="text-xs font-medium">
                    Année
                  </Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.year}
                    onChange={(e) => handleChange("year", e.target.value)}
                    className="h-7 text-xs"
                  />
                </div>
                <div className="space-y-1 p-2 rounded-md">
                  <Label htmlFor="secteur" className="text-xs font-medium">
                    Secteur
                  </Label>
                  <Input
                    id="secteur"
                    value={formData.secteur}
                    onChange={(e) => handleChange("secteur", e.target.value)}
                    className="h-7 text-xs"
                  />
                </div>
                <div className="space-y-1 p-2 rounded-md">
                  <Label htmlFor="mappe" className="text-xs font-medium">
                    Mappe
                  </Label>
                  <Input
                    id="mappe"
                    value={formData.mappe}
                    onChange={(e) => handleChange("mappe", e.target.value)}
                    className="h-7 text-xs"
                  />
                </div>
                <div className="space-y-1 p-2 rounded-md">
                  <Label htmlFor="producer" className="text-xs font-medium">
                    Réalisateur
                  </Label>
                  <Input
                    id="producer"
                    value={formData.producer}
                    onChange={(e) => handleChange("producer", e.target.value)}
                    className="h-7 text-xs"
                  />
                </div>
                <div className="space-y-1 p-2 rounded-md">
                  <Label htmlFor="scale" className="text-xs font-medium">
                    Echelle
                  </Label>
                  <Input
                    id="scale"
                    value={formData.scale}
                    onChange={(e) => handleChange("scale", e.target.value)}
                    className="h-7 text-xs"
                  />
                </div>
                <div className="space-y-1 p-2 rounded-md">
                  <Label htmlFor="sheet" className="text-xs font-medium">
                    Feuille
                  </Label>
                  <Input
                    id="sheet"
                    value={formData.sheet}
                    onChange={(e) => handleChange("sheet", e.target.value)}
                    className="h-7 text-xs"
                  />
                </div>
                <div className="space-y-1 p-2 rounded-md">
                  <Label htmlFor="salle" className="text-xs font-medium">
                    Salle
                  </Label>
                  <Input
                    id="salle"
                    value={formData.salle}
                    onChange={(e) => handleChange("salle", e.target.value)}
                    className="h-7 text-xs"
                  />
                </div>
                <div className="space-y-1 p-2 rounded-md">
                  <Label htmlFor="tranche" className="text-xs font-medium">
                    Tranche d'irrigation
                  </Label>
                  <Input
                    id="tranche"
                    value={formData.tranche}
                    onChange={(e) => handleChange("tranche", e.target.value)}
                    className="h-7 text-xs"
                  />
                </div>
                <div className="space-y-1 p-2 rounded-md">
                  <Label htmlFor="nature" className="text-xs font-medium">
                    Nature du plan
                  </Label>
                  <Input
                    id="nature"
                    value={formData.nature}
                    onChange={(e) => handleChange("nature", e.target.value)}
                    className="h-7 text-xs"
                  />
                </div>
              </div>
              {/* Section pour télécharger des fichiers */}
              <div className="mt-6 border rounded-md p-4">
                <h3 className="text-sm font-medium mb-2">Fichiers attachés</h3>
                <div className="space-y-2 mb-4">
                  {selectedFiles.length > 0 ? (
                    selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-muted/20 p-2 rounded-md"
                      >
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-blue-500" />
                          <span className="text-xs">{file.name}</span>
                          <Badge
                            variant="outline"
                            className="ml-2 text-[10px] py-0 px-1 h-4"
                          >
                            {(file.size / 1024).toFixed(0)} KB
                          </Badge>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4 px-4 text-center border-2 border-dashed rounded-md">
                      <File className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        Aucun fichier attaché
                      </p>
                    </div>
                  )}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleFileUpload}
                  className="h-7 text-xs w-full"
                >
                  <Upload className="h-3 w-3 mr-1" />
                  Ajouter des fichiers
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  className="hidden"
                  multiple
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end !p-3 bg-gray-50 border-t">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="h-7 text-xs"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  className="flex items-center gap-1 h-7 text-xs bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600"
                >
                  <Save className="h-3 w-3" />
                  Enregistrer
                </Button>
              </div>
            </CardFooter>
          </Card>
        </form>
      </div>
    </Layout>
  );
}
