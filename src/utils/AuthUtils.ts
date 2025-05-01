import { LocalStorageName } from "interfaces";

export const getAccessToken = (): string => {
  return localStorage.getItem(LocalStorageName.ACCESS_TOKEN);
};
export const getRefreshToken = (): string => {
  return localStorage.getItem(LocalStorageName.REFRESH_TOKEN);
};

export const setAccessToken = (token?: string) => {
  if (!token) {
    localStorage.removeItem(LocalStorageName.ACCESS_TOKEN);
    return;
  }
  localStorage.setItem(LocalStorageName.ACCESS_TOKEN, `Bearer ${token}`);
};
export const setRefreshToken = (token?: string) => {
  if (!token) {
    localStorage.removeItem(LocalStorageName.REFRESH_TOKEN);
    return;
  }
  localStorage.setItem(LocalStorageName.REFRESH_TOKEN, `Bearer ${token}`);
};
