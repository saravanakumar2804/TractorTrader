export const TRACTOR_CATEGORIES = [
  { value: "compact", label: "Compact" },
  { value: "utility", label: "Utility" },
  { value: "row-crop", label: "Row Crop" },
  { value: "4wd-track", label: "4WD/Track" },
  { value: "specialty", label: "Specialty" },
  { value: "attachments", label: "Attachments" },
];

export const TRACTOR_BRANDS = [
  { value: "john-deere", label: "John Deere" },
  { value: "massey-ferguson", label: "Massey Ferguson" },
  { value: "new-holland", label: "New Holland" },
  { value: "case-ih", label: "Case IH" },
  { value: "kubota", label: "Kubota" },
  { value: "mahindra", label: "Mahindra" },
  { value: "kioti", label: "Kioti" },
  { value: "claas", label: "CLAAS" },
  { value: "fendt", label: "Fendt" },
  { value: "other", label: "Other" },
];

export const HORSEPOWER_RANGES = [
  { value: "under-50", label: "Under 50 HP" },
  { value: "50-99", label: "50-99 HP" },
  { value: "100-174", label: "100-174 HP" },
  { value: "175-299", label: "175-299 HP" },
  { value: "300-plus", label: "300+ HP" },
];

export const YEARS = Array.from({ length: 50 }, (_, i) => {
  const year = new Date().getFullYear() - i;
  return { value: year.toString(), label: year.toString() };
});

export const PRICE_RANGES = [
  { value: "under-10000", label: "Under ₹10,000" },
  { value: "10000-25000", label: "₹10,000 - ₹25,000" },
  { value: "25000-50000", label: "₹25,000 - ₹50,000" },
  { value: "50000-100000", label: "₹50,000 - ₹1,00,000" },
  { value: "100000-500000", label: "₹1,00,000 - ₹5,00,000" },
  { value: "500000-plus", label: "₹5,00,000+" },
];

export const HOURS_RANGES = [
  { value: "under-100", label: "Under 100" },
  { value: "100-500", label: "100-500" },
  { value: "500-1000", label: "500-1,000" },
  { value: "1000-2000", label: "1,000-2,000" },
  { value: "2000-plus", label: "2,000+" },
];

export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_key";
