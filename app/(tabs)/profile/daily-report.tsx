import { useOrderContext } from "@/context/order";
import { IOrder } from "@/interfaces";
import { supabase } from "@/utils/supabase";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { BarChart } from "react-native-gifted-charts";
import { ActivityIndicator, Text } from "react-native-paper";
import { toZonedTime, format } from "date-fns-tz";
import { FontAwesome6 } from "@expo/vector-icons";

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
  return order.items.reduce(
    (sum, meal) => sum + (meal.price || 0) * (meal.quantity || 1),
    0
  );
};

const timeZone = "America/Lima";

export default function DailyReportScreen() {
  const { getDailyPaidOrders } = useOrderContext();
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
  });
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [dailyTotals, setDailyTotals] = useState<{ [key: string]: number }>({});

  const loadDailySales = async () => {
    try {
      setLoading(true);
      const orders = await getDailyPaidOrders();
      const salesByHour = new Array(12).fill(0);
      let dailyTotal = 0;
      const newDailyTotals: { [key: string]: number } = {};

      orders.forEach((order: IOrder) => {
        if (order.date) {
          const orderDate = toZonedTime(new Date(order.date), timeZone);
          const hour = orderDate.getHours();
          const timeIndex = Math.floor(hour / 2);
          const orderTotal = calculateOrderTotal(order);

          salesByHour[timeIndex] += orderTotal;
          dailyTotal += orderTotal;

          const orderDateString = format(orderDate, "yyyy-MM-dd", { timeZone });
          if (!newDailyTotals[orderDateString]) {
            newDailyTotals[orderDateString] = 0;
          }
          newDailyTotals[orderDateString] += orderTotal;
        }
      });

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
        peakHour: peakHourLabel || "N/A",
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
      const { data, error } = await supabase
        .from("orders")
        .select("date, total")
        .order("date", { ascending: false });

      if (error) {
        console.error("Error fetching previous orders:", error);
        throw error;
      }

      const newDailyTotals: { [key: string]: number } = {};

      data.forEach((order: { date: string; total: number }) => {
        if (order.date) {
          const orderDate = toZonedTime(new Date(order.date), timeZone);
          const orderDateString = format(orderDate, "yyyy-MM-dd", { timeZone });

          if (!newDailyTotals[orderDateString]) {
            newDailyTotals[orderDateString] = 0;
          }
          newDailyTotals[orderDateString] += order.total;
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
      contentInsetAdjustmentBehavior="automatic"
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
        <>
          <View style={styles.chartContainer}>
            <Text style={styles.title}>Ventas diarias</Text>
            <Text style={styles.totalSales}>
              Total: S/. {totalDailySales.toFixed(2)}
            </Text>
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
            <View style={styles.detailsContainer}>
              <SalesDetails
                title="Total de pedidos"
                data={orderDetails.totalOrders}
              />
              <SalesDetails
                title="Total de ventas"
                data={`S/. ${orderDetails.totalAmount.toFixed(2)}`}
              />
              <SalesDetails title="Hora pico" data={orderDetails.peakHour} />
            </View>
          </View>
          <Calendar
            onDayPress={(day: any) => setSelectedDate(day.dateString)}
            theme={{
              todayTextColor: "#FF6247",
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
          <View className="flex flex-row items-center justify-between bg-zinc-100 p-6 rounded-lg">
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
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
  },
  chartContainer: {
    marginBottom: 24,
    padding: 16,
    overflow: "hidden",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
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
  detailsContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
});
