import Status from "@/models/Status";

export const getBackgroundStatusColor = (keuring, index) => {
  switch (keuring.status) {
    case Status.INGEPLAND:
      return "rgba(255, 103, 0, 0.7)";
    case Status.IN_BEHANDELING:
      return "rgba(255, 223, 0, 0.7)";
    case Status.CERTIFICAAT:
      return "rgba(50, 205, 50, 0.7)";
  }
  return "rgba(255, 36, 0, 0.7)";
};
