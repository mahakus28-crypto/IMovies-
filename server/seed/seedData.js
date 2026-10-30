const seedData = {
  adminUser: {
    name: 'IMovies Admin',
    email: 'admin@imovies.com',
    password: 'admin123',
    role: 'admin',
    phone: '+1 800 555 0199'
  },
  demoUser: {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'user123',
    role: 'user',
    phone: '+1 555 014 2883'
  },
  theatres: [
    {
      name: 'PVR IMAX & 4DX - Palladium',
      city: 'Mumbai',
      location: 'Level 4, High Street Phoenix, Lower Parel',
      screens: [
        { screenNumber: 1, name: 'IMAX Laser 3D Audi 1', totalSeats: 60, rows: 6, cols: 10 },
        { screenNumber: 2, name: 'Dolby Atmos Prime Audi 2', totalSeats: 60, rows: 6, cols: 10 }
      ]
    },
    {
      name: 'Cinepolis VIP Cinema - Grand Central',
      city: 'Mumbai',
      location: 'Seawoods Grand Central Mall, Navi Mumbai',
      screens: [
        { screenNumber: 1, name: 'VIP Screen 1 Recliner Lounge', totalSeats: 60, rows: 6, cols: 10 },
        { screenNumber: 2, name: 'Screen 2 4K Laser Projection', totalSeats: 60, rows: 6, cols: 10 }
      ]
    },
    {
      name: 'INOX Megaplex - Horizon Plaza',
      city: 'Delhi NCR',
      location: 'Sector 43, Golf Course Road, Gurugram',
      screens: [
        { screenNumber: 1, name: 'Megaplex Insignia Luxury', totalSeats: 60, rows: 6, cols: 10 },
        { screenNumber: 2, name: 'Screen 2 3D Surround Atmos', totalSeats: 60, rows: 6, cols: 10 }
      ]
    },
    {
      name: 'PVR Director\'s Cut - Ambience Mall',
      city: 'Delhi NCR',
      location: 'Ambience Mall, Vasant Kunj, New Delhi',
      screens: [
        { screenNumber: 1, name: 'Director\'s Lounge Audi 1', totalSeats: 60, rows: 6, cols: 10 },
        { screenNumber: 2, name: 'Dolby Vision Audi 2', totalSeats: 60, rows: 6, cols: 10 }
      ]
    },
    {
      name: 'PVR Forum Koramangala',
      city: 'Bengaluru',
      location: 'Hosur Road, Koramangala, Bengaluru',
      screens: [
        { screenNumber: 1, name: 'IMAX Experience Audi 1', totalSeats: 60, rows: 6, cols: 10 },
        { screenNumber: 2, name: '4DX Dynamic Audi 2', totalSeats: 60, rows: 6, cols: 10 }
      ]
    }
  ],
  movies: [
    {
      title: 'Dune: Part Two',
      description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.',
      duration: 166,
      genre: ['Action', 'Sci-Fi', 'Adventure'],
      language: 'English',
      releaseDate: new Date('2024-03-01'),
      rating: 8.8,
      posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
      trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
      status: 'now_showing',
      director: 'Denis Villeneuve',
      cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem'],
      certificate: 'UA'
    },
    {
      title: 'Oppenheimer',
      description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, examining the moral weight and political aftermath of humanity’s most destructive weapon.',
      duration: 180,
      genre: ['Biography', 'Drama', 'History'],
      language: 'English',
      releaseDate: new Date('2023-07-21'),
      rating: 8.9,
      posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=800&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1600&q=80',
      trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
      status: 'now_showing',
      director: 'Christopher Nolan',
      cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon', 'Robert Downey Jr.'],
      certificate: 'A'
    },
    {
      title: 'Spider-Man: Across the Spider-Verse',
      description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. When the heroes clash on how to handle a new threat, Miles must redefine what it means to be a hero.',
      duration: 140,
      genre: ['Animation', 'Action', 'Adventure'],
      language: 'English',
      releaseDate: new Date('2023-06-02'),
      rating: 8.7,
      posterUrl: 'https://images.unsplash.com/photo-1635805737707-575885ab0820?auto=format&fit=crop&w=800&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1600&q=80',
      trailerUrl: 'https://www.youtube.com/watch?v=cqGjhVJWtEg',
      status: 'now_showing',
      director: 'Joaquim Dos Santos, Kemp Powers',
      cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac'],
      certificate: 'U'
    },
    {
      title: 'Deadpool & Wolverine',
      description: 'Wolverine is recovering from his injuries when he crosses paths with the loudmouth Deadpool. They team up to defeat a common enemy in an irreverent, dimension-hopping adventure across the Marvel cinematic timeline.',
      duration: 128,
      genre: ['Action', 'Comedy', 'Sci-Fi'],
      language: 'English',
      releaseDate: new Date('2024-07-26'),
      rating: 8.2,
      posterUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1600&q=80',
      trailerUrl: 'https://www.youtube.com/watch?v=73_1biulkYk',
      status: 'now_showing',
      director: 'Shawn Levy',
      cast: ['Ryan Reynolds', 'Hugh Jackman', 'Emma Corrin'],
      certificate: 'A'
    },
    {
      title: 'Interstellar',
      description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humanity.',
      duration: 169,
      genre: ['Adventure', 'Drama', 'Sci-Fi'],
      language: 'English',
      releaseDate: new Date('2014-11-07'),
      rating: 8.7,
      posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80',
      trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
      status: 'now_showing',
      director: 'Christopher Nolan',
      cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
      certificate: 'UA'
    },
    {
      title: 'The Dark Knight',
      description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
      duration: 152,
      genre: ['Action', 'Crime', 'Drama'],
      language: 'English',
      releaseDate: new Date('2008-07-18'),
      rating: 9.0,
      posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1600&q=80',
      trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
      status: 'now_showing',
      director: 'Christopher Nolan',
      cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart', 'Michael Caine'],
      certificate: 'UA'
    },
    {
      title: 'Inception',
      description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
      duration: 148,
      genre: ['Action', 'Sci-Fi', 'Thriller'],
      language: 'English',
      releaseDate: new Date('2010-07-16'),
      rating: 8.8,
      posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
      trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
      status: 'now_showing',
      director: 'Christopher Nolan',
      cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page', 'Tom Hardy'],
      certificate: 'UA'
    },
    {
      title: 'Inside Out 2',
      description: 'Teenager Riley\'s mind headquarters undergoes a sudden demolition to make room for unexpected new Emotions: Anxiety, Envy, Ennui, and Embarrassment join Joy, Sadness, Anger, Fear, and Disgust.',
      duration: 96,
      genre: ['Animation', 'Adventure', 'Comedy'],
      language: 'English',
      releaseDate: new Date('2024-06-14'),
      rating: 8.4,
      posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80',
      trailerUrl: 'https://www.youtube.com/watch?v=LEjhY15eCx0',
      status: 'now_showing',
      director: 'Kelsey Mann',
      cast: ['Amy Poehler', 'Maya Hawke', 'Kensington Tallman', 'Liza Lapira'],
      certificate: 'U'
    },
    {
      title: 'The Batman',
      description: 'In his second year of fighting crime, Batman uncovers corruption in Gotham City that connects to his own family while facing a serial killer known as the Riddler who targets Gotham\'s elite.',
      duration: 176,
      genre: ['Action', 'Crime', 'Drama'],
      language: 'English',
      releaseDate: new Date('2022-03-04'),
      rating: 8.5,
      posterUrl: 'https://images.unsplash.com/photo-1531259683007-016a7b628fc3?auto=format&fit=crop&w=800&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1600&q=80',
      trailerUrl: 'https://www.youtube.com/watch?v=mqqft2x_Aa4',
      status: 'now_showing',
      director: 'Matt Reeves',
      cast: ['Robert Pattinson', 'Zoë Kravitz', 'Jeffrey Wright', 'Colin Farrell'],
      certificate: 'UA'
    },
    {
      title: 'Gladiator II',
      description: 'Years after witnessing the death of the revered hero Maximus at the hands of his uncle, Lucius must enter the Colosseum after his home is conquered by the tyrannical Emperors who now lead Rome with an iron fist.',
      duration: 148,
      genre: ['Action', 'Adventure', 'Drama'],
      language: 'English',
      releaseDate: new Date('2026-11-22'),
      rating: 8.5,
      posterUrl: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80',
      trailerUrl: 'https://www.youtube.com/watch?v=4rgYUipGJNo',
      status: 'upcoming',
      director: 'Ridley Scott',
      cast: ['Paul Mescal', 'Pedro Pascal', 'Denzel Washington'],
      certificate: 'A'
    },
    {
      title: 'Avatar: Fire and Ash',
      description: 'Jake Sully and Neytiri return to explore uncharted volcanic regions of Pandora, coming into contact with an aggressive volcanic Na’vi tribe known as the Ash People who challenge the balance of Eywa.',
      duration: 190,
      genre: ['Action', 'Adventure', 'Fantasy'],
      language: 'English',
      releaseDate: new Date('2026-12-19'),
      rating: 8.6,
      posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1600&q=80',
      trailerUrl: 'https://www.youtube.com/watch?v=d9MyW72ELq0',
      status: 'upcoming',
      director: 'James Cameron',
      cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver', 'Oona Chaplin'],
      certificate: 'UA'
    },
    {
      title: 'Mission: Impossible – The Final Reckoning',
      description: 'Ethan Hunt and his IMF team face their greatest challenge yet as they race against time to locate and dismantle the sentient entity before rogue superpowers weaponize it to destroy global security.',
      duration: 165,
      genre: ['Action', 'Adventure', 'Thriller'],
      language: 'English',
      releaseDate: new Date('2026-05-23'),
      rating: 8.7,
      posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
      trailerUrl: 'https://www.youtube.com/watch?v=NOhDyHNwvbc',
      status: 'upcoming',
      director: 'Christopher McQuarrie',
      cast: ['Tom Cruise', 'Hayley Atwell', 'Ving Rhames', 'Simon Pegg'],
      certificate: 'UA'
    }
  ]
};

module.exports = seedData;
