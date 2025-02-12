import { ICategory, ICategoryContextProvider } from "@/interfaces";
import { supabase } from "@/utils";
import { getPlanLimits, isCategoryLimitReached } from "@/utils/limiter";
import { FontAwesome } from "@expo/vector-icons";
import * as React from "react";
import { createContext, useContext } from "react";
import { Alert } from "react-native";
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
    const { limits } = await getPlanLimits(profile.id_tenant as string);

    if (await isCategoryLimitReached(profile.id_tenant as string)) {
      Alert.alert(
        "Límite de Plan Excedido",
        `Su plan actual permite un máximo de ${limits.categories} categorías. Por favor, actualice su plan para agregar más categorías.`
      );
      return;
    }
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
    const { data: mealsWithCategory, error } = await supabase
      .from("meals")
      .select("id")
      .eq("id_category", id);
    if (error) {
      console.error("Error finding meals with category:", error);
      toast.error("Error al eliminar categoría!", {
        icon: <FontAwesome name="times-circle" size={20} color="red" />,
      });
      return;
    }
    if (mealsWithCategory.length > 0) {
      toast.error("ERROR : Categoría en uso", {
        description:
          "La categoria tiene " +
          mealsWithCategory.length +
          " platos asociados",
      });
      return;
    }
    const { error: deleteError } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);
    if (deleteError) {
      console.error("Error deleting category:", deleteError);
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
