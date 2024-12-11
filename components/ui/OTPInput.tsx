import React, { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { cn } from "@/lib/utils"; // Assuming you have a tailwind class merger utility
import { Input } from "./input";
import { Button } from "./button";
import { Text } from "./text";

// OTP Validation Schema
const otpSchema = yup.object().shape({
  otp: yup
    .string()
    .matches(/^\d{6}$/, "OTP must be 6 digits")
    .required("OTP is required"),
});

interface OTPInputProps {
  onSubmit: (otp: string) => void;
}

export const OTPInput = ({ onSubmit }: OTPInputProps) => {
  const [otpDigits, setOtpDigits] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = React.useRef<(TextInput | null)[]>(new Array(6).fill(null));

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const handleOTPChange = (index: number, value: string) => {
    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);

    setValue("otp", newDigits.join(""));

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    // Auto-focus previous input on backspace
    if (key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const submitOTP = (data: { otp: string }) => {
    onSubmit(data.otp);
  };

  return (
    <View className="gap-4">
      <Controller
        control={control}
        name="otp"
        render={() => (
          <View className="flex-row gap-4 justify-between">
            {otpDigits.map((digit, index) => (
              <Input
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                className={cn(
                  "w-12 h-16 border rounded-lg text-center text-xl",
                  errors.otp ? "border-red-500" : "border-gray-300"
                )}
                keyboardType="numeric"
                maxLength={1}
                value={digit}
                onChangeText={(value) => handleOTPChange(index, value)}
                onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
              />
            ))}
          </View>
        )}
      />
      {errors.otp && <Text className="text-red-500 text-center">{errors.otp.message}</Text>}
      <Button onPress={handleSubmit(submitOTP)}>
        <Text>Verify OTP</Text>
      </Button>
    </View>
  );
};
