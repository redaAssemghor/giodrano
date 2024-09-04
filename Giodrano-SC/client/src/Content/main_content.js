import m_img_1 from "../images/images/m-polo.jpg";
import m_img_2 from "../images/images/m-tees.jpg";
import m_img_3 from "../images/images/m-sandh.jpg";
import m_img_4 from "../images/images/m-sandc.jpg";
import m_img_5 from "../images/images/m-outer.jpg";
import m_img_6 from "../images/images/m-shirt.jpg";
import m_img_7 from "../images/images/m-pants.jpg";
import m_img_8 from "../images/images/m-essentials.jpg";
import m_img_9 from "../images/images/m-shorts.jpg";
import ju_img_1 from "../images/images/ju-polo.jpg";
import ju_img_2 from "../images/images/ju-tees.jpg";
import ju_img_3 from "../images/images/ju-sandh.jpg";
import ju_img_4 from "../images/images/ju-sandc.jpg";
import ju_img_5 from "../images/images/ju-outer.jpg";
import ju_img_6 from "../images/images/ju-shirt.jpg";
import ju_img_7 from "../images/images/ju-pants.jpg";
// import ju_img_8 from "../images/images/ju-essentials.jpg";
import wo_img_1 from "../images/images/wo-jacket.jpg";
import wo_img_2 from "../images/images/wo-polo.jpg";
import wo_img_3 from "../images/images/wo-sandc.jpg";
import wo_img_4 from "../images/images/wo-sandh.jpg";
import wo_img_5 from "../images/images/wo-shirt.jpg";
import wo_img_6 from "../images/images/wo-pants.jpg";
import wo_img_7 from "../images/images/wo-skirts.jpg";
import wo_img_8 from "../images/images/wo-tees.jpg";
import wo_img_9 from "../images/images/wo-essentials.jpg";

