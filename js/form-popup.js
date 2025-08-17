
let googleFormUrl = "";
let formFieldIDs = {};
  
function openPopupArgs(gfurl,gfNameEntry,gfEmailEntry,gfMobileEntry,gfMessageEntry) {
	//alert("Hello openPopup !!");
	googleFormUrl =gfurl;
	formFieldIDs = 	{
		name: gfNameEntry,
		email: gfEmailEntry,
		mobile: gfMobileEntry,
		message: gfMessageEntry
	};
	popup.style.display = "block";
}

/*function openPopup() {
	//alert("Hello openPopup !!");
	popup.style.display = "block";
}
*/
function closePopup() {
	//alert("Hello closePopup !!");
	popup.style.display = "none";
	formStatus.innerHTML = "";
	formStatus.className = "";
	googleForm.reset();
}

const popup = document.getElementById("popup");
const googleForm = document.getElementById("googleForm");
const formStatus = document.getElementById("formstatus");
const submitButton = document.getElementById("submitButton");

/*const googleFormUrl = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSfLFsNhMY7WT38WEOy5Yji-X1hL8iWfE7AHMIjEpbyctwsPfQ/formResponse";
const formFieldIDs = {
	name: "entry.1820924",
	email: "entry.1869323879",
	mobile: "entry.1277797673",
	message: "entry.665800355"
};*/

googleForm.addEventListener("submit", async (e) => {
     e.preventDefault();
     submitButton.disabled = true;
     formStatus.innerHTML = "Submitting...";
     formStatus.className = "";

     const name = document.getElementById("name").value;
     const email = document.getElementById("email").value;
     const mobile = document.getElementById("mobile").value;
     const message = document.getElementById("message").value;

     const formData = new URLSearchParams();
     formData.append(formFieldIDs.name, name);
     formData.append(formFieldIDs.email, email);
     formData.append(formFieldIDs.mobile, mobile);
     formData.append(formFieldIDs.message, message);

     fetch(googleFormUrl, {
       method: "POST",
       mode: "no-cors",
       body: formData
     })
     .then(() => {
       formStatus.innerHTML = "✅ Thank you! Your message has been sent.";
       formStatus.className = "success";
       googleForm.reset();
	   
       // auto close popup after 3 sec
       setTimeout(() => { closePopup(); }, 3000);
     })
     .catch(() => {
       formStatus.innerHTML = "❌ Error. Please try again.";
       formStatus.className = "error";
     })
     .finally(() => {
       setTimeout(() => { submitButton.disabled = false; }, 1000);
     });
   });