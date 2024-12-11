import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Text } from "@/components/ui/text";
import { H3 } from "@/components/ui/typography";
import { Appointment } from "@/interfaces";
import { deleteAppointment, deleteToken, getAppointments } from "@/lib/secureStore";
import { cn } from "@/lib/utils";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";

export default function MainPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<string>("");
  const { push, reload } = useRouter();

  const fetchAppointments = async () => {
    const appointments = await getAppointments();
    setAppointments(appointments);
  };

  const removeAppointment = async () => {
    deleteAppointment(selectedAppointment).then(() => {
      setSelectedAppointment("");
      fetchAppointments();
    });
  };

  useEffect(() => {
    fetchAppointments();
    deleteToken("session");
  }, []);

  return (
    <View className="flex-1 items-center justify-center p-3">
      <Card className="flex-1">
        <CardHeader>
          <H3>Your Appointments</H3>
        </CardHeader>
        <CardContent className="flex-1 items-center">
          {appointments.length === 0 ? (
            <Text className="text-center">No appointments found</Text>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">
                    <Text>Department</Text>
                  </TableHead>
                  <TableHead className="w-1/3">
                    <Text>Treatment</Text>
                  </TableHead>
                  <TableHead className="w-1/3">
                    <Text>When</Text>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <FlatList
                data={appointments}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => {
                  console.log(item);

                  return (
                    <TableRow
                      onPress={() =>
                        setSelectedAppointment((prev) => (prev === item.id ? "" : item.id))
                      }
                      className={cn("h-20", "active:bg-secondary", index % 2 && "bg-muted/40", {
                        "bg-slate-600": selectedAppointment === item.id,
                      })}>
                      <TableCell className="w-1/3">
                        <Text>{item.department}</Text>
                      </TableCell>
                      <TableCell className="w-1/3">
                        <Text>{item.medicalTreatment}</Text>
                      </TableCell>
                      <TableCell className="w-1/3">
                        <Text>{new Date(item.date).toLocaleString()}</Text>
                      </TableCell>
                    </TableRow>
                  );
                }}></FlatList>
            </Table>
          )}
        </CardContent>
        <CardFooter className="flex-row justify-between items-center gap-3 pt-10">
          <Button onPress={() => push("/new-appointment")}>
            <Text>Add new appointment</Text>
          </Button>
          <Button
            variant="secondary"
            disabled={selectedAppointment === ""}
            onPress={removeAppointment}>
            <Text>Cancel appointment</Text>
          </Button>
        </CardFooter>
      </Card>
    </View>
  );
}
