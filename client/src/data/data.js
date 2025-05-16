const courses = [
    {
      id: "course_1",
      title: "Master the Sicilian Defense",
      description: "An in-depth course on one of the most powerful chess openings.",
      instructor: "GM John Doe",
      price: 2500,
      content: [
        { heading: "Sicilian Game", text: "1.e4 e5 2.Nf3 Nc6 3.Bc4" },
        { heading: "Sicilian Defense", text: "1.e4 c5" },
      ],
      image: "../images/sicilian-defense-gpt.png"
    },
    {
      id: "course_2",
      title: "Endgame Secrets Revealed",
      description: "Learn critical endgame strategies used by grandmasters.",
      instructor: "GM Jane Smith",
      price: 1500,
      content: [
        { heading: "King and Pawn", text: "Opposition and square rule." },
        { heading: "Rook Endgames", text: "Lucena and Philidor positions." },
      ],
      image: "../images/endgame.png"
    },
    {
      id: "course_3",
      title: "Opening Principles",
      description: "Learn the fundamental principles of chess openings.",
      instructor: "GM Magnus Carlsen",
      price: 2000,
      content: [
        { heading: "King and Pawn", text: "Opposition and square rule." },
        { heading: "Rook Games", text: "Lucena and Philidor positions." },
      ],
      image: "../images/login.png"
    }
  ];
  
  export default courses;