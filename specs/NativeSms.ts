import type { TurboModule } from "react-native";
import { TurboModuleRegistry } from "react-native";

export interface Spec extends TurboModule {
  isDefaultSmsApp(): Promise<boolean>;
  requestDefaultSmsApp(): void;
  sendSms(
    number: string,
    message: string,
    subscriptionId?: number | null
  ): Promise<boolean>;
  emitPendingMessagesToJs(): void;
  getActiveSubscriptions(): Promise<
    { subscriptionId: number; displayName: string; number: string }[]
  >;
}

export default TurboModuleRegistry.getEnforcing<Spec>("NativeSms");
