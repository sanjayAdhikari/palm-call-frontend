import { AppIconType } from "interfaces";
import type { IconType } from "react-icons";
import { AiTwotoneShop } from "react-icons/ai";
import { BiWallet } from "react-icons/bi";
import { Bs0Circle, BsThreeDotsVertical } from "react-icons/bs";
import { FaGoogle, FaInfoCircle, FaUser } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { FiEdit } from "react-icons/fi";
import { GiWeight } from "react-icons/gi";
import { GoChevronRight, GoDotFill } from "react-icons/go";
import { HiOutlineUsers } from "react-icons/hi";
import {
  IoIosLogOut,
  IoIosRadioButtonOff,
  IoIosRadioButtonOn,
  IoIosSend,
  IoMdCheckmarkCircleOutline,
  IoMdCloseCircle,
  IoMdRefresh,
} from "react-icons/io";
import {
  IoAddOutline,
  IoArrowBack,
  IoCaretDown,
  IoClose,
  IoEye,
  IoEyeOff,
  IoFilter,
  IoLocationSharp,
  IoNotificationsOutline,
  IoPrint,
  IoReceiptOutline,
  IoSearch,
} from "react-icons/io5";
import { LiaShoppingCartSolid } from "react-icons/lia";
import { LuBox, LuDownload } from "react-icons/lu";
import {
  MdCheckBox,
  MdOutlineAddBox,
  MdOutlineCheckBoxOutlineBlank,
  MdOutlineDeleteSweep,
  MdOutlineDeliveryDining,
} from "react-icons/md";
import { PiCoins, PiHandWithdraw, PiStrategy } from "react-icons/pi";
import {
  RiApps2Fill,
  RiCoupon2Line,
  RiDiscountPercentFill,
  RiFlightTakeoffFill,
  RiUserFollowLine,
  RiUserSharedLine,
} from "react-icons/ri";
import { RxHome } from "react-icons/rx";
import {
  TbArrowBadgeUp,
  TbCreditCardRefund,
  TbMessageCircleUser,
} from "react-icons/tb";
import { VscSettings } from "react-icons/vsc";

export function getIconsHandler(iconType: AppIconType): IconType {
  switch (iconType) {
    case AppIconType.EYE:
      return IoEye;
    case AppIconType.EYE_OFF:
      return IoEyeOff;
    case AppIconType.CUSTOMER:
      return HiOutlineUsers;
    case AppIconType.LOCATION:
      return IoLocationSharp;
    case AppIconType.KYC:
      return RiUserFollowLine;
    case AppIconType.DOT:
      return GoDotFill;
    case AppIconType.DISCOUNT:
      return RiDiscountPercentFill;
    case AppIconType.DOWN:
      return IoCaretDown;
    case AppIconType.FILTER:
      return IoFilter;
    case AppIconType.CLOSE:
      return IoClose;
    case AppIconType.REFUND:
      return TbCreditCardRefund;
    case AppIconType.PRINT:
      return IoPrint;
    case AppIconType.COMMODITY:
      return PiCoins;
    case AppIconType.HOME:
      return RxHome;
    case AppIconType.CHECK_FILL:
      return MdCheckBox;
    case AppIconType.CHECK_SQUARE:
      return MdOutlineCheckBoxOutlineBlank;
    case AppIconType.CONFIGURE:
      return VscSettings;
    case AppIconType.BADGE:
      return TbArrowBadgeUp;
    case AppIconType.VENDOR:
      return AiTwotoneShop;
    case AppIconType.COURIER_RATE:
      return PiStrategy;
    case AppIconType.DELIVERY_TYPE:
      return MdOutlineDeliveryDining;
    case AppIconType.NOTIFICATION:
      return IoNotificationsOutline;
    case AppIconType.CHECK:
      return FaCheck;
    case AppIconType.SEND:
      return IoIosSend;
    case AppIconType.GOOGLE:
      return FaGoogle;
    case AppIconType.INFO:
      return FaInfoCircle;
    case AppIconType.USER:
      return FaUser;
    case AppIconType.REFERRAL:
      return RiUserSharedLine;
    case AppIconType.COUPON:
      return RiCoupon2Line;
    case AppIconType.RECEIPT:
      return IoReceiptOutline;
    case AppIconType.CLOSE_FILL:
      return IoMdCloseCircle;
    case AppIconType.SUPPORT:
      return TbMessageCircleUser;
    case AppIconType.REFRESH:
      return IoMdRefresh;
    case AppIconType.DOWNLOAD:
      return LuDownload;
    case AppIconType.RADIO_OFF:
      return IoIosRadioButtonOff;
    case AppIconType.RADIO_ON:
      return IoIosRadioButtonOn;
    case AppIconType.WEIGHT:
      return GiWeight;
    case AppIconType.CHECK_CIRCLE:
      return IoMdCheckmarkCircleOutline;
    case AppIconType.EDIT:
      return FiEdit;
    case AppIconType.ADD_BOX:
      return MdOutlineAddBox;
    case AppIconType.DOTS:
      return BsThreeDotsVertical;
    case AppIconType.MORE_MENU:
      return RiApps2Fill;
    case AppIconType.PARCEL:
      return LuBox;
    case AppIconType.TRANSFER:
      return RiFlightTakeoffFill;
    case AppIconType.ADD:
      return IoAddOutline;
    case AppIconType.SEARCH:
      return IoSearch;
    case AppIconType.WALLET:
      return BiWallet;
    case AppIconType.RIGHT_ARROW:
      return GoChevronRight;
    case AppIconType.BACK:
      return IoArrowBack;
    case AppIconType.LOGOUT:
      return IoIosLogOut;
    case AppIconType.WITHDRAW:
      return PiHandWithdraw;
    case AppIconType.LOGISTICS:
      return LiaShoppingCartSolid;
    case AppIconType.DELETE:
      return MdOutlineDeleteSweep;
    default:
      return Bs0Circle;
  }
}
