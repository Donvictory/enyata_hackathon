import apiClient from "./api-client";

/**
 * Utility to convert VAPID public key
 */
function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Request permission and subscribe user to push notifications
 */
export async function subscribeUserToPush() {
  try {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.warn("Push notifications not supported");
      return;
    }

    const registration = await navigator.serviceWorker.ready;

    // Check if already subscribed
    const existingSubscription =
      await registration.pushManager.getSubscription();
    if (existingSubscription) {
      console.log("Already subscribed to push notifications");
      // Optionally sync with backend if needed
      await syncSubscriptionWithBackend(existingSubscription);
      return existingSubscription;
    }

    const publicVapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
    if (!publicVapidKey) {
      console.error("VITE_VAPID_PUBLIC_KEY not found in env");
      return;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });

    await syncSubscriptionWithBackend(subscription);
    console.log("Push notification subscription successful");
    return subscription;
  } catch (error) {
    console.error("Failed to subscribe to push notifications:", error);
  }
}

/**
 * Sync subscription object with backend
 */
async function syncSubscriptionWithBackend(subscription) {
  try {
    await apiClient.post("/users/subscribe-notifications", { subscription });
  } catch (error) {
    console.error("Failed to sync push subscription with backend:", error);
  }
}
