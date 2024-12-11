import { Link, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";
import { H1, H3 } from "@/components/ui/typography";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View style={styles.container}>
        <H1>This screen doesn't exist.</H1>
        <Link href="/" style={styles.link}>
          <H3>Go to home screen!</H3>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
