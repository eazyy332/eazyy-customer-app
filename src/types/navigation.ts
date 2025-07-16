export type RootStackParamList = {
  Main: undefined;
  Login: undefined;
  Signup: undefined;
  NewOrder: undefined;
  OrderTracking: { orderId: string };
  OrderHistory: undefined;
  Account: undefined;
  Notifications: undefined;
  ServiceSelection: undefined;
  ItemSelection: { serviceType: string; serviceId: string };
  TimeSlotSelection: undefined;
  AddressSelection: undefined;
  OrderSummary: undefined;
  ProofOfDelivery: { orderId: string };
  Cart: undefined;
  ChangePassword: undefined;
  CustomQuotes: undefined;
  DiscrepancyReview: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Orders: undefined;
  Account: undefined;
}; 