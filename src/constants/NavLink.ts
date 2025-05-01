import { AppIconType, INavigationItem } from "interfaces";
import { PageLinks } from "./PageLinks";

export const NavLink: INavigationItem[] = [
  {
    name: "Chat",
    path: PageLinks.dashboard.list,
    icon: AppIconType.SUPPORT,
    showInMenu: true,
  },
  {
    name: "Peoples",
    path: PageLinks.customers.list,
    icon: AppIconType.CUSTOMER,
    showInMenu: true,
  }
];

