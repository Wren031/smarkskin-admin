import type { Recommendation } from "../types/Recommendation";
import { SEVERITY } from "../types/Severity";
import { products } from "../../products/data/products";
import { conditions } from "../../condition/data/conditions";

export const recommendation: Recommendation[] = [
    {
        id: 1,
        condition: conditions[2],
        severity: SEVERITY.MODERATE,
        treatment: "Use a gentle cleanser and acne treatment serum.",
        products: [products[0], products[2]],
        precautions: "Avoid oily skincare products.",
        createdAt: "2026-03-16"
    }
    
];