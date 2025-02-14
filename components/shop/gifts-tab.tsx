import { ShopCard } from "./shop-card";

const gifts = [
  {
    name: "Friendship Bracelet",
    description: "Glows with daily affirmations, changes color with mood",
    price: 100,
    image: "/gifts/bracelet.png",
  },
  {
    name: "Crown of Excellence",
    description: "Virtual flowers grow with achievements",
    price: 200,
    image: "/gifts/crown.png",
  },
  {
    name: "Dream Catcher",
    description: "Displays weekly goals achieved",
    price: 300,
    image: "/gifts/dreamcatcher.png",
  },
  {
    name: "Hat of Empathy",
    description: "Interacts with Maya, provides encouragement",
    price: 400,
    image: "/gifts/hat.png",
  },
  {
    name: "Hoodie",
    description: "Stores achievements, creates visual timeline",
    price: 500,
    image: "/gifts/hoodie.png",
  },
  {
    name: "Locket of Love",
    description: "Shows affirmations, creates fun selfie filters",
    price: 600,
    image: "/gifts/locket.png",
  },
  {
    name: "Enchanted Mirror",
    description: "Customizable, changes with accomplishments",
    price: 700,
    image: "/gifts/mirror.png",
  },
  {
    name: "Makeup Box",
    description: "Personal star map growing with achievements",
    price: 800,
    image: "/gifts/makeupbox.png",
  },
  {
    name: "Ring of Friendship",
    description: "Stores memories, creates surprise celebrations",
    price: 900,
    image: "/gifts/ring.png",
  },
  {
    name: "Sunglasses",
    description: "Customizable, changes with accomplishments",
    price: 1000,
    image: "/gifts/sunglasses.png",
  },
];

export function GiftsTab() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
      {gifts.map((gift) => (
        <ShopCard key={gift.name} item={gift} />
      ))}
    </div>
  );
}
