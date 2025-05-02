export default {
  auth: {
    post_login: "/api/v1/user/login",
    get_currentProfile: "/api/v1/user/current",
    get_unReadCount: "/api/v1/notification/unread-count",
    delete_logout: "/api/v1/user/logout",
    put_editProfile: "/api/v1/user/edit-profile",
  },
  deliveryType: {
    get_lists: "/api/v1/delivery-type/",
    get_details: (id: string) => `/api/v1/delivery-type/detail/${id}`,
    post_save: "/api/v1/delivery-type/",
    put_update: "/api/v1/delivery-type/",
    put_toggleVisibility: (id: string, status: boolean) =>
      `/api/v1/delivery-type/toggle-visibility/${id}/${status}`,
    delete_remove: (id: string) => `/api/v1/delivery-type/delete/${id}`,
  },
  file: {
    post_upload: "/api/v1/file/",
    get_file: (name: string) => `/api/v1/file/detail/${name}`,
    delete_file: (name: string) => `/api/v1/file/delete/${name}`,
  },
  referral: {
    get_history: "/api/v1/referral/",
    post_apply: (code: string) => `/api/v1/referral/apply/${code}`,
  },
  user: {
    get_lists: "/api/v1/user",
  },
  customers: {
    get_lists: "/api/v1/user/",
    get_details: (id: string) => `/api/v1/user/detail/${id}`,
  },
  badge: {
    get_lists: "/api/v1/badge/",
    get_details: (id: string) => `/api/v1/badge/detail/${id}`,
    post_save: "/api/v1/badge/",
    put_update: "/api/v1/badge/",
    put_toggleVisibility: (id: string, status: boolean) =>
      `/api/v1/badge/toggle-visibility/${id}/${status}`,
    delete_remove: (id: string) => `/api/v1/badge/delete/${id}`,
  },
  vendor: {
    get_deliveryPartner: "/api/v1/vendor/delivery-partner",
    get_lists: "/api/v1/vendor/",
    get_details: (id: string) => `/api/v1/vendor/detail/${id}`,
    post_save: "/api/v1/vendor/",
    put_update: "/api/v1/vendor/",
    put_toggleVisibility: (id: string, status: boolean) =>
      `/api/v1/vendor/toggle-visibility/${id}/${status}`,
    delete_remove: (id: string) => `/api/v1/vendor/delete/${id}`,
  },
  consignee: {
    get_lists: "/api/v1/consignee",
    get_details: (id: string) => `/api/v1/consignee/detail/${id}`,
    post_save: "/api/v1/consignee",
    put_update: "/api/v1/consignee",
    put_toggleVisibility: (id: string, status: boolean) =>
      `/api/v1/consignee/toggle-visibility/${id}/${status}`,
    delete_remove: (id: string) => `/api/v1/consignee/delete/${id}`,
  },
  commodity: {
    get_lists: "/api/v1/commodity",
    get_details: (id: string) => `/api/v1/commodity/detail/${id}`,
    post_save: "/api/v1/commodity",
    put_update: "/api/v1/commodity",
    put_toggleVisibility: (id: string, status: boolean) =>
      `/api/v1/commodity/toggle-visibility/${id}/${status}`,
    delete_remove: (id: string) => `/api/v1/commodity/delete/${id}`,
  },
  rating: {
    get_received: "/api/v1/rating/receives",
    get_averageRating: "/api/v1/rating/average",
    get_given: "/api/v1/rating/given",
    post_save: "/api/v1/rating/",
    get_ratingDetails: (activity: string) =>
      `/api/v1/rating/activity/${activity}`,
    delete_remove: (id: string) => `/api/v1/rating/delete/${id}`,
  },
  coupon: {
    get_lists: "/api/v1/coupon",
    get_details: (id: string) => `/api/v1/coupon/detail/${id}`,
    post_save: "/api/v1/coupon",
    put_update: "/api/v1/coupon",
    put_toggleVisibility: (id: string, status: boolean) =>
      `/api/v1/coupon/toggle-visibility/${id}/${status}`,
    delete_remove: (id: string) => `/api/v1/coupon/delete/${id}`,
  },
  courierRate: {
    get_lists: (vendor: string) => `/api/v1/courier-rate/${vendor}`,
    get_details: (id: string) => `/api/v1/courier-rate/detail/${id}`,
    post_save: "/api/v1/courier-rate/",
    post_clone: "/api/v1/courier-rate/clone",
    put_update: "/api/v1/courier-rate/",
    put_toggleVisibility: (id: string, status: boolean) =>
      `/api/v1/courier-rate/toggle-visibility/${id}/${status}`,
    delete_remove: (id: string) => `/api/v1/courier-rate/delete/${id}`,
  },
  kyc: {
    get_lists: `/api/v1/kyc`,
    get_my: `/api/v1/kyc/my`,
    get_details: (id: string) => `/api/v1/kyc/detail/${id}`,
    post_save: "/api/v1/kyc/",
    put_update: "/api/v1/kyc/",
    put_updateStatus: (cId: string) => `/api/v1/kyc/action/${cId}`,
  },
  userOrder: {
    get_bidList: (srcCountry: string, destCountry: string, weight: number) =>
      `/api/v1/package/bid-list/${srcCountry}/${destCountry}/${weight}`,
    post_requestOrder: `/api/v1/package/`,
    get_calculateCourierRate: `/api/v1/courier-rate/calculate-courier-rate`,
  },
  activity: {
    get_list: `/api/v1/activity`,
    get_details: (id: string) => `/api/v1/activity/detail/${id}`,
    put_applyCoupon: (activityID: string, couponID: string) =>
      `/api/v1/activity/apply-coupon/${activityID}/${couponID}`,
    put_timeline: (activityID: string, timelineId: string) =>
      `/api/v1/package/timeline-remarks/${activityID}/${timelineId}`,
    delete_revokeCoupon: (activityID: string) =>
      `/api/v1/activity/revoke-coupon/${activityID}`,
  },
  notifications: {
    get_list: `/api/v1/notification/`,
    get_details: (id: string) => `/api/v1/notification/detail/${id}`,
    put_toggle: (id: string, status: "on" | "off") =>
      `/api/v1/notification/mark-read-unread/${id}/${status}`,
  },
  withdraw: {
    get_list: `/api/v1/withdraw`,
    get_account: `/api/v1/withdraw-account`,
    post_account: `/api/v1/withdraw-account`,
    post_requestWithdraw: `/api/v1/withdraw`,
    get_details: (request_id: string) =>
      `/api/v1/withdraw/detail/${request_id}`,
    put_reject: (id: string) => `/api/v1/withdraw/reject/${id}`,
    put_approve: (id: string) => `/api/v1/withdraw/approve/${id}`,
  },
  refund: {
    get_list: `/api/v1/refund`,
    get_details: (request_id: string) => `/api/v1/refund/detail/${request_id}`,
    put_reject: (id: string) => `/api/v1/refund/reject/${id}`,
    put_approve: (id: string) => `/api/v1/refund/approve/${id}`,
  },
  wallet: {
    get_my: `/api/v1/wallet`,
    get_transaction: `/api/v1/transaction`,
    get_transactionDetails: (id: string) => `/api/v1/transaction/detail/${id}`,
    post_esewaInitial: "/api/v1/wallet/esewa/initiate-payment",
    put_payThroughWallet: (id: string) =>
      `/api/v1/activity/pay-through-wallet/${id}`,
  },
  support: {
    get_threadList: `/api/v1/chat/threads`,
    get_threadDetail: (threadID: string) =>
      `/api/v1/chat/thread/detail/${threadID}`,
    get_threadByParticipant: (participantID: string) =>
      `/api/v1/chat/thread/participant/${participantID}`,
    get_chat: (threadID: string) => `/api/v1/chat/messages/${threadID}`,
    post_sendMessage: `/api/v1/chat/messages/`,
    delete_thread: (threadID: string) =>
      `/api/v1/chat/thread/delete/${threadID}`,
    put_changeStatus: `/api/v1/chat/thrad/change-status`,
  },
  package: {
    get_list: `/api/v1/package/`,
    get_wayBillDetails: (id: string) => `/api/v1/package/track/${id}`,
    get_deliveryType: `/api/v1/delivery-type`,
    get_courierCountry: `/api/v1/courier-rate/countries`,
    get_details: (id: string) => `/api/v1/package/detail/${id}`,
    put_edit: (id: string) => `/api/v1/package/edit/${id}`,
    post_fit: `/api/v1/package/fit`,
    put_receiveCashPayment: (id: string) =>
      `/api/v1/package/payment-cash/${id}`,
    put_accept: (id: string) => `/api/v1/package/accept/${id}`,
    put_reject: (id: string) => `/api/v1/package/reject/${id}`,
    put_assignPickup: (id: string) => `/api/v1/package/assign-pickup/${id}`,
    put_markDelivered: (id: string) => `/api/v1/package/delivered/${id}`,
    put_changeStatus: (id: string) => `/api/v1/package/timeline/${id}`,
    get_nextCTA: (id: string) => `/api/v1/package/next-cta/${id}`,
  },
};
