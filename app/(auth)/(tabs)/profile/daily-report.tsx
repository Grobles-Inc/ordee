import { useOrderContext } from "@/context";
import { IOrder } from "@/interfaces";
import { supabase } from "@/utils";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, useColorScheme, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { BarChart } from "react-native-gifted-charts";
import { ActivityIndicator, Text } from "react-native-paper";
import { toZonedTime, format } from "date-fns-tz";
import { AntDesign, FontAwesome6 } from "@expo/vector-icons";

const lightTheme = {
  todayTextColor: "#FF6247",
  backgroundColor: "#ffffff",
  calendarBackground: "#ffffff",
  textSectionTitleColor: "#b6c1cd",
  dayTextColor: "#2d4150",
  selectedDayBackgroundColor: "#FF6247",
  selectedDayTextColor: "#ffffff",
  textDisabledColor: "#d9e1e8",
  monthTextColor: "#2d4150",
};

const darkTheme = {
  todayTextColor: "#FF6247",
  backgroundColor: "#121212",
  calendarBackground: "#262626",
  textSectionTitleColor: "#ffffff",
  dayTextColor: "#ffffff",
  monthTextColor: "gray",
  selectedDayBackgroundColor: "#FF6247",
  selectedDayTextColor: "#ffffff",
  textDisabledColor: "gray",
};

LocaleConfig.locales["es"] = {
  monthNames: [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ],
  monthNamesShort: [
    "Ene.",
    "Feb.",
    "Mar.",
    "Abr.",
    "May.",
    "Jun.",
    "Jul.",
    "Ago.",
    "Sep.",
    "Oct.",
    "Nov.",
    "Dic.",
  ],
  dayNames: [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ],
  dayNamesShort: ["D", "L", "M", "X", "J", "V", "S"],
  today: "Hoy",
};
LocaleConfig.defaultLocale = "es";
const calculateOrderTotal = (order: IOrder): number => {
  if (order.order_meals && Array.isArray(order.order_meals)) {
    return order.order_meals.reduce(
      (sum: number, meal: any) =>
        sum + (Number(meal.meals?.price) || 0) * (Number(meal.quantity) || 1),
      0
    );
  }
  return order.total || 0;
};

const timeZone = "America/Lima";

