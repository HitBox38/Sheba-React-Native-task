import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";
import * as yup from "yup";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addNewAppointment } from "@/lib/secureStore";
import { Appointment } from "@/interfaces";
import { useRouter } from "expo-router";

const OPTIONS = [
  {
    label: "Cardiology",
    medicalTreatments: [
      "Electrocardiogram (ECG)",
      "Stress Test",
      "Echocardiogram",
      "Angioplasty",
      "Pacemaker Installation",
    ],
  },
  {
    label: "Orthopedics",
    medicalTreatments: ["Joint Replacement (e.g., hip, knee)", "Arthroscopy", "Fracture Treatment"],
  },
  {
    label: "Pediatrics",
    medicalTreatments: [
      "Vaccinations",
      "Developmental Screening",
      "Treatment for Common Illnesses",
    ],
  },
  {
    label: "Neurology",
    medicalTreatments: ["EEG (Electroencephalogram)", "MRI/CT Scans"],
  },
  {
    label: "Dermatology",
    medicalTreatments: ["Skin Biopsy", "Acne Treatment", "Mole Removal", "Psoriasis Treatment"],
  },
];

const appointmentSchema = yup.object().shape({
  department: yup.string().required("Department is required"),
  medicalTreatment: yup.string().required("Medical treatment is required"),
  date: yup.date().required("Date is required"),
});

const NewAppointment = () => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(null);
  const { replace } = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
  } = useForm<Omit<Appointment, "id">>({
    resolver: yupResolver(appointmentSchema),
  });

  const generateRandomId = () => {
    return Math.floor(Math.random() * 1000000).toString();
  };

  const onSubmit = (data: Omit<Appointment, "id">) => {
    console.log("Appointment submitted:", data);

    addNewAppointment({ ...data, id: generateRandomId() }).then(() => replace("/"));
  };

  useEffect(() => {
    reset({ ...watch(), medicalTreatment: undefined, date: undefined });
  }, [watch("department")]);

  return (
    <View className="flex flex-1 flex-col justify-center items-center gap-5 ">
      <Controller
        name="department"
        control={control}
        render={({ field: { onChange, value } }) => (
          <View className="flex flex-col gap-1 w-72">
            <Select
              value={{ value, label: value }}
              onValueChange={(option) => onChange(option?.value)}>
              <SelectTrigger>
                <SelectValue
                  className="text-foreground text-sm native:text-lg"
                  placeholder="Select department"
                />
              </SelectTrigger>
              <SelectContent>
                {OPTIONS.map((option) => (
                  <SelectItem label={option.label} key={option.label} value={option.label}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.department && <Text className="text-red-500">{errors.department.message}</Text>}
          </View>
        )}
      />
      <Controller
        name="medicalTreatment"
        control={control}
        render={({ field: { onChange, value } }) => (
          <View className="flex flex-col gap-1 w-72">
            <Select
              value={{ value, label: value }}
              onValueChange={(option) => onChange(option?.value)}>
              <SelectTrigger disabled={!watch("department")}>
                <SelectValue
                  className="text-foreground text-sm native:text-lg"
                  placeholder="Select medical treatment"
                />
              </SelectTrigger>
              <SelectContent>
                {OPTIONS.find(({ label }) => label === watch("department"))?.medicalTreatments.map(
                  (option) => (
                    <SelectItem label={option} key={option} value={option}>
                      {option}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
            {errors.medicalTreatment && (
              <Text className="text-red-500">{errors.medicalTreatment.message}</Text>
            )}
          </View>
        )}
      />
      <Controller
        name="date"
        control={control}
        render={({ field: { onChange, value } }) => (
          <View className="flex flex-col gap-1 w-72">
            <Button
              disabled={!watch("medicalTreatment")}
              variant="secondary"
              onPress={() => setIsDatePickerOpen(true)}>
              <Text>{value ? value.toLocaleString() : "Select date and time"}</Text>
            </Button>
            {isDatePickerOpen && (
              <DateTimePicker
                testID="datePicker"
                value={value || new Date()}
                onChange={(event, selectedDate) => {
                  setIsDatePickerOpen(false);
                  if (selectedDate) {
                    setTempDate(selectedDate);
                    setIsTimePickerOpen(true); // Open time picker
                  }
                }}
                mode="date"
                minimumDate={new Date()}
                maximumDate={new Date(2099, 12, 31)}
              />
            )}
            {isTimePickerOpen && tempDate && (
              <DateTimePicker
                testID="timePicker"
                value={tempDate}
                onChange={(event, selectedTime) => {
                  setIsTimePickerOpen(false);
                  if (selectedTime) {
                    // Combine date and time
                    const finalDate = new Date(
                      tempDate.getFullYear(),
                      tempDate.getMonth(),
                      tempDate.getDate(),
                      selectedTime.getHours(),
                      selectedTime.getMinutes()
                    );
                    onChange(finalDate); // Update the form value
                  }
                }}
                mode="time"
              />
            )}
            {errors.date && <Text className="text-red-500">{errors.date.message}</Text>}
          </View>
        )}
        rules={{
          required: "Date is required",
        }}
      />
      <Button onPress={handleSubmit(onSubmit)} disabled={!isValid}>
        <Text>Add appointment</Text>
      </Button>
    </View>
  );
};

export default NewAppointment;
