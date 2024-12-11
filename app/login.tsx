import { View, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useRouter } from "expo-router";
import { saveToken } from "@/lib/secureStore";

const loginSchema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginForm = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();

  const onSubmit = (data: LoginFormInputs) => {
    console.log("Login Data:", data);
    router.replace("/otp");
  };

  return (
    <View className="h-full w-full flex flex-col items-center justify-center gap-3">
      <Controller
        name="email"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="flex flex-col gap-1 w-72">
            <Input
              placeholder="Email"
              value={value || ""}
              onChangeText={onChange}
              onBlur={onBlur}
              autoCapitalize="none"
              keyboardType="email-address"
              textContentType="emailAddress"
              autoCorrect={false}
            />
            {errors.email && <Text className="text-red-500">{errors.email.message}</Text>}
          </View>
        )}
      />

      <Controller
        name="password"
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="flex flex-col gap-1 w-72">
            <Input
              placeholder="Password"
              value={value || ""}
              onChangeText={onChange}
              onBlur={onBlur}
              secureTextEntry
              textContentType="password"
            />
            {errors.password && <Text className="text-red-500">{errors.password.message}</Text>}
          </View>
        )}
      />

      <Button onPress={handleSubmit(onSubmit)}>
        <Text>Login</Text>
      </Button>
    </View>
  );
};

export default LoginForm;
