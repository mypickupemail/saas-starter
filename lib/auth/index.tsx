'use client';

import { Session } from 'next-auth';
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react';
import { use } from 'react';
type User = Session['user']
type UserContextType = {
  user: User | undefined; 
  setUser: React.Dispatch<React.SetStateAction<User | undefined>>;
};

const UserContext = createContext<UserContextType | null>(null);

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export function UserProvider({
  children,
  userPromise,
}: {
  children: ReactNode;
  userPromise: Promise<User | undefined>;
}) {
  let initialUser = use(userPromise);
  let [user, setUser] = useState<User | undefined>(initialUser);

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  return (
    <UserContext.Provider value={{ user , setUser }}>
      {children}
    </UserContext.Provider>
  );
}
