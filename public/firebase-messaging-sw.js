// // public/firebase-messaging-sw.js

// self.addEventListener("push", function (event) {
//     const payload = event.data.json();
  
//     const title = payload.notification.title;
//     const options = {
//       body: payload.notification.body,
//       icon: "/logo.png",
//     };
  
//     event.waitUntil(
//       self.registration.showNotification(title, options)
//     );
//   });
  