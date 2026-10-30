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
        { screenNumber: 1, name: 'IMAX Laser 3D', totalSeats: 60, rows: 6, cols: 10 },
        { screenNumber: 2, name: 'Audi 2 Dolby Atmos', totalSeats: 60, rows: 6, cols: 10 }
      ]
    },
    {
      name: 'Cinepolis VIP Cinema - Grand Central',
      city: 'Mumbai',
      location: 'Seawoods Grand Central Mall, Navi Mumbai',
      screens: [
        { screenNumber: 1, name: 'VIP Screen 1 Recliner', totalSeats: 60, rows: 6, cols: 10 },
        { screenNumber: 2, name: 'Screen 2 4K Laser', totalSeats: 60, rows: 6, cols: 10 }
      ]
    },
    {
      name: 'INOX Megaplex - Horizon Mall',
      city: 'Delhi NCR',
      location: 'Sector 43, Golf Course Road, Gurugram',
      screens: [
        { screenNumber: 1, name: 'Megaplex Insignia', totalSeats: 60, rows: 6, cols: 10 },
        { screenNumber: 2, name: 'Screen 2 3D Atmos', totalSeats: 60, rows: 6, cols: 10 }
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
      title: 'Interstellar',
      description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft, along with a team of researchers, to find a new planet for humans.',
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
      title: 'Deadpool & Wolverine',
      description: 'Wolverine is recovering from his injuries when he crosses paths with the loudmouth Deadpool. They team up to defeat a common enemy in an irreverent, dimension-hopping adventure.',
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
      description: 'Jake Sully and Neytiri return to explore uncharted regions of Pandora, coming into contact with an aggressive volcanic Na’vi tribe known as the Ash People.',
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
      cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver'],
      certificate: 'UA'
    }
  ]
};

module.exports = seedData;
