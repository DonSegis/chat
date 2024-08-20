// import React, { createContext, useContext, useEffect, useState } from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// import Chat from "./screens/Chat";
// import Login from "./screens/Loging";
// import SingUp from "./screens/Singup";
// import Home from "./screens/Home";
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "./config/firebase";
// import { ActivityIndicator, View } from "react-native";

// const Stack = createStackNavigator();

// const AuthenticatedUserContext = createContext({});

// const AuthenticateUserProvider = ({ children }) => {
//   // Corregido `chlidren` a `children`
//   const [user, setUser] = useState(null);
//   return (
//     <AuthenticatedUserContext.Provider value={{ user, setUser }}>
//       {children}
//     </AuthenticatedUserContext.Provider>
//   );
// };

// function ChatStack() {
//   return (
//     <Stack.Navigator
//       screenOptions={{ headerTitleAlign: "center" }}
//       detachInactiveScreens={Home}
//     >
//       <Stack.Screen name="Home" component={Home} />
//       <Stack.Screen name="Chat" component={Chat} />
//     </Stack.Navigator>
//   );
// }

// function AuthStack() {
//   return (
//     <Stack.Navigator
//       screenOptions={{ headerShown: false }}
//       detachInactiveScreens={Login}
//     >
//       <Stack.Screen name="Login" component={Login} />
//       <Stack.Screen name="Singup" component={SingUp} />
//     </Stack.Navigator>
//   );
// }

// function RootChatSatck() {
//   const { user, setUser } = useContext(AuthenticatedUserContext);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
//       setUser(authenticatedUser ? authenticatedUser : null);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   if (loading) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   return (
//     <NavigationContainer>
//       {user ? <ChatStack /> : <AuthStack />}
//     </NavigationContainer>
//   );
// }

// export default function App() {
//   return (
//     <AuthenticateUserProvider>
//       <RootChatSatck />
//     </AuthenticateUserProvider>
//   );
// }
import React, { createContext, useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Importa AsyncStorage
import Chat from "./screens/Chat";
import Login from "./screens/Loging";
import SingUp from "./screens/Singup";
import Home from "./screens/Home";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import { ActivityIndicator, View } from "react-native";

const Stack = createStackNavigator();

const AuthenticatedUserContext = createContext({});

const AuthenticateUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

function ChatStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerTitleAlign: "center" }}
      detachInactiveScreens={Home}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Chat" component={Chat} />
    </Stack.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      detachInactiveScreens={Login}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Singup" component={SingUp} />
    </Stack.Navigator>
  );
}

function RootChatSatck() {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const storedUser = await AsyncStorage.getItem("userToken"); // Revisa si hay un usuario almacenado
      setUser(storedUser ? JSON.parse(storedUser) : null);
      setLoading(false);
    };

    const unsubscribe = onAuthStateChanged(auth, async (authenticatedUser) => {
      if (authenticatedUser) {
        await AsyncStorage.setItem(
          "userToken",
          JSON.stringify(authenticatedUser)
        ); // Almacena la sesión solo en este emulador
        setUser(authenticatedUser);
      } else {
        await AsyncStorage.removeItem("userToken"); // Remueve la sesión si el usuario cierra sesión
        setUser(null);
      }
      setLoading(false);
    });

    checkAuthStatus();

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <ChatStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthenticateUserProvider>
      <RootChatSatck />
    </AuthenticateUserProvider>
  );
}
