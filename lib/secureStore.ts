import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import { Appointment } from "@/interfaces";

// Token
export const saveToken = async (key: string, value: string) => {
  if (Platform.OS === "web") {
    localStorage.setItem(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

export const getToken = async (key: string) => {
  if (Platform.OS === "web") {
    return localStorage.getItem(key);
  } else {
    return await SecureStore.getItemAsync(key);
  }
};

export const deleteToken = async (key: string) => {
  if (Platform.OS === "web") {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};

// Appointments
export const addNewAppointment = async (appointment: Appointment) => {
  const appointments = await getAppointments();
  appointments.push(appointment);
  await saveAppointments(appointments);
};

export const getAppointments = async () => {
  const appointments = await getToken("appointments");
  if (!appointments) {
    return [];
  }
  const data = JSON.parse(appointments) as Appointment[];
  data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return data;
};

export const saveAppointments = async (appointments: Appointment[]) => {
  await saveToken("appointments", JSON.stringify(appointments));
};

export const deleteAppointment = async (id: string) => {
  const appointments: Appointment[] = await getAppointments();
  const newAppointments = appointments.filter((appointment) => appointment.id !== id);
  await saveAppointments(newAppointments);
};
