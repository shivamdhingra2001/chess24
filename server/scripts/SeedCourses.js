// const mongoose = require("mongoose");
// const Course = require("../models/Course");

// const courses = [
//     {
//       title: "Mastering the Sicilian Defense",
//       instructor: "GM Magnus Carlsen",
//       description: "An advanced course on crushing opponents with the Sicilian.",
//       price: 999,
//       image: "https://images.chesscomfiles.com/uploads/v1/images_users/tiny_mce/TDChessU/php7kUdxW.jpeg",
//     },
//     {
//       title: "King’s Indian for Attackers",
//       instructor: "GM Hikaru Nakamura",
//       description: "Learn dynamic play with the King’s Indian Defense.",
//       price: 799,
//       image: "https://upload.wikimedia.org/wikipedia/commons/4/49/Kingsindian.jpg",
//     },
//     {
//       title: "Endgame Mastery",
//       instructor: "GM Anish Giri",
//       description: "Convert advantages with precision in the endgame.",
//       price: 699,
//       image: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Chess_endgame.jpg",
//     }
//   ];
  
  
//   async function seed() {
//     await Course.deleteMany({});
//     await Course.insertMany(courses);
//     console.log("✅ Courses seeded");
//     mongoose.disconnect();
//   }
  
//   seed();