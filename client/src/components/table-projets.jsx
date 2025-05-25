import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Columns, Search, X, ChevronLeft, ChevronRight } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { getStatusColor, formatText, availableColumns } from "@/lib/data";
import { fetchProjects } from "@/api/projects";

export function TableProjets() {
  const navigate = useNavigate();
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [visibleColumns, setVisibleColumns] = useState(
    availableColumns.filter((col) => col.defaultVisible).map((col) => col.id)
  );
  const [showFilters, setShowFilters] = useState(false);
  const [columnsPopoverOpen, setColumnsPopoverOpen] = useState(false);
  const [filters, setFilters] = useState({
    index: "",
    epi: "",
    ar: "",
    et: "",
    nbr_boite: "",
    name_project: "",
    etude: "",
    date: "",
    secteur: "",
    ti: "",
    name_document: "",
    nbr_document_a3: "",
    nbr_document_a4: "",
    nbr_plan: "",
    type_document_a3: "",
    type_document_a4: "",
    type_document_a0: "",
    nbr_copy: "",
    nbr_exemplaire: "",
    nbr_folder: "",
    salle: "",
  });

  const navigateToProjectDetails = (projectId) => {
    navigate(`/e-archive-53-2023/${projectId}`);
  };

  const handleFilterChange = (column, value) => {
    setFilters((prev) => ({
      ...prev,
      [column]: value,
    }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      id: "",
      index: "",
      epi: "",
      ar: "",
      et: "",
      nbr_boite: "",
      name_project: "",
      etude: "",
      date: "",
      secteur: "",
      ti: "",
      name_document: "",
      nbr_document_a3: "",
      nbr_document_a4: "",
      nbr_plan: "",
      type_document_a3: "",
      type_document_a4: "",
      type_document_a0: "",
      nbr_copy: "",
      nbr_exemplaire: "",
      nbr_folder: "",
      salle: "",
    });
    setCurrentPage(1);
  };

  const toggleColumnVisibility = (columnId) => {
    setVisibleColumns((prev) => {
      if (prev.includes(columnId)) {
        return prev.filter((id) => id !== columnId);
      } else {
        return [...prev, columnId];
      }
    });
  };

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  useEffect(() => {
    try {
      fetchProjects({ page: currentPage, limit: 10, filters }).then((data) => {
        setProjets(data.projets);
        setLoading(false);
        setTotalPages(Math.ceil(data.total / 10));
        setTotalRecords(data.total);
      });
    } catch (error) {
      setProjets([]);
      setLoading(false);
    }
  }, [currentPage, filters]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1 h-7 text-xs ${
              showFilters && "bg-black"
            }`}
          >
            <Search className="h-3 w-3" />
            <span>Filtres</span>
            {hasActiveFilters && (
              <Badge className="ml-1 h-4 w-4 p-0 text-white bg-black flex items-center justify-center text-[10px]">
                !
              </Badge>
            )}
          </Button>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="flex items-center gap-1 h-7 text-xs"
            >
              <X className="h-3 w-3" />
              <span>Réinitialiser</span>
            </Button>
          )}
        </div>

        <Popover open={columnsPopoverOpen} onOpenChange={setColumnsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 h-7 text-xs"
            >
              <Columns className="h-3 w-3" />
              <span>Colonnes</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0 bg-white z-10" align="end">
            <div className="p-2 border-b">
              <h4 className="font-medium text-sm">
                Afficher/Masquer les colonnes
              </h4>
              <p className="text-xs text-muted-foreground">
                Sélectionnez les colonnes à afficher dans le tableau
              </p>
            </div>
            <div className="p-4 pt-0 max-h-[60vh] overflow-auto">
              <div className="grid gap-2 py-2">
                {availableColumns.map((column) => (
                  <div key={column.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`column-${column.id}`}
                      checked={visibleColumns.includes(column.id)}
                      onCheckedChange={() => toggleColumnVisibility(column.id)}
                      className="h-3 w-3"
                    />
                    <Label
                      htmlFor={`column-${column.id}`}
                      className="text-xs cursor-pointer"
                    >
                      {column.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {showFilters && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 p-3 bg-muted/20 rounded-md">
          <div>
            <label
              htmlFor="filter-index"
              className="text-[10px] font-medium block mb-1"
            >
              Indice
            </label>
            <Input
              id="filter-index"
              placeholder="Filtrer par indice..."
              value={filters.index}
              onChange={(e) => handleFilterChange("index", e.target.value)}
              className="h-6 text-[11px] placeholder:text-[11px] leading-[11px] !pb-2"
            />
          </div>
          <div>
            <label
              htmlFor="filter-epi"
              className="text-[10px] font-medium block mb-1"
            >
              EPI
            </label>
            <Input
              id="filter-epi"
              placeholder="Filtrer par EPI..."
              value={filters.epi}
              onChange={(e) => handleFilterChange("epi", e.target.value)}
              className="h-6 text-[11px] placeholder:text-[11px] leading-[11px] !pb-2"
            />
          </div>
          <div>
            <label
              htmlFor="filter-ar"
              className="text-[10px] font-medium block mb-1"
            >
              AR
            </label>
            <Input
              id="filter-ar"
              placeholder="Filtrer par AR..."
              value={filters.ar}
              onChange={(e) => handleFilterChange("ar", e.target.value)}
              className="h-6 text-[11px] placeholder:text-[11px] leading-[11px] !pb-2"
            />
          </div>
          <div>
            <label
              htmlFor="filter-et"
              className="text-[10px] font-medium block mb-1"
            >
              ET
            </label>
            <Input
              id="filter-et"
              placeholder="Filtrer par ET..."
              value={filters.et}
              onChange={(e) => handleFilterChange("et", e.target.value)}
              className="h-6 text-[11px] placeholder:text-[11px] leading-[11px] !pb-2"
            />
          </div>
          <div>
            <label
              htmlFor="filter-nbr_boite"
              className="text-[10px] font-medium block mb-1"
            >
              N° Boite
            </label>
            <Input
              id="filter-nbr_boite"
              placeholder="Filtrer par N° boite..."
              value={filters.nbr_boite}
              onChange={(e) => handleFilterChange("nbr_boite", e.target.value)}
              className="h-6 text-[11px] placeholder:text-[11px] leading-[11px] !pb-2"
            />
          </div>
          <div>
            <label
              htmlFor="filter-name_project"
              className="text-[10px] font-medium block mb-1"
            >
              Intitulé du projet
            </label>
            <Input
              id="filter-name_project"
              placeholder="Filtrer par intitulé..."
              value={filters.name_project}
              onChange={(e) =>
                handleFilterChange("name_project", e.target.value)
              }
              className="h-6 text-[11px] placeholder:text-[11px] leading-[11px] !pb-2"
            />
          </div>
          <div>
            <label
              htmlFor="filter-etude"
              className="text-[10px] font-medium block mb-1"
            >
              Étude
            </label>
            <Input
              id="filter-etude"
              placeholder="Filtrer par étude..."
              value={filters.etude}
              onChange={(e) => handleFilterChange("etude", e.target.value)}
              className="h-6 text-[11px] placeholder:text-[11px] leading-[11px] !pb-2"
            />
          </div>
          <div>
            <label
              htmlFor="filter-date"
              className="text-[10px] font-medium block mb-1"
            >
              Date
            </label>
            <Input
              id="filter-date"
              placeholder="Filtrer par date..."
              value={filters.id}
              onChange={(e) => handleFilterChange("date", e.target.value)}
              className="h-6 text-[11px] placeholder:text-[11px] leading-[11px] !pb-2"
            />
          </div>
          <div>
            <label
              htmlFor="filter-secteur"
              className="text-[10px] font-medium block mb-1"
            >
              Secteur
            </label>
            <Input
              id="filter-secteur"
              placeholder="Filtrer par secteur..."
              value={filters.secteur}
              onChange={(e) => handleFilterChange("secteur", e.target.value)}
              className="h-6 text-[11px] placeholder:text-[11px] leading-[11px] !pb-2"
            />
          </div>
          <div>
            <label
              htmlFor="filter-ti"
              className="text-[10px] font-medium block mb-1"
            >
              TI
            </label>
            <Input
              id="filter-ti"
              placeholder="Filtrer par TI..."
              value={filters.ti}
              onChange={(e) => handleFilterChange("ti", e.target.value)}
              className="h-6 text-[11px] placeholder:text-[11px] leading-[11px] !pb-2"
            />
          </div>
          <div>
            <label
              htmlFor="filter-name_document"
              className="text-[10px] font-medium block mb-1"
            >
              Titre du document
            </label>
            <Input
              id="filter-name_document"
              placeholder="Filtrer par titre..."
              value={filters.name_document}
              onChange={(e) =>
                handleFilterChange("name_document", e.target.value)
              }
              className="h-6 text-[11px] placeholder:text-[11px] leading-[11px] !pb-2"
            />
          </div>
          <div>
            <label
              htmlFor="filter-nbr_document_a3"
              className="text-[10px] font-medium block mb-1"
            >
              Nbre des documents A3
            </label>
            <Input
              id="filter-nbr_document_a3"
              placeholder="Filtrer..."
              value={filters.nbr_document_a3}
              onChange={(e) =>
                handleFilterChange("nbr_document_a3", e.target.value)
              }
              className="h-6 text-[11px] placeholder:text-[11px] leading-[11px] !pb-2"
            />
          </div>
          <div>
            <label
              htmlFor="filter-nbr_document_a4"
              className="text-[10px] font-medium block mb-1"
            >
              Nbre des documents A4
            </label>
            <Input
              id="filter-nbr_document_a4"
              placeholder="Filtrer..."
              value={filters.nbr_document_a4}
              onChange={(e) =>
                handleFilterChange("nbr_document_a4", e.target.value)
              }
              className="h-6 text-[11px] placeholder:text-[11px] leading-[11px] !pb-2"
            />
          </div>
          <div>
            <label
              htmlFor="filter-nbr_plan"
              className="text-[10px] font-medium block mb-1"
            >
              Nbre des plans
            </label>
            <Input
              id="filter-nbr_plan"
              placeholder="Filtrer..."
              value={filters.nbr_plan}
              onChange={(e) => handleFilterChange("nbr_plan", e.target.value)}
              className="h-6 text-[11px] placeholder:text-[11px] leading-[11px] !pb-2"
            />
          </div>
          <div>
            <label
              htmlFor="filter-type_document_a3"
              className="text-[10px] font-medium block mb-1"
            >
              Type de document A3
            </label>
            <Input
              id="filter-type_document_a3"
              placeholder="Filtrer..."
              value={filters.type_document_a3}
              onChange={(e) =>
                handleFilterChange("type_document_a3", e.target.value)
              }
              className="h-6 text-[11px] placeholder:text-[11px] leading-[11px] !pb-2"
            />
          </div>
          <div>
            <label
              htmlFor="filter-type_document_a4"
              className="text-[10px] font-medium block mb-1"
            >
              Type de document A4
            </label>
            <Input
              id="filter-type_document_a4"
              placeholder="Filtrer..."
              value={filters.type_document_a4}
              onChange={(e) =>
                handleFilterChange("type_document_a4", e.target.value)
              }
              className="h-6 text-[11px] placeholder:text-[11px] leading-[11px] !pb-2"
            />
          </div>
          <div>
            <label
              htmlFor="filter-type_document_a0"
              className="text-[10px] font-medium block mb-1"
            >
              Type de document A0
            </label>
            <Input
              id="filter-type_document_a0"
              placeholder="Filtrer..."
              value={filters.type_document_a0}
              onChange={(e) =>
                handleFilterChange("type_document_a0", e.target.value)
              }
              className="h-6 text-[11px] placeholder:text-[11px] leading-[11px] !pb-2"
            />
          </div>
          <div>
            <label
              htmlFor="filter-nbr_copy"
              className="text-[10px] font-medium block mb-1"
            >
              Nbre des copies
            </label>
            <Input
              id="filter-nbr_copy"
              placeholder="Filtrer..."
              value={filters.nbr_copy}
              onChange={(e) => handleFilterChange("nbr_copy", e.target.value)}
              className="h-6 text-[11px] placeholder:text-[11px] leading-[11px] !pb-2"
            />
          </div>
          <div>
            <label
              htmlFor="filter-nbr_exemplaire"
              className="text-[10px] font-medium block mb-1"
            >
              Nbre des exemplaires
            </label>
            <Input
              id="filter-nbr_exemplaire"
              placeholder="Filtrer..."
              value={filters.nbr_exemplaire}
              onChange={(e) =>
                handleFilterChange("nbr_exemplaire", e.target.value)
              }
              className="h-6 text-[11px] placeholder:text-[11px] leading-[11px] !pb-2"
            />
          </div>
          <div>
            <label
              htmlFor="filter-nbr_folder"
              className="text-[10px] font-medium block mb-1"
            >
              N° dossier
            </label>
            <Input
              id="filter-nbr_folder"
              placeholder="Filtrer..."
              value={filters.nbr_folder}
              onChange={(e) => handleFilterChange("nbr_folder", e.target.value)}
              className="h-6 text-[11px] placeholder:text-[11px] leading-[11px] !pb-2"
            />
          </div>
          <div>
            <label
              htmlFor="filter-salle"
              className="text-[10px] font-medium block mb-1"
            >
              Salle
            </label>
            <Input
              id="filter-salle"
              placeholder="Filtrer par salle..."
              value={filters.salle}
              onChange={(e) => handleFilterChange("salle", e.target.value)}
              className="h-6 text-[11px] placeholder:text-[11px] leading-[11px] !pb-2"
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between p-2 bg-white rounded-md pb-0">
        <div className="text-xs text-muted-foreground">
          Affichage de {projets.length > 0 ? (currentPage - 1) * 10 + 1 : 0} à{" "}
          {Math.min(currentPage * 10, totalRecords)} sur {totalRecords}{" "}
          enregistrements
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            className="h-6 w-6 p-0"
          >
            <ChevronLeft className="h-3 w-3" />
          </Button>
          <div className="text-xs">
            Page {currentPage} sur {totalPages || 1}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className="h-6 w-6 p-0"
          >
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <Card className="p-0 gap-0 overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-auto w-full">
            <div className="min-w-max">
              <Table className="border-collapse text-[11px]">
                <TableHeader>
                  <TableRow className="bg-muted/50 border-b-2 border-border">
                    {visibleColumns.includes("id") && (
                      <TableHead className="w-[60px] sticky top-0 bg-muted/50 py-0.5 text-center border-r whitespace-nowrap p-0.5 text-[11px]">
                        <div className="font-semibold py-0.5">ID</div>
                      </TableHead>
                    )}
                    {visibleColumns.includes("index") && (
                      <TableHead className="sticky top-0 bg-muted/50 py-0.5 text-center border-r whitespace-nowrap p-0.5 text-[11px]">
                        <div className="font-semibold py-0.5">Indice</div>
                      </TableHead>
                    )}
                    {visibleColumns.includes("epi") && (
                      <TableHead className="sticky top-0 bg-muted/50 py-0.5 text-center border-r whitespace-nowrap p-0.5 text-[11px]">
                        <div className="font-semibold py-0.5">EPI</div>
                      </TableHead>
                    )}
                    {visibleColumns.includes("ar") && (
                      <TableHead className="sticky top-0 bg-muted/50 py-0.5 text-center border-r whitespace-nowrap p-0.5 text-[11px]">
                        <div className="font-semibold py-0.5">AR</div>
                      </TableHead>
                    )}
                    {visibleColumns.includes("et") && (
                      <TableHead className="sticky top-0 bg-muted/50 py-0.5 text-center border-r whitespace-nowrap p-0.5 text-[11px]">
                        <div className="font-semibold py-0.5">ET</div>
                      </TableHead>
                    )}
                    {visibleColumns.includes("nbr_boite") && (
                      <TableHead className="sticky top-0 bg-muted/50 py-0.5 text-center border-r whitespace-nowrap p-0.5 text-[11px]">
                        <div className="font-semibold py-0.5">N° Boite</div>
                      </TableHead>
                    )}
                    {visibleColumns.includes("name_project") && (
                      <TableHead className="sticky top-0 bg-muted/50 py-0.5 text-center border-r whitespace-nowrap p-0.5 text-[11px]">
                        <div className="font-semibold py-0.5">
                          Intitulé du projet
                        </div>
                      </TableHead>
                    )}
                    {visibleColumns.includes("etude") && (
                      <TableHead className="sticky top-0 bg-muted/50 py-0.5 text-center border-r whitespace-nowrap p-0.5 text-[11px]">
                        <div className="font-semibold py-0.5">Étude</div>
                      </TableHead>
                    )}
                    {visibleColumns.includes("date") && (
                      <TableHead className="sticky top-0 bg-muted/50 py-0.5 text-center border-r whitespace-nowrap p-0.5 text-[11px]">
                        <div className="font-semibold py-0.5">Date</div>
                      </TableHead>
                    )}
                    {visibleColumns.includes("secteur") && (
                      <TableHead className="sticky top-0 bg-muted/50 py-0.5 text-center border-r whitespace-nowrap p-0.5 text-[11px]">
                        <div className="font-semibold py-0.5">Secteur</div>
                      </TableHead>
                    )}
                    {visibleColumns.includes("ti") && (
                      <TableHead className="sticky top-0 bg-muted/50 py-0.5 text-center border-r whitespace-nowrap p-0.5 text-[11px]">
                        <div className="font-semibold py-0.5">TI</div>
                      </TableHead>
                    )}
                    {visibleColumns.includes("name_document") && (
                      <TableHead className="sticky top-0 bg-muted/50 py-0.5 text-center border-r whitespace-nowrap p-0.5 text-[11px]">
                        <div className="font-semibold py-0.5">
                          Titre du document
                        </div>
                      </TableHead>
                    )}
                    {visibleColumns.includes("nbr_document_a3") && (
                      <TableHead className="sticky top-0 bg-muted/50 py-0.5 text-center border-r whitespace-nowrap p-0.5 text-[11px]">
                        <div className="font-semibold py-0.5">
                          Nbre des documents A3
                        </div>
                      </TableHead>
                    )}
                    {visibleColumns.includes("nbr_document_a4") && (
                      <TableHead className="sticky top-0 bg-muted/50 py-0.5 text-center border-r whitespace-nowrap p-0.5 text-[11px]">
                        <div className="font-semibold py-0.5">
                          Nbre des documents A4
                        </div>
                      </TableHead>
                    )}
                    {visibleColumns.includes("nbr_plan") && (
                      <TableHead className="sticky top-0 bg-muted/50 py-0.5 text-center border-r whitespace-nowrap p-0.5 text-[11px]">
                        <div className="font-semibold py-0.5">
                          Nbre des plans
                        </div>
                      </TableHead>
                    )}
                    {visibleColumns.includes("type_document_a3") && (
                      <TableHead className="sticky top-0 bg-muted/50 py-0.5 text-center border-r whitespace-nowrap p-0.5 text-[11px]">
                        <div className="font-semibold py-0.5">
                          Type de document A3
                        </div>
                      </TableHead>
                    )}
                    {visibleColumns.includes("type_document_a4") && (
                      <TableHead className="sticky top-0 bg-muted/50 py-0.5 text-center border-r whitespace-nowrap p-0.5 text-[11px]">
                        <div className="font-semibold py-0.5">
                          Type de document A4
                        </div>
                      </TableHead>
                    )}
                    {visibleColumns.includes("type_document_a0") && (
                      <TableHead className="sticky top-0 bg-muted/50 py-0.5 text-center border-r whitespace-nowrap p-0.5 text-[11px]">
                        <div className="font-semibold py-0.5">
                          Type de document A0
                        </div>
                      </TableHead>
                    )}
                    {visibleColumns.includes("nbr_copy") && (
                      <TableHead className="sticky top-0 bg-muted/50 py-0.5 text-center border-r whitespace-nowrap p-0.5 text-[11px]">
                        <div className="font-semibold py-0.5">
                          Nbre des copies
                        </div>
                      </TableHead>
                    )}
                    {visibleColumns.includes("nbr_exemplaire") && (
                      <TableHead className="sticky top-0 bg-muted/50 py-0.5 text-center border-r whitespace-nowrap p-0.5 text-[11px]">
                        <div className="font-semibold py-0.5">
                          Nbre des exemplaires
                        </div>
                      </TableHead>
                    )}
                    {visibleColumns.includes("nbr_folder") && (
                      <TableHead className="sticky top-0 bg-muted/50 py-0.5 text-center border-r whitespace-nowrap p-0.5 text-[11px]">
                        <div className="font-semibold py-0.5">N° dossier</div>
                      </TableHead>
                    )}
                    {visibleColumns.includes("salle") && (
                      <TableHead className="sticky top-0 bg-muted/50 py-0.5 text-center border-r whitespace-nowrap p-0.5 text-[11px]">
                        <div className="font-semibold py-0.5">Salle</div>
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading && (
                    <TableRow>
                      <TableCell
                        colSpan={visibleColumns.length}
                        className="h-24 text-center"
                      >
                        Chargement...
                      </TableCell>
                    </TableRow>
                  )}
                  {!loading && projets.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={visibleColumns.length}
                        className="h-24 text-center"
                      >
                        Aucun résultat trouvé.
                      </TableCell>
                    </TableRow>
                  ) : (
                    projets.map((projet, index) => (
                      <TableRow
                        key={projet.id}
                        className={`${
                          index % 2 === 0
                            ? "bg-white hover:bg-gray-50"
                            : "bg-muted/20 hover:bg-muted/30"
                        } cursor-pointer`}
                        onClick={() => navigateToProjectDetails(projet.id)}
                      >
                        {visibleColumns.includes("id") && (
                          <TableCell className="font-medium text-center border-b border-r p-0.5 text-[11px]">
                            {projet.id}
                          </TableCell>
                        )}
                        {visibleColumns.includes("index") && (
                          <TableCell className="text-center border-b border-r p-0.5 text-[11px]">
                            {projet.index}
                          </TableCell>
                        )}
                        {visibleColumns.includes("epi") && (
                          <TableCell className="text-center border-b border-r p-0.5 text-[11px]">
                            {projet.epi}
                          </TableCell>
                        )}
                        {visibleColumns.includes("ar") && (
                          <TableCell className="text-center border-b border-r p-0.5 text-[11px]">
                            {projet.ar}
                          </TableCell>
                        )}
                        {visibleColumns.includes("et") && (
                          <TableCell className="text-center border-b border-r p-0.5 text-[11px]">
                            {projet.et}
                          </TableCell>
                        )}
                        {visibleColumns.includes("nbr_boite") && (
                          <TableCell className="text-center border-b border-r p-0.5 text-[11px]">
                            {projet.nbr_boite}
                          </TableCell>
                        )}
                        {visibleColumns.includes("name_project") && (
                          <TableCell className="border-b border-r p-0.5 text-[11px]">
                            <div
                              className="whitespace-pre-line"
                              title={projet.name_project}
                            >
                              {formatText(projet.name_project)}
                            </div>
                          </TableCell>
                        )}
                        {visibleColumns.includes("etude") && (
                          <TableCell className="border-b border-r p-0.5 text-[11px]">
                            <div
                              className="whitespace-pre-line"
                              title={projet.etude}
                            >
                              {formatText(projet.etude)}
                            </div>
                          </TableCell>
                        )}
                        {visibleColumns.includes("date") && (
                          <TableCell className="text-center border-b border-r p-0.5 text-[11px]">
                            {projet.date
                              ? new Date(projet.date).toLocaleDateString(
                                  "fr-FR"
                                )
                              : "-"}
                          </TableCell>
                        )}
                        {visibleColumns.includes("secteur") && (
                          <TableCell className="border-b border-r p-0.5 text-[11px]">
                            <div
                              className="whitespace-pre-line"
                              title={projet.secteur}
                            >
                              {formatText(projet.secteur)}
                            </div>
                          </TableCell>
                        )}
                        {visibleColumns.includes("ti") && (
                          <TableCell className="text-center border-b border-r p-0.5 text-[11px]">
                            {projet.ti}
                          </TableCell>
                        )}
                        {visibleColumns.includes("name_document") && (
                          <TableCell className="border-b border-r p-0.5 text-[11px]">
                            <div
                              className="whitespace-pre-line"
                              title={projet.name_document}
                            >
                              {formatText(projet.name_document)}
                            </div>
                          </TableCell>
                        )}
                        {visibleColumns.includes("nbr_document_a3") && (
                          <TableCell className="text-center border-b border-r p-0.5 text-[11px]">
                            {projet.nbr_document_a3 || "-"}
                          </TableCell>
                        )}
                        {visibleColumns.includes("nbr_document_a4") && (
                          <TableCell className="text-center border-b border-r p-0.5 text-[11px]">
                            {projet.nbr_document_a4 || "-"}
                          </TableCell>
                        )}
                        {visibleColumns.includes("nbr_plan") && (
                          <TableCell className="text-center border-b border-r p-0.5 text-[11px]">
                            {projet.nbr_plan || "-"}
                          </TableCell>
                        )}
                        {visibleColumns.includes("type_document_a3") && (
                          <TableCell className="border-b border-r p-0.5 text-[11px]">
                            <div
                              className="whitespace-pre-line"
                              title={projet.type_document_a3}
                            >
                              {formatText(projet.type_document_a3) || "-"}
                            </div>
                          </TableCell>
                        )}
                        {visibleColumns.includes("type_document_a4") && (
                          <TableCell className="border-b border-r p-0.5 text-[11px]">
                            <div
                              className="whitespace-pre-line"
                              title={projet.type_document_a4}
                            >
                              {formatText(projet.type_document_a4) || "-"}
                            </div>
                          </TableCell>
                        )}
                        {visibleColumns.includes("type_document_a0") && (
                          <TableCell className="border-b border-r p-0.5 text-[11px]">
                            <div
                              className="whitespace-pre-line"
                              title={projet.type_document_a0}
                            >
                              {formatText(projet.type_document_a0) || "-"}
                            </div>
                          </TableCell>
                        )}
                        {visibleColumns.includes("nbr_copy") && (
                          <TableCell className="text-center border-b border-r p-0.5 text-[11px]">
                            {projet.nbr_copy || "-"}
                          </TableCell>
                        )}
                        {visibleColumns.includes("nbr_exemplaire") && (
                          <TableCell className="text-center border-b border-r p-0.5 text-[11px]">
                            {projet.nbr_exemplaire || "-"}
                          </TableCell>
                        )}
                        {visibleColumns.includes("nbr_folder") && (
                          <TableCell className="text-center border-b border-r p-0.5 text-[11px]">
                            {projet.nbr_folder || "-"}
                          </TableCell>
                        )}
                        {visibleColumns.includes("salle") && (
                          <TableCell className="text-center border-b border-r p-0.5 text-[11px]">
                            {projet.salle}
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