const categories = {
  fr: [
    {
      code: "men",
      title: "Homme",
      superset: [
        {
          id: "3595582986",
          entitle: "Polo",
          slug: "polo",
          cover: m_img_1,
          subset: [],
        },
        {
          id: "3112124140",
          entitle: "Tee-Shirts",
          slug: "tee-shirts",
          cover: m_img_2,
          subset: [
            {
              id: "2548008694",
              entitle: "Simples",
              slug: "simples",
            },
            {
              id: "2337864905",
              entitle: "Imprimés",
              slug: "imprimes",
            },
          ],
        },
        {
          id: "4275451407",
          entitle: "Chemises",
          slug: "chemises",
          cover: m_img_6,
          subset: [],
        },
        {
          id: "4518299115",
          entitle: "Sweats et Hoodies",
          slug: "sweats-et-hoodies",
          cover: m_img_3,
          subset: [],
        },
        {
          id: "1582022493",
          entitle: "Pulls et Gilets",
          slug: "pulls-et-gilets",
          cover: m_img_4,
          subset: [],
        },
        {
          id: "0620312866",
          entitle: "Vestes et Menteaux",
          slug: "vestes-et-Menteaux",
          cover: m_img_5,
          subset: [],
        },
        {
          id: "1610142722",
          entitle: "Pantalons",
          slug: "pantalons",
          cover: m_img_7,
          subset: [
            {
              id: "5130819380",
              entitle: "Joggers",
              slug: "joggers",
            },
            {
              id: "6252776852",
              entitle: "Jeans",
              slug: "jeans",
            },
            {
              id: "0428809540",
              entitle: "Chinos",
              slug: "chinos",
            },
          ],
        },
        {
          id: "3063883579",
          entitle: "Shorts et Bermudas",
          slug: "shorts-et-bermudas",
          cover: m_img_9,
          subset: [],
        },
        {
          id: "3063883578",
          entitle: "Essentials",
          slug: "essentials",
          cover: m_img_8,
          subset: [
            {
              id: "5384584407",
              entitle: "Ceintures",
              slug: "ceintures",
            },
            {
              id: "9844302775",
              entitle: "Chaussettes",
              slug: "chaussettes",
            },
            {
              id: "5553037630",
              entitle: "Boxers",
              slug: "boxers",
            },
            {
              id: "5204826737",
              entitle: "Casquettes",
              slug: "casquettes",
            },
            {
              id: "5204826738",
              entitle: "Innerwear",
              slug: "innerwear",
            },
            {
              id: "5204026738",
              entitle: "Sacoches et Sac à dos ",
              slug: "sacoches-et-sac-à-dos ",
            },
          ],
        },
      ],
    },
    {
      code: "women",
      title: "Femme",
      superset: [
        {
          id: "8817268702",
          entitle: "Vestes",
          slug: "vestes",
          cover: wo_img_1,
          subset: [],
        },
        {
          id: "4871551389",
          entitle: "Polo",
          slug: "polo",
          cover: wo_img_2,
          subset: [],
        },
        {
          id: "2074244987",
          entitle: "Pulls Et Gilets",
          slug: "pulls-et-gilets",
          cover: wo_img_3,
          subset: [],
        },
        {
          id: "1619075330",
          entitle: "Sweats et Hoodies",
          slug: "sweats-et-hoodies",
          cover: wo_img_4,
          subset: [],
        },
        {
          id: "7903250743",
          entitle: "Chemises",
          slug: "chemises",
          cover: wo_img_5,
          subset: [],
        },
        {
          id: "0812859941",
          entitle: "Pantalons",
          slug: "pantalons",
          cover: wo_img_6,
          subset: [
            {
              id: "2720828810",
              entitle: "Joggers",
              slug: "joggers",
            },
            {
              id: "0659121493",
              entitle: "Jeans",
              slug: "jeans",
            },
            {
              id: "0650121493",
              entitle: "Chinos",
              slug: "chinos",
            },
            {
              id: "1630121493",
              entitle: "Shorts",
              slug: "shorts",
            },
          ],
        },
        {
          id: "6096357674",
          entitle: "Jupes et Robes",
          slug: "jupes-et-robes",
          cover: wo_img_7,
          subset: [],
        },
        {
          id: "6767175716",
          entitle: "Tee-Shirts",
          slug: "tee-shirts",
          cover: wo_img_8,
          subset: [
            {
              id: "5131699412",
              entitle: "Imprimés",
              slug: "imprimes",
            },
            {
              id: "0617811377",
              entitle: "Simples",
              slug: "simples",
            },
          ],
        },
        {
          id: "6767175717",
          entitle: "Essentials",
          slug: "essentials",
          cover: wo_img_9,
          subset: [
            {
              id: "5131699413",
              entitle: "Chaussettes",
              slug: "chaussettes",
            },
            {
              id: "0617811378",
              entitle: "Innerwear",
              slug: "innerwear",
            },
            {
              id: "5204026732",
              entitle: "Sacoches et Sac à dos ",
              slug: "sacoches-et-sac-à-dos ",
            },
          ],
          
        },
      ],
    },
    {
      code: "junior",
      title: "Junior",
      superset: [
        {
          id: "3595582986",
          entitle: "Polo",
          slug: "polo",
          cover: ju_img_1,
          subset: [],
        },
        {
          id: "3112124140",
          entitle: "Tee-Shirts",
          slug: "tee-shirts",
          cover: ju_img_2,
          subset: [
            {
              id: "2548008694",
              entitle: "Simples",
              slug: "simples",
            },
            {
              id: "2337864905",
              entitle: "Imprimés",
              slug: "imprimes",
            },
          ],
        },
        {
          id: "4518299115",
          entitle: "Sweats et Hoodies",
          slug: "sweats-et-hoodies",
          cover: ju_img_3,
          subset: [],
        },
        {
          id: "1582022493",
          entitle: "Pulls et Gilets",
          slug: "pulls-et-gilets",
          cover: ju_img_4,
          subset: [],
        },
        {
          id: "0620312866",
          entitle: "Vestes et Menteaux",
          slug: "vestes-et-Menteaux",
          cover: ju_img_5,
          subset: [],
        },
        {
          id: "4275451407",
          entitle: "Chemises",
          slug: "chemises",
          cover: ju_img_6,
          subset: [],
        },
        {
          id: "1610142722",
          entitle: "Pantalons",
          slug: "pantalons",
          cover: ju_img_7,
          subset: [
            {
              id: "5130819380",
              entitle: "Joggers",
              slug: "joggers",
            },
            {
              id: "6252776852",
              entitle: "Jeans",
              slug: "jeans",
            },
            {
              id: "0428809540",
              entitle: "Chinos",
              slug: "chinos",
            },
            {
              id: "0420819540",
              entitle: "Shorts",
              slug: "shorts",
            },
          ],
        },
        // {
        //   id: "3063883578",
        //   entitle: "Essentials",
        //   slug: "essentials",
        //   cover: ju_img_8,
        //   subset: [
        //     {
        //       id: "5384584407",
        //       entitle: "Ceintures",
        //       slug: "ceintures",
        //     },
        //     {
        //       id: "9844302775",
        //       entitle: "Chaussettes",
        //       slug: "chaussettes",
        //     },
        //     {
        //       id: "5553037630",
        //       entitle: "Boxers",
        //       slug: "boxers",
        //     },
        //     {
        //       id: "5204826737",
        //       entitle: "Casquettes",
        //       slug: "casquettes",
        //     },
        //   ],
        // },
      ],
    },
  ],
};

