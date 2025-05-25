import { Link } from "react-router-dom";
import {
  FileText,
  DraftingCompass,
  ImageIcon,
  Users,
  FolderArchive,
  Database,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Layout from "@/components/layout";
import { useEffect, useState } from "react";
import { fetchDashboardStats } from "@/api/stats";
import { useAuth } from "@/hooks/auth";

export default function Home() {
  const [stats, setStats] = useState({
    totalProjets: 0,
    totalProjets2: 0,
    pdfFiles: 0,
    autocadFiles: 0,
    imageFiles: 0,
    totalUsers: 0,
  });

  const { user, loading } = useAuth();

  useEffect(() => {
    fetchDashboardStats()
      .then((data) => {
        setStats({
          totalProjets: data.total_projets,
          totalProjets2: data.total_projets2,
          pdfFiles: data.total_pdfs,
          autocadFiles: data.total_autocad,
          imageFiles: data.total_images,
          totalUsers: data.total_users,
        });
      })
      .catch((error) => console.log(error.message));
  }, []);

  if (loading) return <></>;

  return (
    <Layout>
      <div className="flex flex-col p-6 space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Aperçu des statistiques et des données de l'application
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Projets Card */}
          <Card className="hover:shadow-md transition-shadow gap-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Total E-Archive 53-2023
              </CardTitle>
              <FolderArchive className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProjets}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <Link
                  to="/e-archive-53-2023"
                  className="text-primary hover:underline"
                >
                  Voir tous
                </Link>
              </p>
            </CardContent>
          </Card>
          {/* Projets2 Card */}
          <Card className="hover:shadow-md transition-shadow gap-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Total E-Archive 18-2022
              </CardTitle>
              <Database className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProjets2}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <Link
                  to="/e-archive-18-2022"
                  className="text-primary hover:underline"
                >
                  Voir tous
                </Link>
              </p>
            </CardContent>
          </Card>
          {/* PDF Files Card */}
          <Card className="hover:shadow-md transition-shadow gap-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Fichiers PDF
              </CardTitle>
              <FileText className="w-4 h-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pdfFiles}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Documents PDF dans le système
              </p>
            </CardContent>
          </Card>
          {/* AutoCAD Files Card */}
          <Card className="hover:shadow-md transition-shadow gap-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Fichiers AutoCAD
              </CardTitle>
              <DraftingCompass className="w-4 h-4 text-cyan-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.autocadFiles}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Plans et dessins techniques
              </p>
            </CardContent>
          </Card>
          {/* Image Files Card */}
          <Card className="hover:shadow-md transition-shadow gap-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Images</CardTitle>
              <ImageIcon className="w-4 h-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.imageFiles}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Photos et images stockées
              </p>
            </CardContent>
          </Card>
          {/* Users Card */}
          <Card className="hover:shadow-md transition-shadow gap-0">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Utilisateurs
              </CardTitle>
              <Users className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              {user.role == "admin" ? (
                <p className="text-xs text-muted-foreground mt-1">
                  <Link
                    to="/utilisateurs"
                    className="text-primary hover:underline"
                  >
                    Gérer les utilisateurs
                  </Link>
                </p>
              ) : (
                <p className="text-xs text-muted-foreground mt-1">
                  Utilisateurs enregistrés dans le système
                </p>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 mt-4">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
          >
            <Link to="/e-archive-53-2023">Voir les E-Archive 53-2023</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/e-archive-18-2022">Voir les E-Archive 18-2022</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
}
