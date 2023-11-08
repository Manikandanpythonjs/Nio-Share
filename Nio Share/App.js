import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import StackNavigator from "./Constant/StackNavigator";
import { UserContext } from "./Constant/UserContext";

export default function App() {
  return (
    <>
      <UserContext>
        <StackNavigator />
      </UserContext>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 2,
    flex: 1,
    backgroundColor: "dodgerblue",
    alignItems: "center",
    justifyContent: "center",
  },
});
