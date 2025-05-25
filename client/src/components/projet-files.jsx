import { useState, useRef, useEffect } from "react";
import {
  Eye,
  Download,
  Trash2,
  Upload,
  FileText,
  FileSpreadsheet,
  FileIcon as FilePresentation,
  ImageIcon,
  Archive,
  DraftingCompass,
  File,
  Plus,
  EyeOff,
  X,
} from "lucide-react";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getFileIcon, getFileColor } from "@/lib/data";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  deleteProjectFile,
  fetchProjectFiles,
  uploadFiles,
} from "@/api/projects";
import { logAction } from "@/api/logs";
import { useAuth } from "@/hooks/auth";

export function ProjectFiles({ projectId, projectIndex }) {
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [files, setFiles] = useState([]);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [currentPdfFile, setCurrentPdfFile] = useState(null);
  const fileInputRef = useRef(null);
  const { user, loading: userLoading } = useAuth();

  const handleViewFile = (file) => {
    setCurrentPdfFile(file);
    setIsPdfModalOpen(true);

    logAction({
      action: "VIEW_FILE",
      translated_action: "Consultation du fichier",
      entity_type: "project",
      entity_id: projectId,
      message: `${user.fname} ${user.lname} a consulté le fichier ${file.name}`,
    });
  };

  const handleDownloadFile = (file) => {
    const link = document.createElement("a");
    link.href = `${import.meta.env.VITE_BASE_API_URL}/files/projets/${
      file.name
    }`;
    link.setAttribute("download", file.name);
    if (
      file.extension_type
        .split(".")
        [file.extension_type.split(".").length - 1].toUpperCase() == "PDF"
    ) {
      link.setAttribute("target", "_blank");
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    logAction({
      action: "DOWNLOAD_FILE",
      translated_action: "Téléchargement du fichier",
      entity_type: "project",
      entity_id: projectId,
      message: `${user.fname} ${user.lname} a téléchargé le fichier ${file.name}`,
    });
  };

  const handleDeleteFile = (fileId) => {
    const file = files.find((file) => file.id == fileId);
    if (
      !confirm(`${file.name} - Êtes-vous sûr de vouloir supprimer ce fichier ?`)
    )
      return;

    deleteProjectFile(fileId)
      .then((data) => {
        toast.success(data.message);

        setFiles(files.filter((file) => file.id !== fileId));

        logAction({
          action: "DELETE_FILE",
          translated_action: "Suppression du fichier",
          entity_type: "project",
          entity_id: projectId,
          message: `${user.fname} ${user.lname} a supprimé le fichier ${file.name}`,
        });
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message || "Une erreur est survenue."
        );
      });
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

  const handleUploadSelectedFiles = () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast.info(
        "Veuillez sélectionner au moins un fichier avant de téléverser."
      );
      return;
    }

    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    formData.append("projectId", projectId);
    formData.append("userId", "1");
    formData.append("projectType", "projets");

    uploadFiles(formData, "projets")
      .then((data) => {
        toast.success(data.message);

        setFiles(data.files);

        setSelectedFiles([]);

        logAction({
          action: "UPLOAD_FILE",
          translated_action: "Ajout de fichier(s)",
          entity_type: "project",
          entity_id: projectId,
          message: `${user.fname} ${user.lname} a ajouté un ou plusieurs fichier(s) au projet avec l'index : ${projectIndex}`,
        });
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message || "Une erreur est survenue."
        );
      });
  };

  const getFileIconComponent = (extensionType) => {
    const iconName = getFileIcon(extensionType);
    const colorClass = getFileColor(extensionType);

    switch (iconName) {
      case "file-text":
        return <FileText className={`h-4 w-4 ${colorClass}`} />;
      case "file-spreadsheet":
        return <FileSpreadsheet className={`h-4 w-4 ${colorClass}`} />;
      case "file-presentation":
        return <FilePresentation className={`h-4 w-4 ${colorClass}`} />;
      case "image":
        return <ImageIcon className={`h-4 w-4 ${colorClass}`} />;
      case "archive":
        return <Archive className={`h-4 w-4 ${colorClass}`} />;
      case "drafting-compass":
        return <DraftingCompass className={`h-4 w-4 ${colorClass}`} />;
      default:
        return <File className={`h-4 w-4 ${colorClass}`} />;
    }
  };

  useEffect(() => {
    fetchProjectFiles(projectId)
      .then((data) => {
        setLoading(false);
        setFiles(data);
      })
      .catch((error) => {
        setLoading(false);
        setFiles([]);
      });
  }, [projectId]);

  useEffect(() => {
    if (isPdfModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isPdfModalOpen]);

  if (loading || userLoading) return <></>;

  return (
    <Card className="mt-4 shadow-none border-0 gap-0">
      <CardHeader className="!pb-3 !pt-5 !px-5">
        <CardTitle className="text-base font-medium">
          Fichiers attachés
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {files.length === 0 ? (
          <div className="flex flex-col">
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                Aucun fichier attaché à ce projet
              </p>
            </div>
            {selectedFiles.length > 0 && (
              <div className="mt-4 px-4">
                <div className="bg-muted/20 p-3 rounded-md">
                  <div className="text-xs font-medium mb-2">
                    Fichiers sélectionnés ({selectedFiles.length})
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center text-xs">
                        <File className="h-3 w-3 mr-2 text-muted-foreground" />
                        <span className="truncate">{file.name}</span>
                        <span className="ml-2 text-muted-foreground">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 ml-auto"
                          onClick={() =>
                            setSelectedFiles(
                              selectedFiles.filter((_, i) => i !== index)
                            )
                          }
                        >
                          <Trash2 className="h-3 w-3 text-red-500" />
                          <span className="sr-only">Supprimer</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end mt-3">
                    <Button
                      onClick={handleUploadSelectedFiles}
                      size="sm"
                      className="h-7 text-xs"
                    >
                      <Upload className="h-3 w-3 mr-1" />
                      Téléverser
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {["admin", "editor"].includes(user.role) && (
              <div className="flex justify-center mt-6 pb-4">
                <Button
                  onClick={handleFileUpload}
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Sélectionner des fichiers
                </Button>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-auto border rounded-md">
              {/* Vue desktop */}
              <div className="hidden md:block">
                <Table className="text-xs">
                  <TableHeader className="bg-muted/30">
                    <TableRow className="bg-muted/30">
                      <TableHead className="w-[50%] py-2">
                        Nom du fichier
                      </TableHead>
                      <TableHead className="w-[30%] py-2">Ajouté par</TableHead>
                      <TableHead className="w-[20%] py-2 text-right pr-4">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {files.map((file) => {
                      const createdAt = file.created_at
                        ? new Date(file.created_at)
                        : null;
                      const readable =
                        file.extension_type
                          .split(".")
                          [
                            file.extension_type.split(".").length - 1
                          ].toUpperCase() == "PDF";

                      return (
                        <TableRow key={file.id} className="hover:bg-muted/10">
                          <TableCell className="py-2">
                            <div className="flex items-center">
                              {getFileIconComponent(
                                file.extension_type.split(".")[
                                  file.extension_type.split(".").length - 1
                                ]
                              )}
                              <span className="ml-2">{file.name}</span>
                              <Badge
                                variant="outline"
                                className="ml-2 text-[10px] py-0 px-1 h-4"
                              >
                                {file.extension_type
                                  .split(".")
                                  [
                                    file.extension_type.split(".").length - 1
                                  ].toUpperCase()}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="py-2">
                            <div>
                              <div className="font-medium">
                                {file.fullname.trim() || "Utilisateur inconnu"}
                              </div>
                              <div className="text-[10px] text-muted-foreground">
                                {createdAt
                                  ? format(createdAt, "d MMM yyyy à HH:mm", {
                                      locale: fr,
                                    })
                                  : "-"}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-2 text-right">
                            <div className="flex justify-end space-x-1">
                              <Button
                                onClick={() => handleViewFile(file)}
                                size="sm"
                                variant="ghost"
                                className={`h-6 w-6 p-0`}
                                disabled={!readable}
                              >
                                {readable ? (
                                  <Eye className="h-3 w-3" />
                                ) : (
                                  <EyeOff className="h-3 w-3" />
                                )}

                                <span className="sr-only">Voir</span>
                              </Button>
                              <Button
                                onClick={() => handleDownloadFile(file)}
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0"
                              >
                                <Download className="h-3 w-3" />
                                <span className="sr-only">Télécharger</span>
                              </Button>
                              {["admin", "editor"].includes(user.role) && (
                                <Button
                                  onClick={() => handleDeleteFile(file.id)}
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="h-3 w-3" />
                                  <span className="sr-only">Supprimer</span>
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Vue mobile */}
              <div className="md:hidden">
                <div className="divide-y">
                  {files.map((file) => {
                    const createdAt = file.created_at
                      ? new Date(file.created_at)
                      : null;
                    const readable =
                      file.extension_type
                        .split(".")
                        [
                          file.extension_type.split(".").length - 1
                        ].toUpperCase() == "PDF";

                    return (
                      <div key={file.id} className="p-3">
                        <div className="flex items-center mb-2">
                          {getFileIconComponent(
                            file.extension_type.split(".")[
                              file.extension_type.split(".").length - 1
                            ]
                          )}
                          <span className="ml-2 font-medium text-xs">
                            {file.name}
                          </span>
                          <Badge
                            variant="outline"
                            className="ml-2 text-[10px] py-0 px-1 h-4"
                          >
                            {file.extension_type
                              .split(".")
                              [
                                file.extension_type.split(".").length - 1
                              ].toUpperCase()}
                          </Badge>
                        </div>
                        <div className="text-[10px] text-muted-foreground mb-2">
                          Ajouté par{" "}
                          {file.fullname.trim() || "Utilisateur inconnu"} le{" "}
                          {createdAt
                            ? format(createdAt, "d MMM yyyy à HH:mm", {
                                locale: fr,
                              })
                            : "-"}{" "}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleViewFile(file)}
                            size="sm"
                            variant="outline"
                            className={`h-6 text-[10px] px-2 py-0 flex-1 ${
                              !readable && "cursor-not-allowed"
                            }`}
                            disabled={!readable}
                          >
                            {readable ? (
                              <Eye className="h-3 w-3 mr-1" />
                            ) : (
                              <EyeOff className="h-3 w-3 mr-1" />
                            )}
                            Voir
                          </Button>
                          <Button
                            onClick={() => handleDownloadFile(file)}
                            size="sm"
                            variant="outline"
                            className="h-6 text-[10px] px-2 py-0 flex-1"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Télécharger
                          </Button>
                          {["admin", "editor"].includes(user.role) && (
                            <Button
                              onClick={() => handleDeleteFile(file.id)}
                              size="sm"
                              variant="outline"
                              className="h-6 text-[10px] px-2 py-0 flex-1 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Supprimer
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            {selectedFiles.length > 0 && (
              <div className="mt-4 px-4">
                <div className="bg-muted/20 p-3 rounded-md">
                  <div className="text-xs font-medium mb-2">
                    Fichiers sélectionnés ({selectedFiles.length})
                  </div>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center text-xs">
                        <File className="h-3 w-3 mr-2 text-muted-foreground" />
                        <span className="truncate">{file.name}</span>
                        <span className="ml-2 text-muted-foreground">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 ml-auto"
                          onClick={() =>
                            setSelectedFiles(
                              selectedFiles.filter((_, i) => i !== index)
                            )
                          }
                        >
                          <Trash2 className="h-3 w-3 text-red-500" />
                          <span className="sr-only">Supprimer</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end mt-3">
                    <Button
                      onClick={handleUploadSelectedFiles}
                      size="sm"
                      className="h-7 text-xs"
                    >
                      <Upload className="h-3 w-3 mr-1" />
                      Téléverser
                    </Button>
                  </div>
                </div>
              </div>
            )}
            {["admin", "editor"].includes(user.role) && (
              <div className="flex justify-center mt-6 pb-4">
                <Button
                  onClick={handleFileUpload}
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Sélectionner des fichiers
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
      {["admin", "editor"].includes(user.role) && (
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          className="hidden"
          multiple
        />
      )}
      {/* PDF Viewer Modal */}
      {isPdfModalOpen && (
        <div className="fixed z-1000 inset-0 bg-black/30 flex items-center justify-center overflow-hidden">
          <div className="bg-white border shadow-lg w-[90%] rounded-xl">
            <div className="border-b p-3 text-sm font-medium flex items-center justify-between">
              Visualisation du fichier {currentPdfFile.name}
              <Button variant="ghost" onClick={() => setIsPdfModalOpen(false)}>
                <X className="h-3 w-3" />
              </Button>
            </div>

            <div className="w-full overflow-hidden h-[80vh] border-b">
              {currentPdfFile && (
                <iframe
                  src={`${import.meta.env.VITE_BASE_API_URL}/files/projets/${
                    currentPdfFile.name
                  }`}
                  className="w-full h-full"
                  title={currentPdfFile.name}
                />
              )}
            </div>

            <div className="flex items-center justify-end p-2">
              <Button
                size="sm"
                onClick={() => setIsPdfModalOpen(false)}
                className="h-8 text-xs"
              >
                Fermer
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
