// import React, { useEffect } from "react";
// import { View, Text, Image, StyleSheet } from "react-native";
// import { TouchableOpacity } from "react-native-gesture-handler";
// import { useNavigation } from "@react-navigation/native";
// import { Entypo, FontAwesome } from "@expo/vector-icons";
// import colors from "../colors";

// export default function Home() {
//   const img = require("../assets/mono.png");
//   const navigation = useNavigation();

//   useEffect(() => {
//     navigation.setOptions({
//       headerLeft: () => (
//         <FontAwesome
//           name="search"
//           size={24}
//           color={colors.gray}
//           style={{ marginLeft: 15 }}
//         />
//       ),
//       headerRight: () => (
//         <Image
//           source={img}
//           style={{ width: 40, height: 40, marginRight: 15 }}
//         />
//       ),
//     });
//   }, [navigation]);

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity
//         style={styles.chatButton}
//         onPress={() => navigation.navigate("Chat")}
//       >
//         <Entypo name="chat" size={24} color={colors.lightGray} />
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "flex-end",
//     alignItems: "flex-end",
//     backgroundColor: "#fff",
//   },
//   chatButton: {
//     backgroundColor: colors.primary,
//     height: 50,
//     width: 50,
//     borderRadius: 25,
//     alignItems: "center",
//     justifyContent: "center",
//     shadowColor: colors.primary,
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 9,
//     shadowRadius: 8,
//     marginRight: 20,
//     marginBottom: 50,
//   },
// });
import React, { useEffect } from "react";
import { View, Image, StyleSheet, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { signOut } from "firebase/auth"; // Importa la función de cierre de sesión de Firebase
import AsyncStorage from "@react-native-async-storage/async-storage"; // Importa AsyncStorage
import { auth } from "../config/firebase"; // Asegúrate de importar la instancia de auth
import colors from "../colors";

export default function Home() {
  const img = require("../assets/mono.png");
  const navigation = useNavigation();

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await signOut(auth); // Cierra sesión en Firebase
      await AsyncStorage.removeItem("userToken"); // Remueve el token de usuario de AsyncStorage
      navigation.navigate("Login"); // Navega a la pantalla de login
    } catch (error) {
      console.log("Error cerrando sesión: ", error);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <FontAwesome
          name="search"
          size={24}
          color={colors.gray}
          style={{ marginLeft: 15 }}
        />
      ),
      headerRight: () => (
        <Image
          source={img}
          style={{
            width: 40,
            height: 40,
            marginRight: 15,
            borderRadius: 25,
          }}
        />
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={{ marginRight: 20, marginBottom: 45 }}>
        <TouchableOpacity onPress={handleLogout}>
          <Text>Exit</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => navigation.navigate("Chat")}
      >
        <Entypo name="chat" size={24} color={colors.lightGray} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    backgroundColor: "#fff",
  },
  chatButton: {
    backgroundColor: colors.primary,
    height: 50,
    width: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 9,
    shadowRadius: 8,
    marginRight: 20,
    marginBottom: 50,
  },
});
