import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  UserPlus,
  Edit,
  Trash2,
  Mail,
  Briefcase,
  Clock,
  Calendar,
  Save,
  User,
  Eye,
  EyeOff,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast, Toaster } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Layout from "@/components/layout";
import {
  addUser,
  deleteUser,
  fetchUsers,
  updateUserByAdmin,
} from "@/api/users";
import { logAction } from "@/api/logs";
import { useAuth } from "@/hooks/auth";

export default function Utilisateurs() {
  const { user, loading: userLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);

  const [userForm, setUserForm] = useState({
    fname: "",
    lname: "",
    email: "",
    poste_ormvag: "",
    role: "user",
    password: "",
  });

  const openAddUserDialog = () => {
    setUserForm({
      fname: "",
      lname: "",
      email: "",
      poste_ormvag: "",
      role: "user",
      password: "",
    });
    setIsAddUserDialogOpen(true);
  };

  // Fonction pour ouvrir le dialogue de modification d'utilisateur
  const openEditUserDialog = (user) => {
    setSelectedUser(user);
    setUserForm({
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      poste_ormvag: user.poste_ormvag,
      role: user.role,
      password: "",
    });
    setIsEditUserDialogOpen(true);
  };

  // Fonction pour ouvrir le dialogue de suppression d'utilisateur
  const openDeleteUserDialog = (user) => {
    setSelectedUser(user);
    setIsDeleteUserDialogOpen(true);
  };

  // Fonction pour mettre à jour le formulaire
  const handleFormChange = (field, value) => {
    setUserForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Fonction pour ajouter un utilisateur
  const handleAddUser = () => {
    addUser(userForm)
      .then((data) => {
        toast.success(data.message);
        setUsers((prev) => [...prev, data.user]);
        setFilteredUsers(users);
        setIsAddUserDialogOpen(false);

        logAction({
          action: "ADD_USER",
          translated_action: "Ajout d'utilisateur",
          entity_type: "user",
          entity_id: data.user.id,
          message: `a ajouté(e) ${data.user.fname} ${data.user.lname}.`,
        });
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Erreur !");
      });
  };

  // Fonction pour modifier un utilisateur
  const handleEditUser = () => {
    updateUserByAdmin({
      id: selectedUser.id,
      ...userForm,
    })
      .then((data) => {
        toast.success(data.message);
        setUsers((prev) =>
          prev.map((u) => (u.id == data.user.id ? data.user : u))
        );
        setFilteredUsers(users);
        setIsEditUserDialogOpen(false);

        logAction({
          action: "UPDATE_USER",
          translated_action: "Modification d'utilisateur",
          entity_type: "user",
          entity_id: data.user.id,
          message: `a modifié(e) l'utilisateur ${data.user.fname} ${data.user.lname}.`,
        });
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Erreur !");
      });
  };

  // Fonction pour supprimer un utilisateur
  const handleDeleteUser = () => {
    if (!selectedUser) return;

    deleteUser(selectedUser.id)
      .then((data) => {
        toast.success(data.message);
        setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
        setFilteredUsers(users);
        setIsDeleteUserDialogOpen(false);

        logAction({
          action: "DELETE_USER",
          translated_action: "Suppression d'utilisateur",
          entity_type: "user",
          entity_id: selectedUser.id,
          message: `a supprimé(e) l'utilisateur ${selectedUser.fname} ${selectedUser.lname}.`,
        });
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message || "Erreur !");
      });
  };

  // Fonction pour obtenir la couleur du badge de rôle
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-500/10 text-purple-500 hover:bg-purple-500/10";
      case "editor":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/10";
      case "user":
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/10";
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/10";
    }
  };

  // Fonction pour obtenir le libellé du rôle
  const getRoleLabel = (role) => {
    switch (role) {
      case "admin":
        return "Administrateur";
      case "editor":
        return "Éditeur";
      case "user":
        return "Utilisateur";
      default:
        return "Utilisateur";
    }
  };

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    if (dateString === "-") return "-";
    try {
      return format(new Date(dateString), "d MMM yyyy à HH:mm", { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  useEffect(() => {
    fetchUsers()
      .then((data) => {
        setUsers(data);
        setFilteredUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setUsers([]);
        setFilteredUsers([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const searchTokens = searchQuery
        .toLowerCase()
        .split(" ")
        .filter((token) => token); // remove empty strings

      const filtered = users.filter((user) => {
        const nameTokens = `${user.fname} ${user.lname}`
          .toLowerCase()
          .split(" ")
          .filter((token) => token);

        return searchTokens.every((token) =>
          nameTokens.some((nameToken) => nameToken.includes(token))
        );
      });

      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  if (loading || userLoading) return <></>;

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              onClick={openAddUserDialog}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Ajouter un utilisateur
            </Button>
          </div>
        </div>
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="bg-muted/30 rounded-full p-6 mb-4">
              <User className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              Aucun utilisateur trouvé
            </h3>
            <p className="text-muted-foreground mb-6">
              Aucun utilisateur ne correspond à votre recherche.
            </p>
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Réinitialiser la recherche
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <Card
                key={user.id}
                className="overflow-hidden transition-all duration-300 hover:shadow-md !py-0"
              >
                <div className="relative pt-4">
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-white/80 hover:bg-white shadow-sm"
                      onClick={() => openEditUserDialog(user)}
                    >
                      <Edit className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-white/80 hover:bg-white shadow-sm"
                      onClick={() => openDeleteUserDialog(user)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-14 w-14 border">
                      <AvatarFallback className="bg-primary/10 text-primary text-lg">
                        {user.fname.charAt(0)}
                        {user.lname.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold truncate">
                          {user.fname} {user.lname}
                        </h2>
                        <Badge
                          className={`ml-2 ${getRoleBadgeColor(user.role)}`}
                        >
                          {getRoleLabel(user.role)}
                        </Badge>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Mail className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Briefcase className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                        <span className="truncate">{user.poste_ormvag}</span>
                      </div>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="text-muted-foreground flex items-center mb-1">
                        <Clock className="h-3 w-3 mr-1" />
                        Dernière connexion
                      </div>
                      <div className="font-medium">
                        {user.last_connection
                          ? formatDate(user.last_connection)
                          : "Jamais connecté."}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground flex items-center mb-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        Ajouté le
                      </div>
                      <div className="font-medium">
                        {formatDate(user.created_at)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {/* Dialogue d'ajout d'utilisateur */}
        <Dialog
          open={isAddUserDialogOpen}
          onOpenChange={setIsAddUserDialogOpen}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Ajouter un utilisateur</DialogTitle>
              <DialogDescription>
                Remplissez les informations pour créer un nouvel utilisateur.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  Prénom <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  value={userForm.fname}
                  onChange={(e) => handleFormChange("fname", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Nom <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  value={userForm.lname}
                  onChange={(e) => handleFormChange("lname", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={userForm.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="poste">
                  Poste ORMVAG <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="poste"
                  value={userForm.poste_ormvag}
                  onChange={(e) =>
                    handleFormChange("poste_ormvag", e.target.value)
                  }
                  required
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="password">
                  Mot de passe <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={userForm.password || ""}
                    onChange={(e) =>
                      handleFormChange("password", e.target.value)
                    }
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Rôle</Label>
                <Select
                  value={userForm.role}
                  onValueChange={(value) => handleFormChange("role", value)}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="editor">Éditeur</SelectItem>
                    <SelectItem value="user">Utilisateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddUserDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={handleAddUser}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Dialogue de modification d'utilisateur */}
        <Dialog
          open={isEditUserDialogOpen}
          onOpenChange={setIsEditUserDialogOpen}
        >
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Modifier un utilisateur</DialogTitle>
              <DialogDescription>
                Modifiez les informations de l'utilisateur.
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-firstName">
                  Prénom <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-firstName"
                  value={userForm.fname}
                  onChange={(e) => handleFormChange("fname", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-lastName">
                  Nom <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-lastName"
                  value={userForm.lname}
                  onChange={(e) => handleFormChange("lname", e.target.value)}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit-email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={userForm.email}
                  onChange={(e) => handleFormChange("email", e.target.value)}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit-poste">
                  Poste ORMVAG <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-poste"
                  value={userForm.poste_ormvag}
                  onChange={(e) =>
                    handleFormChange("poste_ormvag", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit-password">
                  Nouveau mot de passe{" "}
                  <span className="text-muted-foreground text-xs">
                    (laisser vide pour ne pas modifier)
                  </span>
                </Label>
                <div className="relative">
                  <Input
                    id="edit-password"
                    type={showEditPassword ? "text" : "password"}
                    value={userForm.password || ""}
                    onChange={(e) =>
                      handleFormChange("password", e.target.value)
                    }
                    placeholder="Nouveau mot de passe"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                  >
                    {showEditPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Rôle</Label>
                <Select
                  value={userForm.role}
                  onValueChange={(value) => handleFormChange("role", value)}
                >
                  <SelectTrigger id="edit-role">
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="editor">Éditeur</SelectItem>
                    <SelectItem value="user">Utilisateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditUserDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button
                onClick={handleEditUser}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {/* Dialogue de suppression d'utilisateur */}
        <Dialog
          open={isDeleteUserDialogOpen}
          onOpenChange={setIsDeleteUserDialogOpen}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Supprimer l'utilisateur</DialogTitle>
              <DialogDescription>
                Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette
                action est irréversible.
              </DialogDescription>
            </DialogHeader>
            {selectedUser && (
              <div className="py-4">
                <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-md">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {selectedUser.fname.charAt(0)}
                      {selectedUser.lname.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {selectedUser.fname} {selectedUser.lname}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedUser.email}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteUserDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleDeleteUser}>
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
