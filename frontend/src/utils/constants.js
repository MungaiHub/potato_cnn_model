export const STATS = {
  farmersServed: "130,000+",
  accuracy: "95%+",
  diseases: 7,
};

export const DISEASES = [
  {
    key: "brown_rot",
    name: "Brown Rot",
    category: "Tuber",
    symptoms:
      "Brown discoloration in vascular ring of tubers, wilting and yellowing of foliage.",
    commonChemicals: ["Copper-based bactericides (preventive)", "Certified clean seed"],
    type: "tuber",
  },
  {
    key: "soft_rot",
    name: "Soft Rot",
    category: "Tuber",
    symptoms: "Soft, watery decay of tubers with foul smell, especially in storage.",
    commonChemicals: ["Improve storage conditions", "Ventilation"],
    type: "tuber",
  },
  {
    key: "healthy_tuber",
    name: "Healthy Tuber",
    category: "Tuber",
    symptoms: "Firm, clean tubers with no discoloration or soft spots.",
    commonChemicals: ["No treatment needed"],
    type: "tuber",
  },
  {
    key: "late_blight",
    name: "Late Blight",
    category: "Leaf",
    symptoms:
      "Water-soaked lesions on leaves that turn brown with white fluffy growth under humid conditions.",
    commonChemicals: ["Ridomil Gold MZ", "Acrobat MZ", "Dithane M-45"],
    type: "leaf",
  },
  {
    key: "early_blight",
    name: "Early Blight",
    category: "Leaf",
    symptoms:
      "Brown lesions with concentric rings, usually starting on older leaves.",
    commonChemicals: ["Mancozeb", "Dithane M-45", "Copper oxychloride"],
    type: "leaf",
  },
  {
    key: "bacterial_wilt",
    name: "Bacterial Wilt",
    category: "Leaf",
    symptoms:
      "Sudden wilting of plants, brown discoloration of stems, milky ooze from cut stems.",
    commonChemicals: ["No chemical cure - prevention only"],
    type: "leaf",
  },
  {
    key: "healthy_leaf",
    name: "Healthy Leaf",
    category: "Leaf",
    symptoms: "Uniform green leaves with no lesions, spots, or yellowing.",
    commonChemicals: ["No treatment needed"],
    type: "leaf",
  },
];