const navbar = {
  fr: [
    {
      entitle: "Accueil",
      url: "/",
    },
    {
      entitle: "Shop",
      url: "/shop",
    },
    {
      entitle: "Homme",
      url: "/categories/homme",
    },
    {
      entitle: "Femme",
      url: "/categories/femme",
    },
    {
      entitle: "Junior",
      url: "/categories/junior",
    },
    {
      entitle: "Suivre votre colis",
      url: "/suivre-colis",
    },
    {
      entitle: "Contact",
      url: "/contact",
    },
  ],
};

const wilayas = {
  fr: [
    {
      prov: "Alger",
      time: 1,
      del_1: 500,
      del_2: 400,
      return: 350,
    },
    {
      prov: "Blida",
      time: 1,
      del_1: 600,
      del_2: 550,
      return: 350,
    },
    {
      prov: "Boumerdès",
      time: 1,
      del_1: 600,
      del_2: 550,
      return: 350,
    },
    {
      prov: "Tipaza",
      time: 1,
      del_1: 600,
      del_2: 550,
      return: 350,
    },
    {
      prov: "Aïn Defla",
      time: 1,
      del_1: 800,
      del_2: 650,
      return: 350,
    },
    {
      prov: "Aïn Témouchent",
      time: 1,
      del_1: 800,
      del_2: 650,
      return: 350,
    },
    {
      prov: "Annaba",
      time: 1,
      del_1: 800,
      del_2: 650,
      return: 350,
    },
    {
      prov: "Batna",
      time: 1,
      del_1: 800,
      del_2: 650,
      return: 350,
    },
    {
      prov: "Bejaïa",
      time: 1,
      del_1: 800,
      del_2: 650,
      return: 350,
    },
    {
      prov: "Bordj Bou Arreridj",
      time: 1,
      del_1: 800,
      del_2: 650,
      return: 350,
    },
    {
      prov: "Bouira",
      time: 1,
      del_1: 800,
      del_2: 650,
      return: 350,
    },
    {
      prov: "Chlef",
      time: 1,
      del_1: 800,
      del_2: 650,
      return: 350,
    },
    {
      prov: "Constantine",
      time: 1,
      del_1: 800,
      del_2: 650,
      return: 350,
    },
    {
      prov: "ElTarf",
      time: 1,
      del_1: 800,
      del_2: 650,
      return: 350,
    },
    {
      prov: "Guelma",
      time: 1,
      del_1: 800,
      del_2: 650,
      return: 350,
    },
    {
      prov: "Jijel",
      time: 1,
      del_1: 800,
      del_2: 650,
      return: 350,
    },
    {
      prov: "Khenchela",
      time: 1,
      del_1: 800,
      del_2: 650,
      return: 350,
    },
    {
      prov: "Mascara",
      time: 1,
      del_1: 800,
      del_2: 650,
      return: 350,
    },
    {
      prov: "Médéa",
      time: 1,
      del_1: 800,
      del_2: 650,
      return: 350,
    },
    {
      prov: "Mila",
      time: 1,
      del_1: 800,
      del_2: 650,
      return: 350,
    },
    {
      prov: "Mostaganem",
      time: 1,
      del_1: 800,
      del_2: 650,
      return: 350,
    },
    {
      prov: "M'Sila",
      time: 1,
      del_1: 800,
      del_2: 650,
      return: 350,
    },
    {
      prov: "Oran",
      time: 1,
      del_1: 800,
      del_2: 650,
      return: 350,
    },
    {
      prov: "Oum El Bouaghi",
      time: 1,
      del_1: 800,
      del_2: 650,
      return: 350,
    },
    {
      prov: "Relizane",
      time: 1,
      del_1: 800,
      del_2: 650,
      return: 350,
    },
    {
      prov: "Saïda",
      time: 1,
      del_1: 800,
      del_2: 650,
      return: 350,
    },
    {
      prov: "Sétif",
      time: 1,
      del_1: 800,
      del_2: 650,
      return: 350,
    },
    {
      prov: "Sidi Bel Abbès",
      time: 1,
      del_1: 800,
      del_2: 650,
      return: 350,
    },
    {
      prov: "Skikda",
      time: 1,
      del_1: 800,
      del_2: 650,
      return: 350,
    },
    {
      prov: "Souk Ahras",
      time: 1,
      del_1: 800,
      del_2: 650,
      return: 350,
    },
    {
      prov: "Tiaret",
      time: 1,
      del_1: 800,
      del_2: 650,
      return: 350,
    },
    {
      prov: "Tissemsilt",
      time: 1,
      del_1: 800,
      del_2: 650,
      return: 350,
    },
    {
      prov: "Tizi Ouzou",
      time: 1,
      del_1: 800,
      del_2: 650,
      return: 350,
    },
    {
      prov: "Tlemcen",
      time: 1,
      del_1: 800,
      del_2: 650,
      return: 350,
    },
    {
      prov: "Biskra",
      time: 1,
      del_1: 950,
      del_2: 800,
      return: 350,
    },
    {
      prov: "Djelfa",
      time: 1,
      del_1: 950,
      del_2: 800,
      return: 350,
    },

    {
      prov: "El Oued",
      time: 1,
      del_1: 950,
      del_2: 800,
      return: 350,
    },
    {
      prov: "Ghardaïa",
      time: 2,
      del_1: 950,
      del_2: 800,
      return: 350,
    },
    {
      prov: "Laghouat",
      time: 1,
      del_1: 950,
      del_2: 800,
      return: 350,
    },
    {
      prov: "Ouargla",
      time: 2,
      del_1: 950,
      del_2: 800,
      return: 350,
    },
    {
      prov: "Tébessa",
      time: 1,
      del_1: 950,
      del_2: 800,
      return: 350,
    },
    {
      prov: "El Bayadh",
      time: 2,
      del_1: 1400,
      del_2: 1100,
      return: 350,
    },
    {
      prov: "Naâma",
      time: 3,
      del_1: 1400,
      del_2: 1100,
      return: 350,
    },
    {
      prov: "Bechar",
      time: 3,
      del_1: 1400,
      del_2: 1100,
      return: 350,
    },
    {
      prov: "Adrar",
      time: 3,
      del_1: 1400,
      del_2: 1100,
      return: 350,
    },
    {
      prov: "Tindouf",
      time: 5,
      del_1: 1600,
      del_2: 1500,
      return: 350,
    },
    {
      prov: "Illizi",
      time: 6,
      del_1: 1600,
      del_2: 1500,
      return: 350,
    },
    {
      prov: "Tamanrasset",
      time: 5,
      del_1: 1600,
      del_2: 1500,
      return: 350,
    },
  ],
};

const colors = {
  fr: [
    {
      entitle: "Blanc",
      code: "FFFFFF",
    },
    {
      entitle: "Noir",
      code: "000000",
    },
    {
      entitle: "Gris",
      code: "C0C0C0",
    },
    {
      entitle: "Kaki",
      code: "BDB96C",
    },
    {
      entitle: "Marron",
      code: "7F272A",
    },
    {
      entitle: "Beige",
      code: "FFF2CB",
    },
    {
      entitle: "Jaune",
      code: "FFFF0B",
    },
    {
      entitle: "Orange",
      code: "FF8139",
    },
    {
      entitle: "Vert",
      code: "118302",
    },
    {
      entitle: "Rose",
      code: "FEBECB",
    },
    {
      entitle: "Rouge",
      code: "FF0034",
    },
    {
      entitle: "Violet",
      code: "7F0080",
    },
    {
      entitle: "Bleu",
      code: "0000FF",
    },
    {
      entitle: "Bleu Ciel",
      code: "77B5FE",
    },
    {
      entitle: "Gris foncé",
      code: "808B87",
    },
  ],
};

export { categories, navbar, colors, wilayas };
