import { Theme, ThemeProvider } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { Stack, useRouter, Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { PortalHost } from "@rn-primitives/portal";
import { NAV_THEME } from "@/lib/constants";
import { useColorScheme } from "@/lib/useColorScheme";
import { Platform, ActivityIndicator } from "react-native";
import { getToken } from "@/lib/secureStore";
import "react-native-reanimated";
import "../global.css";

const LIGHT_THEME: Theme = {
  dark: false,
  colors: NAV_THEME.light,
  fonts: {
    bold: {
      fontFamily: "",
      fontWeight: "bold",
    },
    heavy: {
      fontFamily: "",
      fontWeight: "bold",
    },
    regular: {
      fontFamily: "",
      fontWeight: "normal",
    },
    medium: {
      fontFamily: "",
      fontWeight: "normal",
    },
  },
};
const DARK_THEME: Theme = {
  dark: true,
  colors: NAV_THEME.dark,
  fonts: {
    bold: {
      fontFamily: "",
      fontWeight: "bold",
    },
    heavy: {
      fontFamily: "",
      fontWeight: "bold",
    },
    regular: {
      fontFamily: "",
      fontWeight: "normal",
    },
    medium: {
      fontFamily: "",
      fontWeight: "normal",
    },
  },
};

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = useState(false);
  const [fontLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const router = useRouter();
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  useEffect(() => {
    if (fontLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontLoaded]);

  useEffect(() => {
    (async () => {
      const theme = await AsyncStorage.getItem("theme");
      if (Platform.OS === "web") {
        document.documentElement.classList.add("bg-background");
      }
      if (!theme) {
        await AsyncStorage.setItem("theme", colorScheme);
      } else {
        const colorTheme = theme === "dark" ? "dark" : "light";
        setColorScheme(colorTheme);
      }
      setIsColorSchemeLoaded(true);
    })();
  }, [colorScheme, setColorScheme]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken("session");
      console.log("Token check completed:", token);

      if (!token) {
        console.log("No token found. Navigating to login...");
        router.replace("/login");
      }
      setIsAuthChecked(true); // Ensure the check completes
    };

    checkAuth().catch((error) => {
      console.error("Error during authentication check:", error);
      setIsAuthChecked(true); // Prevent infinite loading state
    });
  }, [router]);

  if (!fontLoaded || !isColorSchemeLoaded || !isAuthChecked) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DARK_THEME : LIGHT_THEME}>
      <Stack>
        <Slot screenOptions={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
      <PortalHost />
    </ThemeProvider>
  );
}