export default function DailyReportScreen() {
  const { getDailyPaidOrders, getPaidOrders } = useOrderContext();
  const colorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === "dark");

  useEffect(() => {
    setIsDarkMode(colorScheme === "dark");
  }, [colorScheme]);
  const [dailySales, setDailySales] = useState([
    { value: 0, label: "12 AM", frontColor: "#FF6247" },
    { value: 0, label: "2 AM", frontColor: "#FF6247" },
    { value: 0, label: "4 AM", frontColor: "#FF6247" },
    { value: 0, label: "6 AM", frontColor: "#FF6247" },
    { value: 0, label: "8 AM", frontColor: "#FF6247" },
    { value: 0, label: "10 AM", frontColor: "#FF6247" },
    { value: 0, label: "12 PM", frontColor: "#FF6247" },
    { value: 0, label: "2 PM", frontColor: "#FF6247" },
    { value: 0, label: "4 PM", frontColor: "#FF6247" },
    { value: 0, label: "6 PM", frontColor: "#FF6247" },
    { value: 0, label: "8 PM", frontColor: "#FF6247" },
    { value: 0, label: "10 PM", frontColor: "#FF6247" },
  ]);
  const [totalDailySales, setTotalDailySales] = useState(0);
  const [orderDetails, setOrderDetails] = useState({
    totalOrders: 0,
    totalAmount: 0,
    peakHour: "",
    mostRequestedPlates: [] as { name: string; count: number }[],
  });
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    return format(now, "yyyy-MM-dd");
  });
  const [dailyTotals, setDailyTotals] = useState<{ [key: string]: number }>({});

  const loadDailySales = async () => {
    try {
      setLoading(true);
      const orders = await getDailyPaidOrders();
      const salesByHour: number[] = new Array(12).fill(0);
      let dailyTotal = 0;
      const newDailyTotals: { [key: string]: number } = {};
      const plateCounts = new Map<string, number>();

      orders.forEach((order: IOrder) => {
        if (order.date) {
          const orderDate = toZonedTime(new Date(order.date), timeZone);
          const hour = orderDate.getHours();
          const timeIndex = Math.floor(hour / 2);
          const orderTotal = calculateOrderTotal(order);

          // Count plates
          if (order.order_meals && Array.isArray(order.order_meals)) {
            order.order_meals.forEach((meal: any) => {
              const mealName = meal.meals?.name || 'Unknown';
              const count = plateCounts.get(mealName) || 0;
              plateCounts.set(mealName, count + Number(meal.quantity || 1));
            });
          }

          salesByHour[timeIndex] += orderTotal;
          dailyTotal += orderTotal;

          const orderDateString = format(orderDate, "yyyy-MM-dd", { timeZone });
          if (!newDailyTotals[orderDateString]) {
            newDailyTotals[orderDateString] = 0;
          }
          newDailyTotals[orderDateString] += orderTotal;
        }
      });

      // Get top 5 most requested plates
      const mostRequestedPlates = Array.from(plateCounts.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setDailySales((prev) =>
        prev.map((item, index) => ({
          ...item,
          value: salesByHour[index],
        }))
      );

      const peakHourIndex = salesByHour.indexOf(Math.max(...salesByHour));
      const peakHourLabel = [
        "12 AM",
        "2 AM",
        "4 AM",
        "6 AM",
        "8 AM",
        "10 AM",
        "12 PM",
        "2 PM",
        "4 PM",
        "6 PM",
        "8 PM",
        "10 PM",
      ][peakHourIndex];

      setTotalDailySales(dailyTotal);
      setOrderDetails({
        totalOrders: orders.length,
        totalAmount: dailyTotal,
        peakHour: orders.length > 0 ? peakHourLabel : "N/A",
        mostRequestedPlates,
      });
      setDailyTotals(newDailyTotals);
    } catch (error) {
      console.error("Error loading daily sales:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadPreviousOrders = async () => {
    try {
      const orders = await getPaidOrders();
      const newDailyTotals: { [key: string]: number } = {};

      orders.forEach((order: IOrder) => {
        if (order.date) {
          const orderDate = toZonedTime(new Date(order.date), timeZone);
          const orderDateString = format(orderDate, "yyyy-MM-dd", { timeZone });

          if (!newDailyTotals[orderDateString]) {
            newDailyTotals[orderDateString] = 0;
          }
          newDailyTotals[orderDateString] +=
            order.total || calculateOrderTotal(order);
        }
      });

      setDailyTotals(newDailyTotals);
    } catch (error) {
      console.error("Error loading previous orders:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await loadDailySales();
      await loadPreviousOrders();
    };

    loadData();

    const subscription = supabase
      .channel("daily-reports")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        () => {
          loadData();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const SalesDetails = ({
    title,
    data,
  }: {
    title: string;
    data: number | string;
  }) => (
    <Text style={styles.detailText}>
      {title}: {typeof data === "number" ? `${data}` : data}
    </Text>
  );

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      contentContainerClassName="pb-24"
      contentInsetAdjustmentBehavior="automatic"
      className="bg-white dark:bg-zinc-900"
    >
      {loading ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 24,
          }}
        >
          <ActivityIndicator size="large" />
          <Text style={{ color: "gray" }}>Cargando datos...</Text>
        </View>
      ) : (
        <View className="flex flex-col gap-8">
          <View className="overflow-hidden bg-zinc-100 dark:bg-zinc-800 p-4 rounded-xl flex flex-col gap-8">
            <View className="flex flex-col ">
              <Text style={styles.title}>Ventas diarias</Text>
              <Text style={styles.totalSales}>
                Total: S/. {totalDailySales.toFixed(2)}
              </Text>
            </View>
            <View className="flex flex-col gap-2 justify-center items-center">
              <BarChart
                data={dailySales}
                barWidth={30}
                barBorderRadius={6}
                xAxisThickness={0}
                yAxisThickness={0}
                yAxisTextStyle={styles.chartText}
                xAxisLabelTextStyle={styles.chartText}
                noOfSections={5}
              />
              <View className="flex flex-row gap-2 items-center web:md:hidden">
                <AntDesign name="swapleft" size={20} color="#FF6247" />
                <Text variant="labelSmall" style={{ color: "gray" }}>
                  Desliza a la izquierda
                </Text>
                <AntDesign name="swapright" size={20} color="#FF6247" />
              </View>
            </View>
            <View className="p-4 bg-white dark:bg-zinc-900 rounded-lg">
              <SalesDetails
                title="Total de pedidos"
                data={orderDetails.totalOrders}
              />
              <SalesDetails title="Hora pico" data={orderDetails.peakHour} />
              <View className="mt-4">
                <Text style={[styles.detailText, { fontWeight: '600', marginBottom: 12 }]}>
                  Platos más solicitados:
                </Text>
                {orderDetails.mostRequestedPlates.map((plate, index) => (
                  <Text key={plate.name} style={[styles.detailText, { marginLeft: 8 }]}>
                    {index + 1}. {plate.name} ({plate.count} pedidos)
                  </Text>
                ))}
              </View>
            </View>
          </View>
          <Calendar
            onDayPress={(day: any) => {
              setSelectedDate(day.dateString);
            }}
            theme={isDarkMode ? darkTheme : lightTheme}
            style={{
              borderRadius: 8,
            }}
            markedDates={{
              [selectedDate]: {
                selected: true,
                marked: true,
                selectedColor: "#FF6247",
              },
              ...Object.keys(dailyTotals).reduce((acc, date) => {
                acc[date] = { marked: true, dotColor: "#FF6247" };
                return acc;
              }, {} as { [key: string]: { marked: boolean; dotColor: string } }),
            }}
            renderArrow={(direction: string) => (
              <FontAwesome6
                name={direction === "right" ? "chevron-right" : "chevron-left"}
                size={20}
                color="#FF6247"
              />
            )}
          />
          <View className="flex flex-row items-center justify-between bg-zinc-100 p-6 rounded-lg dark:bg-zinc-800">
            <View className="flex flex-col gap-2">
              <Text style={{ color: "gray" }}>Total Recaudado</Text>
              <Text variant="titleMedium">{selectedDate} </Text>
            </View>
            <Text
              variant="titleLarge"
              style={{
                color: "#FF6247",
                fontWeight: "bold",
              }}
            >
              S/.{dailyTotals[selectedDate]?.toFixed(2) || "0.00"}
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
  },

  title: {
    fontSize: 14,
    marginBottom: 16,
    fontWeight: "300",
    color: "gray",
  },
  chartText: {
    color: "gray",
    fontSize: 12,
  },
  totalSales: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FF6247",
    marginBottom: 12,
  },

  detailText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
});
