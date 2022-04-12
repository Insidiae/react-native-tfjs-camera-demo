import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TakePicture from "./src/CatchDataInput/TakePicture.screen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="TakePicture" component={TakePicture} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

