// utils/phoneUtils.js
import Swal from "sweetalert2";
import axios from "axios";
 

// ✅ Masking function
export const maskNumber = (num) => {
  if (!num) return "";
  const str = String(num);
  return str.length <= 4 ? str : "*".repeat(str.length - 4) + str.slice(-4);
};

// ✅ Click to Call function
export const clickToCall = ({ number, user, updateIframeSrc, toggleIframe }) => {
  if (!number) return;

  const digits = number.replace(/\D/g, "");
  const formatted = digits.length > 6 ? `0${digits.slice(-10)}` : digits;

  const newSrc = `https://${window.location.hostname}/softphone/Phone/click-to-dial.html?profileName=${user.full_name}&SipDomain=${window.location.hostname}&SipUsername=${user.user_id}&SipPassword=${user.password}&d=${formatted}`;

  updateIframeSrc(newSrc);
  toggleIframe("phone");
};

// ✅ Block Number function
export const blockNumber = async ({ number, blockedNumbers, setBlockedNumbers }) => {
  const ins_date = new Date().toISOString().slice(0, 19).replace("T", " ");

  if (blockedNumbers.includes(number)) {
    Swal.fire({
      icon: "info",
      title: "Already Blocked",
      text: `The number ${number} is already blocked.`,
    });
    return;
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const response = await axios.post(
      `https://${window.location.hostname}:4000/addBlock`,
      { block_no: number, ins_date },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    if (response.data.success) {
      Swal.fire({
        icon: "success",
        title: "Blocked",
        text: `Number ${number} has been successfully blocked.`,
      });
      setBlockedNumbers((prev) => [...prev, number]);
    } else {
      Swal.fire({ icon: "error", title: "Failed", text: "Could not block the number." });
    }
  } catch (error) {
    Swal.fire({ icon: "error", title: "Error", text: "Failed to block the number." });
  }
};
