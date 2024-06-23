import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import "animate.css";

export default async function Fire(darkmode: boolean) {
  const Conponent = withReactContent(Swal);

  const Toast = await Conponent.mixin({
    toast: true,
    position: "bottom-right",
    showConfirmButton: false,
    timerProgressBar: true,
    padding: "1rem",
    background: "transparent",
    customClass: {
      popup: "swal-popup",
      title: darkmode ? "swal-title-dark" : "swal-title-light",
    },
    showClass: {
      popup: "animate__animated animate__fadeInUp",
    },
    hideClass: {
      popup: "animate__animated animate__fadeOutDown",
    },
  });

  return Toast;
}
