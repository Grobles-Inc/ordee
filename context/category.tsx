import { ICategory, ICategoryContextProvider } from "@/interfaces";
import { supabase } from "@/utils/supabase";
import { FontAwesome } from "@expo/vector-icons";
import * as React from "react";
import { createContext, useContext } from "react";
import { toast } from "sonner-native";
import { useAuth } from "./auth";
export const CategoryContext = createContext<ICategoryContextProvider>({
  addCategory: async () => {},
  getCategoryById: async (id: string): Promise<ICategory> => ({} as ICategory),
  categories: [],
  category: {} as ICategory,
  loading: false,
  getCategories: async () => [],
  deleteCategory: async () => {},
});

export const CategoryContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [categories, setCategories] = React.useState<ICategory[]>([]);
  const [category, setCategory] = React.useState<ICategory>({} as ICategory);
  const { profile } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const addCategory = async (category: ICategory) => {
    const { error } = await supabase.from("categories").insert({
      ...category,
      id_tenant: profile.id_tenant,
    });
    if (error) {
      toast.error("Error al agregar categoría!", {
        icon: <FontAwesome name="times-circle" size={20} color="red" />,
      });
      return;
    }
    toast.success("Categoría agregada al menú!", {
      icon: <FontAwesome name="check-circle" size={20} color="green" />,
    });
  };

  const getCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id_tenant", profile.id_tenant);
    if (error) {
      console.error("Error getting categories:", error);
      return;
    }
    setCategories(data);
    setLoading(false);
    return data;
  };

  const deleteCategory = async (id: string) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) {
      console.error("Error deleting category:", error);
      toast.error("Error al eliminar categoría!", {
        icon: <FontAwesome name="times-circle" size={20} color="red" />,
      });
      return;
    }
    toast.success("Categoría eliminada!", {
      icon: <FontAwesome name="check-circle" size={20} color="green" />,
    });
  };

  async function getCategoryById(id: string) {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    setCategory(data);
    return data;
  }

  return (
    <CategoryContext.Provider
      value={{
        categories,
        loading,
        getCategories,
        deleteCategory,
        getCategoryById,
        addCategory,
        category,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategoryContext = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error(
      "useCategoryContext must be used within a CategoryProvider"
    );
  }
  return context;
};
