type Toy = {
  id: string;
  name: string;
  slug: string;
  categories: {
    id: number;
    name: string;
  };
  brand: string;
  price: number;
  age_range: string;
  image: string;
  description: string;
  created_at: string;
  updated_at: string;
};

type Toys = Toy[];

export const toysData: Toys = [
  {
    id: "T001",
    name: "Rocket Shooter",
    slug: "rocket-shooter",
    categories: {
      id: 1,
      name: "Outdoor Toys",
    },
    brand: "KidX",
    price: 75000,
    age_range: "5-10",
    image: "https://example.com/toys/rocket_shooter.png",
    description: "Mainan roket busa untuk aktivitas outdoor.",
    created_at: "2025-01-01T10:00:00Z",
    updated_at: "2025-01-01T10:00:00Z",
  },
  {
    id: "T002",
    name: "Building Blocks Set",
    slug: "building-blocks-set",
    categories: {
      id: 2,
      name: "Educational Toys",
    },
    brand: "EduFun",
    price: 125000,
    age_range: "3-8",
    image: "https://example.com/toys/building_blocks.png",
    description: "Set blok bangunan berwarna-warni untuk kreativitas.",
    created_at: "2025-01-02T09:30:00Z",
    updated_at: "2025-01-05T14:20:00Z",
  },
  {
    id: "T003",
    name: "Remote Control Car",
    slug: "remote-control-car",
    categories: {
      id: 3,
      name: "Electronic Toys",
    },
    brand: "TechToy",
    price: 250000,
    age_range: "6-12",
    image: "https://example.com/toys/rc_car.png",
    description: "Mobil RC dengan kecepatan tinggi dan lampu LED.",
    created_at: "2025-01-03T11:15:00Z",
    updated_at: "2025-01-03T11:15:00Z",
  },
  {
    id: "T004",
    name: "Doctor Playset",
    slug: "doctor-playset",
    categories: {
      id: 4,
      name: "Role Play",
    },
    brand: "PlayLearn",
    price: 95000,
    age_range: "4-7",
    image: "https://example.com/toys/doctor_set.png",
    description: "Set dokter lengkap dengan stetoskop dan alat medis mainan.",
    created_at: "2025-01-04T08:45:00Z",
    updated_at: "2025-01-10T16:30:00Z",
  },
  {
    id: "T005",
    name: "Water Gun",
    slug: "water-gun",
    categories: {
      id: 1,
      name: "Outdoor Toys",
    },
    brand: "AquaFun",
    price: 55000,
    age_range: "5-10",
    image: "https://example.com/toys/water_gun.png",
    description: "Pistol air dengan kapasitas besar untuk bermain outdoor.",
    created_at: "2025-01-05T13:20:00Z",
    updated_at: "2025-01-05T13:20:00Z",
  },
  {
    id: "T006",
    name: "Magnetic Drawing Board",
    slug: "magnetic-drawing-board",
    categories: {
      id: 2,
      name: "Educational Toys",
    },
    brand: "ArtMagic",
    price: 65000,
    age_range: "3-6",
    image: "https://example.com/toys/drawing_board.png",
    description:
      "Papan gambar magnetik yang bisa dihapus dan digunakan kembali.",
    created_at: "2025-01-06T10:10:00Z",
    updated_at: "2025-01-08T11:45:00Z",
  },
  {
    id: "T007",
    name: "Robot Dinosaur",
    slug: "robot-dinosaur",
    categories: {
      id: 3,
      name: "Electronic Toys",
    },
    brand: "RoboKid",
    price: 320000,
    age_range: "5-10",
    image: "https://example.com/toys/robot_dino.png",
    description:
      "Dinosaurus robotik yang bisa berjalan dan mengeluarkan suara.",
    created_at: "2025-01-07T14:50:00Z",
    updated_at: "2025-01-07T14:50:00Z",
  },
  {
    id: "T008",
    name: "Kitchen Set",
    slug: "kitchen-set",
    categories: {
      id: 4,
      name: "Role Play",
    },
    brand: "PlayHouse",
    price: 180000,
    age_range: "3-8",
    image: "https://example.com/toys/kitchen_set.png",
    description: "Set dapur mainan lengkap dengan peralatan masak.",
    created_at: "2025-01-08T09:00:00Z",
    updated_at: "2025-01-12T15:20:00Z",
  },
  {
    id: "T009",
    name: "Flying Disc",
    slug: "flying-disc",
    categories: {
      id: 1,
      name: "Outdoor Toys",
    },
    brand: "SkyPlay",
    price: 35000,
    age_range: "6-12",
    image: "https://example.com/toys/flying_disc.png",
    description: "Frisbee warna-warni untuk bermain di taman.",
    created_at: "2025-01-09T11:30:00Z",
    updated_at: "2025-01-09T11:30:00Z",
  },
  {
    id: "T010",
    name: "Alphabet Puzzle",
    slug: "alphabet-puzzle",
    categories: {
      id: 2,
      name: "Educational Toys",
    },
    brand: "LearnSmart",
    price: 75000,
    age_range: "2-5",
    image: "https://example.com/toys/alphabet_puzzle.png",
    description: "Puzzle kayu dengan huruf alfabet untuk belajar membaca.",
    created_at: "2025-01-10T08:15:00Z",
    updated_at: "2025-01-15T10:40:00Z",
  },
];
