import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, onValue, get } from 'firebase/database';

type ImageContextType = {
  image: string | null;
  setImage: (image: string | null) => void;
};

const ImageContext = createContext<ImageContextType>({ image: null, setImage: () => {} });

export const useImage = () => useContext(ImageContext);

export const ImageProvider = ({ children }: { children: React.ReactNode }) => {
  const [image, setImage] = useState<string | null>(null);
  const auth = getAuth();
  const database = getDatabase();

  //listen for auth state changes
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        //check database first for base64 image data
        try {
          const userRef = ref(database, `users/${user.uid}/photoURL`);
          const snapshot = await get(userRef);
          const photoURL = snapshot.val();

          if (photoURL && photoURL.startsWith('data:')) {
            //this is a base64 data URL from our app
            setImage(photoURL);
          } else if (user.photoURL && !user.photoURL.startsWith('data:')) {
            //this is a regular URL from Firebase Auth (legacy)
            setImage(user.photoURL);
          }
        } catch (error) {
          console.error('Error fetching photo from database:', error);
          //fallback to auth profile if database fails
          if (user.photoURL) {
            setImage(user.photoURL);
          }
        }
      } else {
        setImage(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  //listen for database changes when user is logged in
  useEffect(() => {
    if (!auth.currentUser) return;

    const userRef = ref(database, `users/${auth.currentUser.uid}/photoURL`);
    const unsubscribeDB = onValue(userRef, (snapshot) => {
      const photoURL = snapshot.val();
      if (photoURL && photoURL.startsWith('data:')) {
        setImage(photoURL);
      }
    });

    return () => unsubscribeDB();
  }, [auth.currentUser?.uid]);

  return (
    <ImageContext.Provider value={{ image, setImage }}>
      {children}
    </ImageContext.Provider>
  );
}; 