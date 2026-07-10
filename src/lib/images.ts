/**
 * Central image URL map for all SUNAB product & site images.
 * Uses high-quality Pexels stock photos so images are always available
 * regardless of where the app is deployed (no local file dependency).
 */

export const IMAGES = {
  // Hero / About page background — dark elegant bathroom with marble freestanding tub
  heroBathtub:
    "https://images.pexels.com/photos/34119216/pexels-photo-34119216.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop",

  // Product: وان الماس (Almas Bathtub) — stylish white freestanding tub in dark bathroom
  almas:
    "https://images.pexels.com/photos/9695823/pexels-photo-9695823.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop",
  almas2:
    "https://images.pexels.com/photos/6758509/pexels-photo-6758509.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop",

  // Product: جکوزی سافایر (Sapphire Jacuzzi) — luxurious whirlpool tub with LED light
  sapphire:
    "https://images.pexels.com/photos/29887335/pexels-photo-29887335.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop",

  // Product: وان سلطنتی پارس (Pars Royal Bathtub) — gold legs clawfoot bathtub ornate
  pars:
    "https://images.pexels.com/photos/12059391/pexels-photo-12059391.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop",

  // Product: جکوزی اینفینیتی (Infinity Jacuzzi) — infinity pool terrace sunset
  infinity:
    "https://images.pexels.com/photos/23696835/pexels-photo-23696835.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop",

  // Product: زیردوشی اسلات (Nordic/Slate Shower Tray) — walk-in glass shower dark tiles
  nordic:
    "https://images.pexels.com/photos/27638183/pexels-photo-27638183.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop",

  // Product: زیردوشی کوارتز (Rose/Quartz Shower Tray) — modern white shower enclosure
  rose:
    "https://images.pexels.com/photos/11208973/pexels-photo-11208973.jpeg?auto=compress&cs=tinysrgb&w=800&h=1000&fit=crop",

  // Extra background images for slider / showcase
  bathroomShowcase:
    "https://images.pexels.com/photos/6265839/pexels-photo-6265839.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop",
  bathroomModern:
    "https://images.pexels.com/photos/7614405/pexels-photo-7614405.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop",
} as const;
