import { UserType } from "./enum.interface";
import { IUser } from "./user.interface";
import { ServiceEnum } from "./cargo.interface";

export interface IRating {
  activityID: string;
  rating: number;
  reviews: string[];
  _id: string;
  ratedByType: UserType;
  ratedBy: IUser;
  service: ServiceEnum;
  createdAt: string;
}
export enum ReviewEnum {
  // 1 Star
  VERY_POOR_EXPERIENCE = "Very poor experience.",
  PICKUP_DELAYED = "Pickup was delayed.",
  DELIVERY_DAMAGED = "Delivery was damaged.",
  NO_SUPPORT = "No support at all.",
  RUDE_BEHAVIOR = "Driver was rude.",
  UNACCEPTABLE_SERVICE = "Unacceptable service.",
  WONT_USE_AGAIN = "Won’t use again.",
  DRIVER_DIDNT_ARRIVE = "Driver didn’t arrive.",
  VENDOR_UNRESPONSIVE = "Vendor was unresponsive.",
  MISMANAGED_PICKUP = "Mismanaged pickup.",
  NO_UPDATES = "No updates provided.",
  LATE_WITHOUT_REASON = "Late without reason.",
  DIDNT_FOLLOW_INSTRUCTIONS = "Didn’t follow instructions.",

  // 2 Star
  BELOW_AVERAGE_SERVICE = "Below average service.",
  MINOR_DAMAGE = "Minor damage on delivery.",
  SUPPORT_SLOW = "Support was slow.",
  COULD_BE_BETTER = "Could be better.",
  MEDIOCRE_COMMUNICATION = "Mediocre communication.",
  NOT_FULLY_SATISFIED = "Not fully satisfied.",
  SLOW_RESPONSE = "Slow response time.",
  SLIGHT_MISCOMMUNICATION = "Slight miscommunication.",
  MILD_DELAY = "Mild delay in pickup.",
  PACKAGING_NOT_PROPER = "Packaging not proper.",
  NEEDS_BETTER_COORDINATION = "Needs better coordination.",

  // 3 Star
  AVERAGE_EXPERIENCE = "Average experience.",
  SERVICE_OKAY = "Service was okay.",
  DELIVERY_FINE = "Delivery was fine.",
  ROOM_FOR_IMPROVEMENT = "Room for improvement.",
  GOT_THE_JOB_DONE = "Got the job done.",
  COULD_IMPROVE_TRACKING = "Could improve tracking.",
  NEUTRAL_EXPERIENCE = "Neutral experience.",
  SLIGHT_COORDINATION_LAG = "Slight coordination lag.",
  REASONABLE_EXPERIENCE = "Reasonable experience.",

  // 4 Star
  GOOD_SERVICE_OVERALL = "Good service overall.",
  DELIVERED_ON_TIME = "Delivered on time.",
  SAFE_PACKAGING = "Safe packaging.",
  RESPONSIVE_SUPPORT = "Responsive support.",
  MINOR_DELAYS_OKAY = "Minor delays but okay.",
  RELIABLE_EXPERIENCE = "Reliable experience.",
  WOULD_RECOMMEND = "Would recommend.",
  HELPFUL_STAFF = "Helpful staff.",
  PROMPT_DELIVERY = "Prompt delivery.",
  KEPT_ME_UPDATED = "Kept me updated.",
  SATISFIED_OVERALL = "Satisfied overall.",

  // 5 Star
  EXCELLENT_SERVICE = "Excellent service!",
  SUPER_FAST_DELIVERY = "Super fast delivery.",
  VERY_PROFESSIONAL = "Very professional.",
  WELL_PACKED_ITEMS = "Well-packed items.",
  SMOOTH_PROCESS = "Smooth process.",
  TOP_NOTCH_SUPPORT = "Top-notch support.",
  HIGHLY_RECOMMEND = "Highly recommend.",
  FRIENDLY_STAFF = "Very friendly staff.",
  PERFECT_COORDINATION = "Perfect coordination.",
  CLEAR_UPDATES = "Clear updates shared.",
  HANDLED_WELL = "Handled very well.",
  SUPER_COOPERATIVE = "Super cooperative.",
}
