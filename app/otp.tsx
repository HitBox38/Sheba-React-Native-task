import { OTPInput } from "@/components/ui/OTPInput";
import { Text } from "@/components/ui/text";
import { saveToken } from "@/lib/secureStore";
import { useRouter } from "expo-router";
import { View } from "react-native";

const OTP = () => {
  const router = useRouter();

  const handleSubmit = async (otp: string) => {
    console.log("OTP submitted:", otp);
    await saveToken("session", Math.random().toString(36));
    router.replace("/");
  };

  return (
    <View className="h-full w-full flex flex-col items-center justify-center gap-3">
      <Text>Type the code from your authenticator app</Text>
      <OTPInput onSubmit={handleSubmit} />
    </View>
  );
};

export default OTP;
