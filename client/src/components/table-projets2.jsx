import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
import { Columns, Search, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { availableColumnsProjets2, formatText } from "@/lib/data";
import { fetchProjects2 } from "@/api/projects";

export function TableProjets2() {
  const navigate = useNavigate();
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [visibleColumns, setVisibleColumns] = useState(
    availableColumnsProjets2
      .filter((col) => col.defaultVisible)
      .map((col) => col.id)
  );
  const [showFilters, setShowFilters] = useState(false);
  const [columnsPopoverOpen, setColumnsPopoverOpen] = useState(false);
  const [filters, setFilters] = useState({
    id: "",
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

  const navigateToProjectDetails = (projectId) => {
    navigate(`/e-archive-18-2022/${projectId}`);
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
      fetchProjects2({ page: currentPage, limit: 10, filters }).then((data) => {
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
          <PopoverContent className="w-64 p-0 bg-white" align="end">
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
                {availableColumnsProjets2.map((column) => (
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
              htmlFor="filter-name"
              className="text-[10px] font-medium block mb-1"
            >
              Nom
            </label>
            <Input
              id="filter-name"
              placeholder="Filtrer par nom..."
              value={filters.name}
              onChange={(e) => handleFilterChange("name", e.target.value)}
              className="h-6 text-[11px] placeholder:text-[11px] leading-[11px] !pb-2"
            />
          </div>
          <div>
            <label
              htmlFor="filter-type"
              className="text-[10px] font-medium block mb-1"
            >
              Type d'ouvrage / Réseau
            </label>
            <Input
              id="filter-type"
              placeholder="Filtrer par type..."
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              className="h-6 text-[11px] placeholder:text-[11px] leading-[11px] !pb-2"
            />
          </div>
          <div>
            <label
              htmlFor="filter-year"
              className="text-[10px] font-medium block mb-1"
            >
              Année
            </label>
            <Input
              id="filter-year"
              placeholder="Filtrer par année..."
              value={filters.year}
              onChange={(e) => handleFilterChange("year", e.target.value)}
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
              htmlFor="filter-mappe"
              className="text-[10px] font-medium block mb-1"
            >
              Mappe
            </label>
            <Input
              id="filter-mappe"
              placeholder="Filtrer par mappe..."
              value={filters.mappe}
              onChange={(e) => handleFilterChange("mappe", e.target.value)}
              className="h-6 text-[11px] placeholder:text-[11px] leading-[11px] !pb-2"
            />
          </div>
          <div>
            <label
              htmlFor="filter-producer"
              className="text-[10px] font-medium block mb-1"
            >
              Réalisateur
            </label>
            <Input
              id="filter-producer"
              placeholder="Filtrer par réalisateur..."
              value={filters.producer}
              onChange={(e) => handleFilterChange("producer", e.target.value)}
              className="h-6 text-[11px] placeholder:text-[11px] leading-[11px] !pb-2"
            />
          </div>
          <div>
            <label
              htmlFor="filter-scale"
              className="text-[10px] font-medium block mb-1"
            >
              Echelle
            </label>
            <Input
              id="filter-scale"
              placeholder="Filtrer par échelle..."
              value={filters.scale}
              onChange={(e) => handleFilterChange("scale", e.target.value)}
              className="h-6 text-[11px] placeholder:text-[11px] leading-[11px] !pb-2"
            />
          </div>
          <div>
            <label
              htmlFor="filter-sheet"
              className="text-[10px] font-medium block mb-1"
            >
              Feuille
            </label>
            <Input
              id="filter-sheet"
              placeholder="Filtrer par feuille..."
              value={filters.sheet}
              onChange={(e) => handleFilterChange("sheet", e.target.value)}
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
          <div>
            <label
              htmlFor="filter-tranche"
              className="text-[10px] font-medium block mb-1"
            >
              Tranche d'irrigation
            </label>
            <Input
              id="filter-tranche"
              placeholder="Filtrer par tranche..."
              value={filters.tranche}
              onChange={(e) => handleFilterChange("tranche", e.target.value)}
              className="h-6 text-[11px] placeholder:text-[11px] leading-[11px] !pb-2"
            />
          </div>
          <div>
            <label
              htmlFor="filter-nature"
              className="text-[10px] font-medium block mb-1"
            >
              Nature du plan
            </label>
            <Input
              id="filter-nature"
              placeholder="Filtrer par nature..."
              value={filters.nature}
              onChange={(e) => handleFilterChange("nature", e.target.value)}
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
                    {visibleColumns.includes("index") && (
                      <TableHead className="sticky top-0 bg-muted/50 py-0.5 text-center border-r whitespace-nowrap p-0.5 text-[11px]">
                        <div className="font-semibold py-0.5">Indice</div>
                      </TableHead>
                    )}
                    {visibleColumns.includes("name") && (
                      <TableHead className="sticky top-0 bg-muted/50 py-0.5 text-center border-r whitespace-nowrap p-0.5 text-[11px]">
                        <div className="font-semibold py-0.5">Nom</div>
                      </TableHead>
                    )}
                    {visibleColumns.includes("type") && (
                      <TableHead className="sticky top-0 bg-muted/50 py-0.5 text-center border-r whitespace-nowrap p-0.5 text-[11px]">
                        <div className="font-semibold py-0.5">
                          Type d'ouvrage / Réseau
                        </div>
                      </TableHead>
                    )}
                    {visibleColumns.includes("year") && (
                      <TableHead className="sticky top-0 bg-muted/50 py-0.5 text-center border-r whitespace-nowrap p-0.5 text-[11px]">
                        <div className="font-semibold py-0.5">Année</div>
                      </TableHead>
                    )}
                    {visibleColumns.includes("secteur") && (
                      <TableHead className="sticky top-0 bg-muted/50 py-0.5 text-center border-r whitespace-nowrap p-0.5 text-[11px]">
                        <div className="font-semibold py-0.5">Secteur</div>
                      </TableHead>
                    )}
                    {visibleColumns.includes("mappe") && (
                      <TableHead className="sticky top-0 bg-muted/50 py-0.5 text-center border-r whitespace-nowrap p-0.5 text-[11px]">
                        <div className="font-semibold py-0.5">Mappe</div>
                      </TableHead>
                    )}
                    {visibleColumns.includes("producer") && (
                      <TableHead className="sticky top-0 bg-muted/50 py-0.5 text-center border-r whitespace-nowrap p-0.5 text-[11px]">
                        <div className="font-semibold py-0.5">Réalisateur</div>
                      </TableHead>
                    )}
                    {visibleColumns.includes("scale") && (
                      <TableHead className="sticky top-0 bg-muted/50 py-0.5 text-center border-r whitespace-nowrap p-0.5 text-[11px]">
                        <div className="font-semibold py-0.5">Echelle</div>
                      </TableHead>
                    )}
                    {visibleColumns.includes("sheet") && (
                      <TableHead className="sticky top-0 bg-muted/50 py-0.5 text-center border-r whitespace-nowrap p-0.5 text-[11px]">
                        <div className="font-semibold py-0.5">Feuille</div>
                      </TableHead>
                    )}
                    {visibleColumns.includes("salle") && (
                      <TableHead className="sticky top-0 bg-muted/50 py-0.5 text-center border-r whitespace-nowrap p-0.5 text-[11px]">
                        <div className="font-semibold py-0.5">Salle</div>
                      </TableHead>
                    )}
                    {visibleColumns.includes("tranche") && (
                      <TableHead className="sticky top-0 bg-muted/50 py-0.5 text-center border-r whitespace-nowrap p-0.5 text-[11px]">
                        <div className="font-semibold py-0.5">
                          Tranche d'irrigation
                        </div>
                      </TableHead>
                    )}
                    {visibleColumns.includes("nature") && (
                      <TableHead className="sticky top-0 bg-muted/50 py-0.5 text-center border-r whitespace-nowrap p-0.5 text-[11px]">
                        <div className="font-semibold py-0.5">
                          Nature du plan
                        </div>
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
                        colSpan={visibleColumns.length + 1}
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
                        {visibleColumns.includes("index") && (
                          <TableCell className="text-center border-b border-r p-2 text-[11px]">
                            {projet.index || "-"}
                          </TableCell>
                        )}
                        {visibleColumns.includes("name") && (
                          <TableCell className="border-b border-r p-2 text-[11px]">
                            <div
                              className="whitespace-pre-line"
                              title={projet.name}
                            >
                              {formatText(projet.name)}
                            </div>
                          </TableCell>
                        )}
                        {visibleColumns.includes("type") && (
                          <TableCell className="text-center border-b border-r p-2 text-[11px]">
                            {projet.type || "-"}
                          </TableCell>
                        )}
                        {visibleColumns.includes("year") && (
                          <TableCell className="text-center border-b border-r p-2 text-[11px]">
                            {projet.year || "-"}
                          </TableCell>
                        )}
                        {visibleColumns.includes("secteur") && (
                          <TableCell className="text-center border-b border-r p-2 text-[11px]">
                            {projet.secteur || "-"}
                          </TableCell>
                        )}
                        {visibleColumns.includes("mappe") && (
                          <TableCell className="text-center border-b border-r p-2 text-[11px]">
                            {projet.mappe || "-"}
                          </TableCell>
                        )}
                        {visibleColumns.includes("producer") && (
                          <TableCell className="border-b border-r p-2 text-[11px]">
                            <div
                              className="whitespace-pre-line"
                              title={projet.producer}
                            >
                              {formatText(projet.producer)}
                            </div>
                          </TableCell>
                        )}
                        {visibleColumns.includes("scale") && (
                          <TableCell className="text-center border-b border-r p-2 text-[11px]">
                            {projet.scale || "-"}
                          </TableCell>
                        )}
                        {visibleColumns.includes("sheet") && (
                          <TableCell className="text-center border-b border-r p-2 text-[11px]">
                            {projet.sheet || "-"}
                          </TableCell>
                        )}
                        {visibleColumns.includes("salle") && (
                          <TableCell className="text-center border-b border-r p-2 text-[11px]">
                            {projet.salle || "-"}
                          </TableCell>
                        )}
                        {visibleColumns.includes("tranche") && (
                          <TableCell className="text-center border-b border-r p-2 text-[11px]">
                            {projet.tranche || "-"}
                          </TableCell>
                        )}
                        {visibleColumns.includes("nature") && (
                          <TableCell className="text-center border-b border-r p-2 text-[11px]">
                            {projet.nature || "-"}
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
