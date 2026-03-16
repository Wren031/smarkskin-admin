import type { Products } from "../types/Products";
import cat from "../../../assets/images/cat.jpg";
import cleanser from "../../../assets/images/cleanser.avif";
export const products: Products[] = [
    {
        id: 1,
        product_name: "Hydrating Facial Cleanser",
        brand: "SkinGlow",
        price: 19.99,
        image_url: cat,
        description: "A gentle cleanser that hydrates and refreshes your skin.",
        status: "Available",
    },
    {
        id: 2,
        product_name: "Vitamin C Serum",
        brand: "RadianceBoost",
        price: 29.99,
        image_url: cleanser,
        description: "Brighten your complexion with our potent Vitamin C serum.",
        status: "Out of Stock",
    }

]