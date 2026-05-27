import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { formatPrice } from "../api/services";
import type { HourlyData } from "../api/types";

interface HourlyTableProps {
  data: HourlyData[];
}

export function HourlyTable({ data }: HourlyTableProps) {
  const activeHours = data.filter((d) => d.orders > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hourly Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        {activeHours.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">
            No orders today
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hour</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeHours.map((hour) => (
                <TableRow key={hour.hour}>
                  <TableCell className="font-medium">{hour.hour}</TableCell>
                  <TableCell className="text-right">{hour.orders}</TableCell>
                  <TableCell className="text-right">
                    {formatPrice(hour.revenue)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
