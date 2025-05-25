import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { TableProjets2 } from "@/components/table-projets2";
import Layout from "@/components/layout";
import { useAuth } from "@/hooks/auth";
import { Loader } from "@/components/loader";

export default function Projets2() {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;

  return (
    <Layout>
      <div className="container pb-10 pt-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Liste des E-Archive 18-2022
          </h1>
          {["admin", "editor"].includes(user.role) && (
            <Button
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              asChild
            >
              <Link to="/e-archive-18-2022/ajouter">
                <PlusCircle className="h-4 w-4 mr-2" />
                Ajouter un projet
              </Link>
            </Button>
          )}
        </div>
        <TableProjets2 />
      </div>
    </Layout>
  );
}
