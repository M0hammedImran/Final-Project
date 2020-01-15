// // const firstName = document.getElementById("fname").value;
// let users = [];

// const evaluate = event => {
//   event.preventDefault();
//   let email1 = document.getElementById("email1").value;
//   let email2 = document.getElementById("email2").value;
//   if (email1 === email2) {
//     console.log("Success");
//   } else {
//     console.log("Not Same");
//   }

//   function getAge() {
//     var dateString = document.getElementById("date").value;
//     console.log(dateString);
//     if (dateString != "") {
//       var today = new Date();
//       var birthDate = new Date(dateString);
//       var age = today.getFullYear() - birthDate.getFullYear();
//       var m = today.getMonth() - birthDate.getMonth();
//       var da = today.getDate() - birthDate.getDate();
//       if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
//         age--;
//       }
//       if (m < 0) {
//         m += 12;
//       }
//       if (da < 0) {
//         da += 30;
//       }

//       if (age < 18 || age > 100) {
//         alert("Age " + age + " is restrict");
//       }
//     } else {
//       alert("please provide your date of birth");
//     }
//     return true;
//   }
//   const valid = getAge();
//   console.log(valid);
//   //   if (valid) {
//   //     document.querySelector("#myForm").submit();
//   //     console.log("success");
//   //   }
// };

// document.getElementById("btn").addEventListener("click", evaluate);
