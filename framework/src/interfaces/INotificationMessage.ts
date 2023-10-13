
export interface INotificationMessage {
  targetRoom: string;
  type: string;
  showToast: boolean;
  toastTitle: string;
  toastMessage: string;
  toastType: "success" | "info" | "error" | "warining";
  messageData: string;
  controlsToRefresh: Array<string>;
  sourceType: "user" | "server";
  sourceDisplayName: string;
  userId: string;
}
