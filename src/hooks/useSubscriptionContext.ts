// <== IMPORTS ==>
import {
  SubscriptionContext,
  SubscriptionContextValue,
} from "../context/SubscriptionContext";
import { useContext } from "react";

// <== USE SUBSCRIPTION CONTEXT HOOK ==>
export function useSubscriptionContext(): SubscriptionContextValue {
  // GET CONTEXT
  const context = useContext(SubscriptionContext);
  // THROW ERROR IF NOT WITHIN PROVIDER
  if (!context) {
    // THROW ERROR IF NOT WITHIN PROVIDER
    throw new Error(
      "useSubscriptionContext must be used within a SubscriptionProvider"
    );
  }
  // RETURN CONTEXT
  return context;
}
