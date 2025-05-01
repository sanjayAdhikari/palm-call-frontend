import {
  GeneralStatusEnum,
  IAddress,
  PackageStatusEnum,
  ReviewEnum,
  ServiceEnum,
  SupportChatStatusEnum,
  UserType,
} from "interfaces";
import { PAGE_SIZE } from "constant";

export function capitalizeFirstLetter(str: string) {
  if (!str) return ""; // Handle empty or undefined input
  // Remove underscores and capitalize first letter
  str = str.replace(/_/g, " ");
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export const getSerialNumber = (index: number, currentPage: number) => {
  return (currentPage - 1) * PAGE_SIZE + index + 1;
};
export const StatusColor = {
  [GeneralStatusEnum.CANCELLED]: "#F44336",
  [GeneralStatusEnum.DONE]: "#4CAF50",
  [GeneralStatusEnum.PENDING]: "#FFC107",
  [GeneralStatusEnum.AMBIGUOUS]: "#673AB7",
};
export function getPackageStatusColor(status: PackageStatusEnum): string {
  const statusColors: Record<PackageStatusEnum, string> = {
    // Initial Inquiry & Order
    [PackageStatusEnum.SHIPMENT_QUERY]: "#FFC107", // Amber
    [PackageStatusEnum.SHIPMENT_ORDERED]: "#FF9800", // Orange

    // Acceptance by Hyre & Vendor
    [PackageStatusEnum.SHIPMENT_ACCEPTED_HYRE]: "#4CAF50", // Green
    [PackageStatusEnum.SHIPMENT_ACCEPTED_VENDOR]: "#8BC34A", // Light Green

    // Pickup & Official Booking
    [PackageStatusEnum.SHIPMENT_PICKUP_ASSIGN]: "#03A9F4", // Light Blue
    [PackageStatusEnum.SHIPMENT_DROPPED]: "#2196F3", // Blue
    [PackageStatusEnum.SHIPMENT_BOOKED]: "#3F51B5", // Indigo

    // Warehousing & Forwarding
    [PackageStatusEnum.IN_WAREHOUSE_FACILITY]: "#673AB7", // Deep Purple
    [PackageStatusEnum.SHIPMENT_DISPATCHED_TO_FORWARDER]: "#9C27B0", // Purple

    // Customs Clearance
    [PackageStatusEnum.SHIPMENT_UNDER_CUSTOM_CLEARANCE]: "#E91E63", // Pink
    [PackageStatusEnum.SHIPMENT_IN_CUSTOMS_WAREHOUSE]: "#F44336", // Red
    [PackageStatusEnum.SHIPMENT_DEPARTED]: "#FF5722", // Deep Orange

    // Departure & Transit
    [PackageStatusEnum.SHIPMENT_IN_TRANSIT]: "#795548", // Brown
    [PackageStatusEnum.SHIPMENT_DEPARTED_TRANSIT]: "#607D8B", // Blue Grey

    // Arrival & Destination Processing
    [PackageStatusEnum.SHIPMENT_ARRIVED_DESTINATION]: "#009688", // Teal
    [PackageStatusEnum.SHIPMENT_UNDER_DESTINATION_CUSTOMS_CLEARANCE]: "#00BCD4", // Cyan
    [PackageStatusEnum.SHIPMENT_IN_DESTINATION_WAREHOUSE]: "#4CAF50", // Green

    // Final Delivery Stages
    [PackageStatusEnum.OUT_FOR_DELIVERY]: "#CDDC39", // Lime
    [PackageStatusEnum.SHIPMENT_DELIVERED]: "#8BC34A", // Light Green

    // Rejections & Cancellations
    [PackageStatusEnum.REJECTED_HYRE]: "#F44336", // Red
    [PackageStatusEnum.REJECTED_VENDOR]: "#E91E63", // Pink
    [PackageStatusEnum.CANCELLED]: "#9E9E9E", // Grey
  };

  return statusColors[status] || "#000000"; // Default to black if status is unknown
}

const invalidTransitions: Record<
  SupportChatStatusEnum,
  SupportChatStatusEnum[]
> = {
  [SupportChatStatusEnum.OPEN]: [
    SupportChatStatusEnum.COMPLETED,
    SupportChatStatusEnum.ARCHIVED,
    SupportChatStatusEnum.BLOCKED,
  ],
  [SupportChatStatusEnum.BLOCKED]: [
    SupportChatStatusEnum.COMPLETED,
    SupportChatStatusEnum.ARCHIVED,
    SupportChatStatusEnum.OPEN,
  ],
  [SupportChatStatusEnum.COMPLETED]: [SupportChatStatusEnum.BLOCKED],
  [SupportChatStatusEnum.ARCHIVED]: [
    SupportChatStatusEnum.OPEN,
    SupportChatStatusEnum.BLOCKED,
    SupportChatStatusEnum.COMPLETED,
  ],
};

export const commaSeparator = (number: number) => {
  return number?.toLocaleString("en-IN");
};

export const getAddressHandler = (address: IAddress) => {
  return [address?.street, address?.city, address?.postalCode, address?.county]
    ?.filter((e) => e)
    ?.join(", ");
};
export const calcVolumetricWeight = (l?: number, b?: number, h?: number) => {
  return (l * b * h || 0) / 5000;
};

export const ReviewLabel = {
  [ServiceEnum.HYRE_CARGO]: {
    [UserType.USER]: {
      1: [
        ReviewEnum.VERY_POOR_EXPERIENCE,
        ReviewEnum.PICKUP_DELAYED,
        ReviewEnum.DELIVERY_DAMAGED,
        ReviewEnum.NO_SUPPORT,
        ReviewEnum.RUDE_BEHAVIOR,
        ReviewEnum.UNACCEPTABLE_SERVICE,
        ReviewEnum.WONT_USE_AGAIN,
      ],
      2: [
        ReviewEnum.BELOW_AVERAGE_SERVICE,
        ReviewEnum.MINOR_DAMAGE,
        ReviewEnum.SUPPORT_SLOW,
        ReviewEnum.COULD_BE_BETTER,
        ReviewEnum.MEDIOCRE_COMMUNICATION,
        ReviewEnum.NOT_FULLY_SATISFIED,
      ],
      3: [
        ReviewEnum.AVERAGE_EXPERIENCE,
        ReviewEnum.SERVICE_OKAY,
        ReviewEnum.DELIVERY_FINE,
        ReviewEnum.ROOM_FOR_IMPROVEMENT,
        ReviewEnum.GOT_THE_JOB_DONE,
      ],
      4: [
        ReviewEnum.GOOD_SERVICE_OVERALL,
        ReviewEnum.DELIVERED_ON_TIME,
        ReviewEnum.SAFE_PACKAGING,
        ReviewEnum.RESPONSIVE_SUPPORT,
        ReviewEnum.MINOR_DELAYS_OKAY,
        ReviewEnum.RELIABLE_EXPERIENCE,
        ReviewEnum.WOULD_RECOMMEND,
      ],
      5: [
        ReviewEnum.EXCELLENT_SERVICE,
        ReviewEnum.SUPER_FAST_DELIVERY,
        ReviewEnum.VERY_PROFESSIONAL,
        ReviewEnum.WELL_PACKED_ITEMS,
        ReviewEnum.SMOOTH_PROCESS,
        ReviewEnum.TOP_NOTCH_SUPPORT,
        ReviewEnum.HIGHLY_RECOMMEND,
      ],
    },
    [UserType.INTERNATIONAL_CARGO_VENDOR]: {
      1: [
        ReviewEnum.VENDOR_UNRESPONSIVE,
        ReviewEnum.MISMANAGED_PICKUP,
        ReviewEnum.NO_UPDATES,
        ReviewEnum.LATE_WITHOUT_REASON,
        ReviewEnum.DIDNT_FOLLOW_INSTRUCTIONS,
      ],
      2: [
        ReviewEnum.SLOW_RESPONSE,
        ReviewEnum.SLIGHT_MISCOMMUNICATION,
        ReviewEnum.MILD_DELAY,
        ReviewEnum.PACKAGING_NOT_PROPER,
        ReviewEnum.NEEDS_BETTER_COORDINATION,
      ],
      3: [
        ReviewEnum.AVERAGE_EXPERIENCE,
        ReviewEnum.COULD_IMPROVE_TRACKING,
        ReviewEnum.REASONABLE_EXPERIENCE,
        ReviewEnum.NEUTRAL_EXPERIENCE,
      ],
      4: [
        ReviewEnum.GOOD_SERVICE_OVERALL,
        ReviewEnum.RESPONSIVE_SUPPORT,
        ReviewEnum.HELPFUL_STAFF,
        ReviewEnum.RELIABLE_EXPERIENCE,
      ],
      5: [
        ReviewEnum.EXCELLENT_SERVICE,
        ReviewEnum.SUPER_FAST_DELIVERY,
        ReviewEnum.VERY_PROFESSIONAL,
        ReviewEnum.SUPER_COOPERATIVE,
        ReviewEnum.HANDLED_WELL,
      ],
    },
  },
  [ServiceEnum.HYRE_DOMESTIC_LOGISTIC]: {
    [UserType.USER]: {
      1: [
        ReviewEnum.DRIVER_DIDNT_ARRIVE,
        ReviewEnum.NO_SUPPORT,
        ReviewEnum.DELIVERY_DAMAGED,
        ReviewEnum.UNACCEPTABLE_SERVICE,
        ReviewEnum.VERY_POOR_EXPERIENCE,
      ],
      2: [
        ReviewEnum.SUPPORT_SLOW,
        ReviewEnum.SLIGHT_MISCOMMUNICATION,
        ReviewEnum.BELOW_AVERAGE_SERVICE,
        ReviewEnum.NOT_FULLY_SATISFIED,
        ReviewEnum.MEDIOCRE_COMMUNICATION,
      ],
      3: [
        ReviewEnum.AVERAGE_EXPERIENCE,
        ReviewEnum.DELIVERY_FINE,
        ReviewEnum.ROOM_FOR_IMPROVEMENT,
        ReviewEnum.NEUTRAL_EXPERIENCE,
      ],
      4: [
        ReviewEnum.GOOD_SERVICE_OVERALL,
        ReviewEnum.PROMPT_DELIVERY,
        ReviewEnum.KEPT_ME_UPDATED,
        ReviewEnum.SATISFIED_OVERALL,
        ReviewEnum.SAFE_PACKAGING,
      ],
      5: [
        ReviewEnum.EXCELLENT_SERVICE,
        ReviewEnum.SUPER_FAST_DELIVERY,
        ReviewEnum.FRIENDLY_STAFF,
        ReviewEnum.SMOOTH_PROCESS,
        ReviewEnum.HIGHLY_RECOMMEND,
      ],
    },
    [UserType.INTERNATIONAL_CARGO_VENDOR]: {
      1: [
        ReviewEnum.VENDOR_UNRESPONSIVE,
        ReviewEnum.MISMANAGED_PICKUP,
        ReviewEnum.NO_UPDATES,
        ReviewEnum.UNACCEPTABLE_SERVICE,
        ReviewEnum.LATE_WITHOUT_REASON,
      ],
      2: [
        ReviewEnum.SLOW_RESPONSE,
        ReviewEnum.BELOW_AVERAGE_SERVICE,
        ReviewEnum.SLIGHT_MISCOMMUNICATION,
        ReviewEnum.SUPPORT_SLOW,
      ],
      3: [
        ReviewEnum.AVERAGE_EXPERIENCE,
        ReviewEnum.SERVICE_OKAY,
        ReviewEnum.SLIGHT_COORDINATION_LAG,
        ReviewEnum.REASONABLE_EXPERIENCE,
      ],
      4: [
        ReviewEnum.GOOD_SERVICE_OVERALL,
        ReviewEnum.RESPONSIVE_SUPPORT,
        ReviewEnum.SAFE_PACKAGING,
        ReviewEnum.HELPFUL_STAFF,
      ],
      5: [
        ReviewEnum.EXCELLENT_SERVICE,
        ReviewEnum.CLEAR_UPDATES,
        ReviewEnum.PERFECT_COORDINATION,
        ReviewEnum.SUPER_COOPERATIVE,
        ReviewEnum.HANDLED_WELL,
      ],
    },
  },
};
