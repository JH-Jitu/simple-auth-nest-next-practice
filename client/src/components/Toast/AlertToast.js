import { toast, ToastContainer } from "react-toastify";
export const AlertToast = (event, msg = "Successful") => {
  //   console.log(event);
  if (event === "success") {
    toast.success(msg, {
      // position: toast.POSITION.TOP_RIGHT,
      className: "foo-bar",
    });
  } else if (event?.response?.statusText === "Internal Server Error") {
    toast.error(msg, {
      // position: toast.POSITION.TOP_RIGHT,
      className: "foo-bar",
    });
  } else {
    toast.error(msg, {
      // position: toast.POSITION.TOP_RIGHT,
      className: "foo-bar",
    });
  }
};
