import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FileText, XCircle, ArrowLeft, Eye, Clock } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { fetchRejectedProjects } from "@/api/projects";
import Layout from "@/components/layout";

export default function HistoriquePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [projects, setProjects] = useState(null);
  const [filteredProjects, setFilteredProjects] = useState(null);

  useEffect(() => {
    fetchRejectedProjects()
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
          project.index.toLowerCase().includes(searchQuery.toLowerCase()) ||
          project.motif.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredProjects(filtered);
    }
  }, [searchQuery, projects]);

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

  if (loading) return <Layout></Layout>;

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
            <div>
              <h1 className="text-3xl font-bold">
                Historique des projets rejetés
              </h1>
              <p className="text-muted-foreground mt-1">
                Consultez les projets qui ont été rejetés et les motifs de refus
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
          <div className="w-full">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <Badge
                  variant="outline"
                  className="bg-red-100 text-red-700 border-red-200 py-1 px-3 text-sm"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  <span>{filteredProjects.length} projets rejetés</span>
                </Badge>
              </div>
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
            <div className="mt-0">{renderProjectsList(filteredProjects)}</div>
          </div>
        </div>
      </div>
    </Layout>
  );

  // Fonction pour rendre la liste des projets
  function renderProjectsList(projects) {
    if (projects.length === 0) {
      return (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="bg-muted/30 rounded-full p-6 mb-4">
              <FileText className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              Aucun projet rejeté trouvé
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              Aucun projet ne correspond à vos critères de recherche. Essayez de
              modifier vos filtres.
            </p>
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          return (
            <Card
              key={project.id}
              className="overflow-hidden hover:shadow-sm transition-all gap-0 !py-4"
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3
                      className="font-medium line-clamp-2 mb-1"
                      title={project.name}
                    >
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="bg-red-50 text-red-700 border-red-200 text-xs"
                      >
                        Rejeté
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
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDate(project.created_at).split(" à")[0]}
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs mb-3">
                  <div className="flex items-center">
                    <span className="text-muted-foreground mr-1">Indice:</span>
                    <span>{project.index}</span>
                  </div>
                </div>

                {project.motif.trim() !== "" && (
                  <div className="bg-red-50 border border-red-100 rounded p-2 mb-3">
                    <p
                      className="text-xs text-red-700 line-clamp-2"
                      title={project.motif}
                    >
                      <span className="font-medium">Motif: </span>
                      {project.motif}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarFallback className="bg-red-100 text-red-700 text-[10px]">
                        {project.fullname
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs">{project.fullname}</span>
                  </div>

                  <Button
                    variant="outline"
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
                    Détails
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }
}
