// import React, { useState, useCallback, useEffect } from "react";
// import { GiftedChat } from "react-native-gifted-chat";

// export default function Chat() {
//   const [messages, setMessages] = useState([]);
//   const img = require("../assets/mono.png");
//   useEffect(() => {
//     setMessages([
//       {
//         _id: 1,
//         text: "Hello developer",
//         createdAt: new Date(),
//         user: {
//           _id: 2,
//           name: "React Native",
//           avatar: img,
//         },
//       },
//     ]);
//   }, []);

//   const onSend = useCallback((messages = []) => {
//     setMessages((previousMessages) =>
//       GiftedChat.append(previousMessages, messages)
//     );
//   }, []);
//   return (
//     <GiftedChat
//       messages={messages}
//       onSend={(messages) => onSend(messages)}
//       user={{
//         _id: 1,
//       }}
//     />
//   );
// }
// import React, { useState, useCallback, useEffect } from "react";
// import { GiftedChat } from "react-native-gifted-chat";
// import {
//   collection,
//   addDoc,
//   query,
//   orderBy,
//   onSnapshot,
// } from "firebase/firestore";
// import { auth, db } from "../config/firebase"; // Asegúrate de tener configurado Firebase
// import { onAuthStateChanged } from "firebase/auth";

// export default function Chat() {
//   const [messages, setMessages] = useState([]);
//   const [user, setUser] = useState(null);
//   const img = require("../assets/mono.png");

//   useEffect(() => {
//     const unsubscribeAuth = onAuthStateChanged(auth, (authenticatedUser) => {
//       if (authenticatedUser) {
//         setUser(authenticatedUser);
//       } else {
//         setUser(null);
//       }
//     });

//     return () => unsubscribeAuth();
//   }, []);

//   useEffect(() => {
//     const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const loadedMessages = snapshot.docs.map((doc) => {
//         const firebaseData = doc.data();

//         const data = {
//           _id: doc.id,
//           text: firebaseData.text,
//           createdAt: firebaseData.createdAt.toDate(),
//           user: {
//             _id: firebaseData.user._id,
//             name: firebaseData.user.name,
//             avatar: firebaseData.user.avatar || img,
//           },
//         };

//         return data;
//       });

//       setMessages(loadedMessages);
//     });

//     return () => unsubscribe();
//   }, []);

//   const onSend = useCallback((messages = []) => {
//     const { _id, createdAt, text, user } = messages[0];

//     addDoc(collection(db, "messages"), {
//       _id,
//       createdAt,
//       text,
//       user,
//     });
//   }, []);

//   return (
//     <GiftedChat
//       messages={messages}
//       onSend={(messages) => onSend(messages)}
//       user={{
//         _id: user ? user.uid : null,
//         name: user ? user.displayName : "Anonymous",
//         avatar: user ? user.photoURL : img,
//       }}
//     />
//   );
// }

import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { GiftedChat } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, database } from "../config/firebase";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import colors from "../colors";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const navigation = useNavigation();

  const onSinOut = () => {
    signOut(auth).catch((error) => console.log(error));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity style={{ marginRight: 10 }} onPress={onSinOut}>
          <AntDesign name="logout" size={24} color={colors.gray} />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useLayoutEffect(() => {
    const collectionRef = collection(database, "chats");
    const q = query(collectionRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log("snapshot");
      setMessages(
        snapshot.docs.map((doc) => ({
          _id: doc.id,
          createdAt: doc.data().createdAt.toDate(),
          text: doc.data().text,
          user: doc.data().user,
        }))
      );
    });
    return () => unsubscribe();
  }, []);

  const onSend = useCallback((messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );

    const { _id, createdAt, text, user } = messages[0];
    addDoc(collection(database, "chats"), {
      _id,
      createdAt,
      text,
      user,
    });
  }, []);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: auth?.currentUser?.email,
        avatar: "https://i.pravatar.cc/300",
      }}
      messagesContainerStyle={{
        backgroundColor: "#fff",
      }}
      showAvatarForEveryMessage={true}
    />
  );
}
