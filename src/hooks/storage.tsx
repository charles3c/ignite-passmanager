import React, {
    useState,
    useEffect,
    createContext,
    useContext,
    ReactNode
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VoidFunctionComponent } from 'react';

interface StorageProviderProps {
    children: ReactNode
}

interface StorageContextProps {
    getItem(): Promise<LoginListDataProps>;
    setItem(login: LoginDataProps): Promise<void>;
}

interface LoginDataProps {
  id: string;
  title: string;
  email: string;
  password: string;
};

type LoginListDataProps = LoginDataProps[];

const StorageContext = createContext({} as StorageContextProps);

function StorageProvider({ children }: StorageProviderProps) {

    const passwordStorageKey = '@passmanager:logins'
    
    async function getItem() {
        const data = await AsyncStorage.getItem(passwordStorageKey)
        const loginListData = data ? JSON.parse(data) : []
        return loginListData
    }
    async function setItem( newLogin: LoginDataProps) {
        const loginListData = await getItem()
        const newLoginListData = [...loginListData, newLogin]
        const newLoginListDataFormat = JSON.stringify(newLoginListData)
        await AsyncStorage.setItem(passwordStorageKey, newLoginListDataFormat)
    }

    return (
        <StorageContext.Provider value={{
            getItem,
            setItem
        }}>
            {children}
        </StorageContext.Provider>
    )

}

function useStorageData() {
    const context = useContext(StorageContext);
    return context;
}

export { StorageProvider, useStorageData }
