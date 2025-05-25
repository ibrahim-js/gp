import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  CheckCircle,
  XCircle,
  FileText,
  Clock,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Eye,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Layout from "@/components/layout";
import {
  approveProjectApi,
  fetchPendingProjects,
  rejectProjectApi,
} from "@/api/projects";
import { toast } from "sonner";
import { logAction } from "@/api/logs";
import { useAuth } from "@/hooks/auth";

export default function PendingProjectsPage() {
  const navigate = useNavigate();
  const { user, loading: userLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingProjects()
      .then((data) => {
        setProjects(data);
        setFilteredProjects(data);
        setLoading(false);
      })
      .catch((err) => {
        setProjects([]);
        setFilteredProjects([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(
        (project) =>
          project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.index.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProjects(filtered);
    }
  }, [searchQuery, projects]);

  // Ouvrir la boîte de dialogue d'approbation
  const openApproveDialog = (project) => {
    setSelectedProject(project);
    setIsApproveDialogOpen(true);
  };

  // Ouvrir la boîte de dialogue de rejet
  const openRejectDialog = (project) => {
    setSelectedProject(project);
    setIsRejectDialogOpen(true);
  };

  // Approuver un projet
  const approveProject = () => {
    if (!selectedProject) return;

    setIsProcessing(true);

    approveProjectApi({ id: selectedProject.id, type: selectedProject.type })
      .then((data) => {
        setProjects(data.projects);
        setIsApproveDialogOpen(false);
        setSelectedProject(null);
        setIsProcessing(false);
        toast.success(data.message);

        logAction({
          action: "APPROVE_PROJECT",
          translated_action: "Approbation de projet",
          entity_type:
            selectedProject.type == "projets" ? "project" : "project2",
          entity_id: selectedProject.id,
          message: `${user.fname} ${user.lname} a approuvé le projet avec l'index : ${selectedProject.index}.`,
        });
      })
      .catch((err) => {
        setIsProcessing(false);
        toast.error(err?.response?.data?.message || "Erreur !");
      });
  };

  // Rejeter un projet
  const rejectProject = () => {
    if (!selectedProject) return;

    setIsProcessing(true);

    rejectProjectApi({
      id: selectedProject.id,
      type: selectedProject.type,
      motif: rejectReason,
    })
      .then((data) => {
        setProjects(data.projects);
        setIsRejectDialogOpen(false);
        setSelectedProject(null);
        setRejectReason("");
        setIsProcessing(false);
        toast.success(data.message);

        logAction({
          action: "REFUSE_PROJECT",
          translated_action: "Refus de projet",
          entity_type:
            selectedProject.type == "projets" ? "project" : "project2",
          entity_id: selectedProject.id,
          message: `${user.fname} ${
            user.lname
          } a refusé le projet avec l'index : ${selectedProject.index}. ${
            rejectReason.trim() != "" ? `Motif: ${rejectReason}` : ""
          }`,
        });
      })
      .catch((err) => {
        setIsProcessing(false);
        toast.error(err?.response?.data?.message || "Erreur !");
      });
  };

  // Formater la date
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "d MMMM yyyy à HH:mm", {
        locale: fr,
      });
    } catch (error) {
      return dateString;
    }
  };

  if (loading || userLoading) return <Layout></Layout>;

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <h1 className="text-3xl font-bold">
              Tous les projets en attente d'approbation
            </h1>
          </div>
        </div>
        <div className="flex items-center mb-6">
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-700 border-blue-200 py-1 px-3 text-sm"
          >
            <Clock className="h-4 w-4 mr-2" />
            <span>{projects.length} projets en attente</span>
          </Badge>
        </div>
        <div className="flex justify-end mb-6">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un projet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        {filteredProjects.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="bg-muted/30 rounded-full p-6 mb-4">
                <FileText className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">
                Aucun projet en attente
              </h3>
              <p className="text-muted-foreground mb-6 max-w-md">
                Tous les projets ont été traités. Les nouveaux projets soumis
                apparaîtront ici pour approbation.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              return (
                <Card
                  key={project.id}
                  className="overflow-hidden hover:shadow-sm transition-all"
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3
                          className="font-medium line-clamp-1 mb-1"
                          title={project.name}
                        >
                          {project.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="bg-amber-50 text-amber-700 border-amber-200 text-xs"
                          >
                            En attente
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`${
                              project.type === "projets"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-purple-50 text-purple-700"
                            } text-xs`}
                          >
                            {project.type === "projets"
                              ? "E-Archive 53-2023"
                              : "E-Archive 18-2022"}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(project.created_at).split(" à")[0]}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs mb-4">
                      <div className="flex items-center">
                        <span className="text-muted-foreground mr-1">
                          Indice:
                        </span>
                        <span>{project.index}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                          <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                            {project.fullname
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs">{project.fullname}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2"
                          onClick={() =>
                            navigate(
                              `/${
                                project.type == "projets"
                                  ? "e-archive-53-2023"
                                  : "e-archive-18-2022"
                              }/${project.id}`
                            )
                          }
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          Voir
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 border-red-100 text-red-600 hover:bg-red-50"
                          onClick={() => openRejectDialog(project)}
                        >
                          <ThumbsDown className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          className="h-7 px-2 bg-green-600 hover:bg-green-700"
                          onClick={() => openApproveDialog(project)}
                        >
                          <ThumbsUp className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
        {/* Dialogue d'approbation */}
        <Dialog
          open={isApproveDialogOpen}
          onOpenChange={setIsApproveDialogOpen}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Approuver le projet</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir approuver ce projet ? Il sera visible
                dans la liste des projets.
              </DialogDescription>
            </DialogHeader>
            {selectedProject && (
              <div className="py-4">
                <Alert className="bg-green-50 border-green-200 text-green-800">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Confirmation d'approbation</AlertTitle>
                  <AlertDescription>
                    Vous êtes sur le point d'approuver le projet "
                    {selectedProject.name}".
                  </AlertDescription>
                </Alert>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsApproveDialogOpen(false)}
                disabled={isProcessing}
              >
                Annuler
              </Button>
              <Button
                onClick={approveProject}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Confirmer l'approbation
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Dialogue de rejet */}
        <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Refuser le projet</DialogTitle>
              <DialogDescription>
                Vous pouvez fournir un motif de refus (optionnel).
              </DialogDescription>
            </DialogHeader>
            {selectedProject && (
              <div className="py-4">
                <Alert className="bg-red-50 border-red-200 text-red-800 mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Confirmation de rejet</AlertTitle>
                  <AlertDescription>
                    Vous êtes sur le point de refuser le projet "
                    {selectedProject.name}".
                  </AlertDescription>
                </Alert>
                <div className="space-y-2">
                  <Label htmlFor="reject-reason">
                    Motif de refus (optionnel)
                  </Label>
                  <Input
                    id="reject-reason"
                    placeholder="Motif de refus (optionnel)..."
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsRejectDialogOpen(false)}
                disabled={isProcessing}
              >
                Annuler
              </Button>
              <Button
                onClick={rejectProject}
                variant="destructive"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Confirmer le rejet
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
