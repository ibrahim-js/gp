import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { TableProjets } from "@/components/table-projets";
import Layout from "@/components/layout";
import { useAuth } from "@/hooks/auth";
import { Loader } from "@/components/loader";

export default function Projets() {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  return (
    <Layout>
      <div className="container pb-10 pt-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Liste des E-Archive 53-2023
          </h1>
          {["admin", "editor"].includes(user.role) && (
            <Button
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              asChild
            >
              <Link to="/e-archive-53-2023/ajouter">
                <PlusCircle className="h-4 w-4 mr-2" />
                Ajouter un projet
              </Link>
            </Button>
          )}
        </div>
        <TableProjets />
      </div>
    </Layout>
  );
}
