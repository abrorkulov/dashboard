const brands = [
    {
      id: 1,
      name: "Crafers",
      category: "Qandolat",
      instagram: "@crafersuz",
      telegram: "@crafersuz",
      phone: "+998 71 207 72 07",
      address: "Toshkent, 879P+97R",
      workingHours: "10:00-22:00"
    },
    {
      id: 2,
      name: "Soul Artisan Bakery",
      category: "Nonvoyxona",
      instagram: "@soulartisanbakery",
      telegram: "@soulartisanbakery",
      phone: "+998 97 184 66 88",
      address: "Toshkent, Parkent ko‘chasi, 219",
      workingHours: "08:00-00:00"
    },
    {
      id: 3,
      name: "Popuk",
      category: "Aksessuarlar",
      instagram: "@popuk",
      telegram: "@popuk",
      phone: "+998 90 919 20 22",
      address: "Toshkent, Ipakchi, 7-Y, Tupik Mironshokh",
      workingHours: "24 soat"
    },
    {
      id: 4,
      name: "Urban Store",
      category: "Kiyim",
      instagram: "@urbanstoretashkent",
      telegram: "@urbanstoretashkent",
      phone: "+998 95 198 56 56",
      address: "Toshkent, Tarasa Shevchenko ko‘chasi, 40A",
      workingHours: "09:30-21:00"
    },
    {
      id: 5,
      name: "Magic Stones Uz",
      category: "Sovg‘a va bijuteriya",
      instagram: "@magicstonesuz",
      telegram: "@magicstonesuz",
      phone: "+998 90 966 28 20",
      address: "Toshkent, Mirobod ko‘chasi, 12",
      workingHours: "10:00-02:00"
    },
    {
      id: 6,
      name: "COCOCHOU BAKERY",
      category: "Nonvoyxona",
      instagram: "@cocochou",
      telegram: "@cocochou",
      phone: "+998 50 003 80 63",
      address: "Toshkent, Mirobod ko‘chasi, 39",
      workingHours: "09:00-23:00"
    },
    {
      id: 7,
      name: "Korzinka",
      category: "Supermarket",
      instagram: "@korzinka.uz",
      telegram: "@korzinkauzb",
      phone: "+998 78 140 14 14",
      address: "Toshkent, Yusuf Xos Hojib ko‘chasi, 1",
      workingHours: "24 soat"
    },
    {
      id: 8,
      name: "Texnomart",
      category: "Maishiy texnika",
      instagram: "@texnomart",
      telegram: "@texnomart",
      phone: "+998 71 209 99 44",
      address: "Toshkent, Avliyoota ko‘chasi, 4",
      workingHours: "09:00-22:00"
    },
    {
      id: 9,
      name: "MediaPark",
      category: "Maishiy texnika",
      instagram: "@mediapark_uzb",
      telegram: "@mediapark_uzb",
      phone: "+998 71 203 33 33",
      address: "Toshkent, Qoratash ko‘chasi, 11A",
      workingHours: "09:00-21:00"
    },
    {
      id: 10,
      name: "Bellissimo Pizza",
      category: "Fast food",
      instagram: "@bellissimouz",
      telegram: "@bellissimo_bot",
      phone: "+998 71 203 66 66",
      address: "Toshkent, Bobur ko‘chasi, 6",
      workingHours: "10:00-02:30"
    },
    {
      id: 11,
      name: "Oqtepa Lavash",
      category: "Fast food",
      instagram: "@oqtepalavash",
      telegram: "@oqtepalavash_bot",
      phone: "+998 78 150 00 30",
      address: "Toshkent, Amir Temur shoh ko‘chasi, 98",
      workingHours: "09:00-03:00"
    },
    {
      id: 12,
      name: "Safia",
      category: "Qandolat",
      instagram: "@safiabakery",
      telegram: "@safiabakery",
      phone: "+998 78 113 40 40",
      address: "Toshkent, Bunyodkor shoh ko‘chasi, 6",
      workingHours: "08:00-23:00"
    },
    {
      id: 13,
      name: "Galeria",
      category: "Uy-ro‘zg‘or buyumlari",
      instagram: "@galeria",
      telegram: "@galeria_uzbekistan",
      phone: "+998 95 188 09 13",
      address: "Toshkent, Amir Temur shoh ko‘chasi, 22/2",
      workingHours: "Aniq ko‘rsatilmagan"
    },
    {
      id: 14,
      name: "G-Shop",
      category: "Kompyuter texnikasi",
      instagram: "@gshop",
      telegram: "@gshopuz",
      phone: "+998 99 511 48 88",
      address: "Toshkent, Buyuk Ipak Yo‘li ko‘chasi, 28",
      workingHours: "10:00-22:00"
    },
    {
      id: 15,
      name: "Main Street",
      category: "Kafe",
      instagram: "@mainstreetuz",
      telegram: "@mainstreetuz",
      phone: "+998 71 203 55 53",
      address: "Toshkent, Islom Karimov ko‘chasi, 8",
      workingHours: "Aniq ko‘rsatilmagan"
    },
    {
        id: 16,
      name: "Asaxiy",
      category: "Internet do‘kon",
      instagram: "@asaxiyshop",
      telegram: "@asaxiyuz",
      phone: "+998 71 200 01 05",
      address: "Toshkent, Bunyodkor shoh ko‘chasi, 23",
      workingHours: "09:00-21:00"
    },
    {
      id: 17,
      name: "Coffee Corner",
      category: "Qahvaxona",
      instagram: "@coffeecorner",
      telegram: "@CoffeeCornerUz",
      phone: "+998 95 199 19 93",
      address: "Toshkent, Amir Temur shoh ko‘chasi, 24",
      workingHours: "08:00-21:00"
    },
    {
      id: 18,
      name: "Socials Cafe",
      category: "Kafe",
      instagram: "@socials_uz",
      telegram: "@socials_uz",
      phone: "+998 77 338 88 11",
      address: "Toshkent, Tarasa Shevchenko ko‘chasi, 36A",
      workingHours: "08:00-01:00"
    },
    {
      id: 19,
      name: "Koinot Restaurant",
      category: "Restoran",
      instagram: "@koinot_restaurant",
      telegram: "@tower",
      phone: "+998 99 898 11 11",
      address: "Toshkent, Amir Temur shoh ko‘chasi, 109",
      workingHours: "Aniq ko‘rsatilmagan"
    },
    {
      id: 20,
      name: "The Kitchen",
      category: "Fast food / Kafe",
      instagram: "@thekitchenuz",
      telegram: "@thekitchenbistro",
      phone: "+998 99 800 68 00",
      address: "Toshkent, Afrosiyob ko‘chasi, 12A",
      workingHours: "08:00-23:00"
    },
    {
      id: 21,
      name: "Zira Bakery",
      category: "Qandolat",
      instagram: "@zirauz_bakery",
      telegram: "@zira_bakery",
      phone: "+998 78 333 55 14",
      address: "Toshkent, Parkent ko‘chasi, 26A",
      workingHours: "Aniq ko‘rsatilmagan"
    },
    {
      id: 22,
      name: "Midas Bakery",
      category: "Nonvoyxona",
      instagram: "@midasbakery",
      telegram: "@MIDAS_BAKERY",
      phone: "+998 97 100 58 68",
      address: "Toshkent, Buyuk Ipak Yo‘li ko‘chasi, 152",
      workingHours: "Aniq ko‘rsatilmagan"
    },
    {
      id: 23,
      name: "Tovar.uz",
      category: "Internet savdo",
      instagram: "@tovar",
      telegram: "@tovaruz_official",
      phone: "+998 78 140 65 70",
      address: "Toshkent, Mirzo Ulug‘bek shoh ko‘chasi, 30",
      workingHours: "Aniq ko‘rsatilmagan"
    },
    {
      id: 24,
      name: "Gallery Restaurant & Lounge",
      category: "Restoran",
      instagram: "@gallery_lounge_restaurant",
      telegram: "@Gallery_lounge_restaurant",
      phone: "+998 95 195 07 07",
      address: "Toshkent, Imom At-Termiziy ko‘chasi, 8",
      workingHours: "12:00-03:00"
    },
    {
      id: 25,
      name: "Bon!",
      category: "Kafe / Qandolat",
      instagram: "@boncafe",
      telegram: "@bon_uzbot",
      phone: "+998 71 280 51 16",
      address: "Toshkent, Shota Rustaveli ko‘chasi, 63",
      workingHours: "08:00-22:00"
    },
    {
      id: 26,
      name: "Sim Sim",
      category: "Kafe / Restoran",
      instagram: "@simsimrestaurantuz",
      telegram: "@SimSimUz_Bot",
      phone: "+998 71 253 54 34",
      address: "Toshkent, Muqimiy ko‘chasi, 4",
      workingHours: "09:00-00:00"
    },
    {
      id: 27,
      name: "Kanishka",
      category: "Kiyim / Aksessuar",
      instagram: "@kanishka_dsgn",
      telegram: "@kanishka_dsgn",
      phone: "+998 71 252 57 77",
      address: "Toshkent, Afrosiyob ko‘chasi, 39",
      workingHours: "10:00-19:00"
    },
    {
      id: 28,
      name: "Bloom Beauty Shop",
      category: "Kosmetika",
      instagram: "@bloombeauty",
      telegram: "@bloombeautyuz",
      phone: "+998 99 610 77 88",
      address: "Toshkent, O‘zbekiston ovozi ko‘chasi, 21",
      workingHours: "10:00-22:00"
    },
    {
      id: 29,
      name: "Registan Restaurant",
      category: "Restoran",
      instagram: "@registan",
      telegram: "@Registan_Menu",
      phone: "+998 97 773 54 40",
      address: "Toshkent, Muqimiy ko‘chasi, 96G",
      workingHours: "11:00-23:00"
    },
    {
      id: 30,
      name: "Platforma",
      category: "Kafe",
      instagram: "@platformauz",
      telegram: "@platformauz",
      phone: "+998 93 501 56 30",
      address: "Toshkent, Chust ko‘chasi, 1",
      workingHours: "08:00-22:00"
    },
    {
      id: 31,
      name: "FreshCa.fe",
      category: "Kafe",
      instagram: "@freshca",
      telegram: "@freshCauz",
      phone: "+998 95 146 00 05",
      address: "Toshkent, Shastri ko‘chasi, 15",
      workingHours: "08:00-23:00"
    },
    {
      id: 32,
      name: "Moka’s",
      category: "Kafe",
      instagram: "@cafe_mokas",
      telegram: "@cafe_mokas",
      phone: "+998 33 999 99 39",
      address: "Toshkent, Amir Temur shoh ko‘chasi, 43",
      workingHours: "08:00-23:00"
    },
    {
      id: 33,
      name: "Cherry-shop",
      category: "Ayollar kiyimi",
      instagram: "@cherryshop",
      telegram: "@cherryshop",
      phone: "+998 90 999 77 44",
      address: "Toshkent, Matbuotchilar ko‘chasi, 9",
      workingHours: "Aniq ko‘rsatilmagan"
    },
    {
      id: 34,
      name: "IZI Cafe",
      category: "Kafe",
      instagram: "@izi",
      telegram: "@izicafe",
      phone: "+998 99 901 13 31",
      address: "Toshkent, Afrosiyob ko‘chasi, 15/1",
      workingHours: "11:00-23:00"
    },
    {
      id: 35,
      name: "Happy Time Cafe",
      category: "Kafe",
      instagram: "@happytime",
      telegram: "@HappyTimeCafeUz",
      phone: "+998 98 361 88 88",
      address: "Toshkent, Said Barak ko‘chasi, 34A",
      workingHours: "09:00-23:00"
    },
    {
      id: 36,
      name: "Taverna",
      category: "Restoran",
      instagram: "@taverna",
      telegram: "@taverna_uz",
      phone: "+998 90 359 03 03",
      address: "Toshkent, 9 May ko‘chasi, 4A",
      workingHours: "10:00-23:00"
    },
    {
      id: 37,
      name: "Cake Bake",
      category: "Qandolat",
      instagram: "@cakebake_by_multimafe",
      telegram: "@cakebake_by_mm",
      phone: "+998 71 202 77 11",
      address: "Toshkent, Beruniy ko‘chasi, 85",
      workingHours: "08:00-22:00"
    },
    {
      id: 38,
      name: "Urban Food",
      category: "Kafe",
      instagram: "@urbanfooduz",
      telegram: "@urbanfooduz",
      phone: "+998 95 146 90 10",
      address: "Toshkent, Shahrisabz ko‘chasi, 23",
      workingHours: "10:00-23:00"
    },
    {
      id: 39,
      name: "Latte Fresh & Tasty",
      category: "Qahvaxona / Pizzeria",
      instagram: "@latte",
      telegram: "@Latteuz",
      phone: "+998 71 221 73 00",
      address: "Toshkent, Moyqo‘rg‘on ko‘chasi, 48",
      workingHours: "08:00-23:00"
    },
    {
      id: 40,
      name: "Bibigon",
      category: "Kafe / Qandolat",
      instagram: "@bibigoncafe",
      telegram: "@Bibigoncafe_bot",
      phone: "+998 98 300 73 00",
      address: "Toshkent, Akademik G‘ulomov ko‘chasi, 38",
      workingHours: "09:00-23:00"
    },
    {
      id: 41,
      name: "Sherbet",
      category: "Restoran",
      instagram: "@sherbet_uz",
      telegram: "@sherbetrestoran_uz",
      phone: "+998 90 995 50 55",
      address: "Toshkent, Shota Rustaveli ko‘chasi, 32A",
      workingHours: "10:00-00:00"
    },
    {
      id: 42,
      name: "Zee Box Healthy Food & Bakery",
      category: "Sog‘lom ovqat / Nonvoyxona",
      instagram: "@zee_box_cafe",
      telegram: "@zee_box",
      phone: "+998 71 231 12 31",
      address: "Toshkent, Xurshid ko‘chasi, 58",
      workingHours: "08:00-20:00"
    },
    {
      id: 43,
      name: "Vienna Bakery",
      category: "Nonvoyxona",
      instagram: "@viennabakeryuz",
      telegram: "@viennabakery",
      phone: "+998 71 232 03 01",
      address: "Toshkent, Shastri ko‘chasi, 27",
      workingHours: "08:00-22:00"
    },
    {
      id: 44,
      name: "Aksu",
      category: "Kafe / Restoran",
      instagram: "@aksu",
      telegram: "@Aksuuzbot",
      phone: "+998 71 273 33 22",
      address: "Toshkent, Muqimiy ko‘chasi, 178",
      workingHours: "11:00-23:00"
    },
    {
      id: 45,
      name: "Cake Lab",
      category: "Qandolat / Qahvaxona",
      instagram: "@cakelaboratory",
      telegram: "@Cakelabbot",
      phone: "+998 71 233 40 36",
      address: "Toshkent, Shastri ko‘chasi, 15",
      workingHours: "08:00-21:00"
    },
    {
      id: 46,
      name: "Makro",
      category: "Supermarket",
      instagram: "@makro_supermarket",
      telegram: "@makrosupermarket",
      phone: "+998 71 205 12 05",
      address: "Toshkent, Temur Malik ko‘chasi, 2",
      workingHours: "08:00-00:00"
    },
    {
      id: 47,
      name: "Erkatoy Center",
      category: "O‘yinchoqlar",
      instagram: "@erkatoycenter",
      telegram: "@erkatoycenter",
      phone: "+998 71 205 00 65",
      address: "Toshkent, Nukus ko‘chasi, 81A",
      workingHours: "10:00-22:00"
    },
    {
      id: 48,
      name: "Li-Ning",
      category: "Sport kiyimlari",
      instagram: "@lining",
      telegram: "@lining_official_uz",
      phone: "+998 95 198 79 97",
      address: "Toshkent, Bobur ko‘chasi, 6",
      workingHours: "10:00-19:30"
    },
    {
      id: 49,
      name: "NCS",
      category: "Kiyim / Savdo",
      instagram: "@ncsuzbekistan",
      telegram: "@ncsuzb",
      phone: "+998 97 739 08 55",
      address: "Toshkent, Qoratash ko‘chasi, 5A, 3-qavat",
      workingHours: "Aniq ko‘rsatilmagan"
    },
    {
      id: 50,
      name: "Max Way",
      category: "Fast food",
      instagram: "@max_way",
      telegram: "@MAXWAY_uz",
      phone: "+998 71 200 54 00",
      address: "Toshkent, Buyuk Ipak Yo‘li ko‘chasi, 4",
      workingHours: "08:00-05:00"
    }
  ];

export default brands;
