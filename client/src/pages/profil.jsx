import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Briefcase,
  Lock,
  Save,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Layout from "@/components/layout";
import { useAuth } from "@/hooks/auth";
import { getRoleLabel } from "@/lib/utils";
import { updateProfile } from "@/api/users";
import { toast } from "sonner";

export default function ProfilePage() {
  const { user, loading: userLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("informations");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [profileInfo, setProfileInfo] = useState({
    fname: "",
    lname: "",
    email: "",
    poste_ormvag: "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const handleProfileChange = (field, value) => {
    setProfileInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswords((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveProfile = () => {
    updateProfile(profileInfo)
      .then((data) => {
        toast.success(data.message);
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message || "Une erreur est survenue."
        );
      });
  };

  const handleSavePassword = () => {
    if (passwords.new !== passwords.confirm) {
      toast.error("Les nouveaux mots de passe ne correspondent pas");

      return;
    }

    updateProfile(passwords)
      .then((data) => {
        toast.success(data.message);

        setPasswords({
          current: "",
          new: "",
          confirm: "",
        });
      })
      .catch((error) => {
        toast.error(
          error.response?.data?.message || "Une erreur est survenue."
        );
      });
  };

  useEffect(() => {
    if (!userLoading) {
      setProfileInfo({
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        poste_ormvag: user.poste_ormvag,
      });
    }
  }, [user]);

  if (userLoading) return <></>;

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold">Mon Profil</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Colonne de gauche - Avatar et informations rapides */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden gap-0 !p-0">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32 flex items-center justify-center relative">
                <div className="absolute -bottom-16 w-full flex justify-center">
                  <div className="relative group">
                    <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                      <AvatarFallback className="bg-primary/10 text-primary text-4xl">
                        {profileInfo.fname.charAt(0)}
                        {profileInfo.lname.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </div>
              <CardContent className="pt-20 pb-6">
                <div className="text-center">
                  <h2 className="text-xl font-bold">
                    {profileInfo.fname} {profileInfo.lname}
                  </h2>
                  <p className="text-muted-foreground">
                    {profileInfo.poste_ormvag}
                  </p>
                  <p className="text-sm mt-1">{profileInfo.email}</p>
                </div>
                <Separator className="my-4" />
                <div className="space-y-3">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{getRoleLabel(user.role)}</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">ORMVAG</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                    <span className="text-sm">Compte vérifié</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Colonne de droite - Onglets pour les informations et le mot de passe */}
          <div className="lg:col-span-2">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="informations" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Informations personnelles
                </TabsTrigger>
                <TabsTrigger value="password" className="flex items-center">
                  <Lock className="h-4 w-4 mr-2" />
                  Mot de passe
                </TabsTrigger>
              </TabsList>
              <TabsContent value="informations">
                <Card className="!p-0 gap-0">
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="firstName"
                          className="flex items-center"
                        >
                          <User className="h-4 w-4 text-muted-foreground" />
                          Prénom
                        </Label>
                        <Input
                          id="firstName"
                          value={profileInfo.fname}
                          onChange={(e) =>
                            handleProfileChange("fname", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="flex items-center">
                          <User className="h-4 w-4 text-muted-foreground" />
                          Nom
                        </Label>
                        <Input
                          id="lastName"
                          value={profileInfo.lname}
                          onChange={(e) =>
                            handleProfileChange("lname", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="flex items-center">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          Email
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileInfo.email}
                          onChange={(e) =>
                            handleProfileChange("email", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="poste" className="flex items-center">
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          Poste ORMVAG
                        </Label>
                        <Input
                          id="poste"
                          value={profileInfo.poste_ormvag}
                          onChange={(e) =>
                            handleProfileChange("poste_ormvag", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className="flex justify-end mt-6">
                      <Button
                        onClick={handleSaveProfile}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <Save className="h-4 w-4" />
                        Enregistrer les modifications
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="password">
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label
                          htmlFor="currentPassword"
                          className="flex items-center"
                        >
                          <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                          Mot de passe actuel
                        </Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showPassword.current ? "text" : "password"}
                            value={passwords.current}
                            onChange={(e) =>
                              handlePasswordChange("current", e.target.value)
                            }
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            onClick={() =>
                              setShowPassword((prev) => ({
                                ...prev,
                                current: !prev.current,
                              }))
                            }
                          >
                            {showPassword.current ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="newPassword"
                          className="flex items-center"
                        >
                          <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                          Nouveau mot de passe
                        </Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showPassword.new ? "text" : "password"}
                            value={passwords.new}
                            onChange={(e) =>
                              handlePasswordChange("new", e.target.value)
                            }
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            onClick={() =>
                              setShowPassword((prev) => ({
                                ...prev,
                                new: !prev.new,
                              }))
                            }
                          >
                            {showPassword.new ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Le mot de passe doit contenir au moins 8 caractères.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="confirmPassword"
                          className="flex items-center"
                        >
                          <Lock className="h-4 w-4 mr-2 text-muted-foreground" />
                          Confirmer le nouveau mot de passe
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showPassword.confirm ? "text" : "password"}
                            value={passwords.confirm}
                            onChange={(e) =>
                              handlePasswordChange("confirm", e.target.value)
                            }
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            onClick={() =>
                              setShowPassword((prev) => ({
                                ...prev,
                                confirm: !prev.confirm,
                              }))
                            }
                          >
                            {showPassword.confirm ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end mt-6">
                      <Button
                        onClick={handleSavePassword}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Mettre à jour le mot de passe
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
}
