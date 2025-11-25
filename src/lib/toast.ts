// <== IMPORTS ==>
import { toast as sonnerToast } from "sonner";
import { useAuthStore } from "../store/useAuthStore";

/**
 * GET TOAST CLASSNAME BASED ON AUTHENTICATION STATE
 * @returns Object with Toast ClassNames
 */
const getToastClassNames = () => {
  // GET AUTH STATE
  const { isAuthenticated } = useAuthStore.getState();
  // RETURN CLASSNAMES BASED ON AUTH STATE
  if (isAuthenticated) {
    return {
      toast: "toast-authenticated",
      success: "toast-success-authenticated",
      error: "toast-error",
      info: "toast-info",
      warning: "toast-warning",
    };
  } else {
    return {
      toast: "toast-public",
      success: "toast-success-public",
      error: "toast-error",
      info: "toast-info",
      warning: "toast-warning",
    };
  }
};

/**
 * TOAST SUCCESS FUNCTION
 */
export const toast = {
  // <== SUCCESS TOAST FUNCTION ==>
  success: (
    message: string,
    options?: Parameters<typeof sonnerToast.success>[1]
  ) => {
    // GET TOAST CLASSNAMES
    const classNames = getToastClassNames();
    // RETURN SUCCESS TOAST
    return sonnerToast.success(message, {
      ...options,
      classNames: {
        toast: `${classNames.toast} ${classNames.success}`,
        icon: "toast-icon",
        ...options?.classNames,
      },
    });
  },
  // <== ERROR TOAST FUNCTION ==>
  error: (
    message: string,
    options?: Parameters<typeof sonnerToast.error>[1]
  ) => {
    // GET TOAST CLASSNAMES
    const classNames = getToastClassNames();
    // RETURN ERROR TOAST
    return sonnerToast.error(message, {
      ...options,
      classNames: {
        toast: `${classNames.toast} ${classNames.error}`,
        icon: "toast-icon",
        ...options?.classNames,
      },
    });
  },
  // <== INFO TOAST FUNCTION ==>
  info: (message: string, options?: Parameters<typeof sonnerToast.info>[1]) => {
    // GET TOAST CLASSNAMES
    const classNames = getToastClassNames();
    // RETURN INFO TOAST
    return sonnerToast.info(message, {
      ...options,
      classNames: {
        toast: `${classNames.toast} ${classNames.info}`,
        icon: "toast-icon",
        ...options?.classNames,
      },
    });
  },
  // <== WARNING TOAST FUNCTION ==>
  warning: (
    message: string,
    options?: Parameters<typeof sonnerToast.warning>[1]
  ) => {
    // GET TOAST CLASSNAMES
    const classNames = getToastClassNames();
    // RETURN WARNING TOAST
    return sonnerToast.warning(message, {
      ...options,
      classNames: {
        toast: `${classNames.toast} ${classNames.warning}`,
        icon: "toast-icon",
        ...options?.classNames,
      },
    });
  },
};
