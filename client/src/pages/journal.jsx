import { useState, useEffect } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Link } from "react-router-dom";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  FileText,
  FilePlus,
  FileX,
  Edit,
  CheckCircle,
  XCircle,
  UserCog,
  LogIn,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchLogs } from "@/api/logs";
import Layout from "@/components/layout";

export default function JournalPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage, setLogsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLogs({
      page: currentPage,
      limit: logsPerPage,
      searchQuery,
    })
      .then((data) => {
        setIsLoading(false);
        setLogs(data.logs);
        setTotalPages(Math.ceil(data.total / logsPerPage));
        setTotal(data.total);
      })
      .catch((error) => {
        setIsLoading(false);
        setLogs([]);
        setTotalPages(0);
        setTotal(0);
        console.log(error.message);
      });
  }, [currentPage, searchQuery, logsPerPage]);

  // Navigation functions
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPreviousPage = () =>
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNextPage = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "d MMMM yyyy 'à' HH:mm", {
        locale: fr,
      });
    } catch (error) {
      return dateString;
    }
  };

  const getActionIcon = (action) => {
    switch (action) {
      case "CREATE_PROJECT":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "UPDATE_PROJECT":
        return <Edit className="h-5 w-5 text-amber-500" />;
      case "UPLOAD_FILE":
        return <FilePlus className="h-5 w-5 text-green-500" />;
      case "DELETE_FILE":
        return <FileX className="h-5 w-5 text-red-500" />;
      case "APPROVE_PROJECT":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "REJECT_PROJECT":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "UPDATE_USER":
        return <UserCog className="h-5 w-5 text-purple-500" />;
      case "LOGIN":
        return <LogIn className="h-5 w-5 text-blue-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActionBadgeColor = (action) => {
    switch (action) {
      case "CREATE_PROJECT":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "UPDATE_PROJECT":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "UPLOAD_FILE":
        return "bg-green-100 text-green-800 border-green-200";
      case "DELETE_FILE":
        return "bg-red-100 text-red-800 border-red-200";
      case "APPROVE_PROJECT":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "REJECT_PROJECT":
        return "bg-rose-100 text-rose-800 border-rose-200";
      case "UPDATE_USER":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "LOGIN":
        return "bg-sky-100 text-sky-800 border-sky-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Journal d'activité</h1>
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher dans le journal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        {isLoading ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="h-12 w-12 rounded-full border-4 border-muted border-t-primary animate-spin mb-4" />
              <p className="text-lg font-medium mb-2">
                Chargement des activités...
              </p>
              <p className="text-muted-foreground text-center max-w-md">
                Veuillez patienter pendant que nous récupérons les données du
                journal.
              </p>
            </CardContent>
          </Card>
        ) : logs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium mb-2">
                Aucune activité trouvée
              </p>
              <p className="text-muted-foreground text-center max-w-md">
                Aucune activité ne correspond à votre recherche. Essayez de
                modifier vos critères de recherche.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {logs.map((log, index) => (
              <Card
                key={`${log.action}-${log.created_at}-${index}`}
                className="overflow-hidden"
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-muted/30 p-2 rounded-full">
                      {getActionIcon(log.action)}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <Badge
                          variant="outline"
                          className={`${getActionBadgeColor(log.action)}`}
                        >
                          {log.translated_action}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-gray-100 text-gray-800 border-gray-200"
                        >
                          {log.user}
                        </Badge>
                        {log.entity_type.startsWith("project") &&
                          log.action !== "DELETE_PROJECT" &&
                          log.entity_ref && (
                            <Link
                              to={`${
                                log.entity_type == "project"
                                  ? `/e-archive-53-2023/${log.entity_id}`
                                  : `/e-archive-18-2022/${log.entity_id}`
                              }`}
                            >
                              <Badge
                                variant="outline"
                                className={`${
                                  log.entity_type == "project"
                                    ? "bg-blue-50 text-blue-800 border-blue-200"
                                    : "bg-violet-50 text-violet-800 border-violet-200"
                                }`}
                              >
                                {log.entity_type == "project"
                                  ? `E-Archive 53-2023 / ${log.entity_ref}`
                                  : `E-Archive 18-2022 / ${log.entity_ref}`}
                              </Badge>
                            </Link>
                          )}
                      </div>
                      <p className="text-base">
                        {log.user} {log.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        le {formatDate(log.created_at)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  Lignes par page:
                </span>
                <Select
                  value={logsPerPage.toString()}
                  onValueChange={(value) => {
                    setLogsPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={logsPerPage} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-muted-foreground">
                Affichage de{" "}
                {total > 0 ? (currentPage - 1) * logsPerPage + 1 : 0} à{" "}
                {Math.min(currentPage * logsPerPage, total)} sur {total}{" "}
                activités
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={goToFirstPage}
                  disabled={currentPage === 1 || isLoading}
                >
                  <ChevronsLeft className="h-4 w-4" />
                  <span className="sr-only">Première page</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1 || isLoading}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Page précédente</span>
                </Button>
                <div className="text-sm">
                  Page {currentPage} sur {totalPages || 1}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={goToNextPage}
                  disabled={
                    currentPage === totalPages || totalPages === 0 || isLoading
                  }
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Page suivante</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={goToLastPage}
                  disabled={
                    currentPage === totalPages || totalPages === 0 || isLoading
                  }
                >
                  <ChevronsRight className="h-4 w-4" />
                  <span className="sr-only">Dernière page</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
