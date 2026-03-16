import type { Severity } from "./Severity";
import type { Products } from "../../products/types/Products";

export interface Recommendation {
    id: number;
    condition: string;
    severity: Severity;
    treatment: string;
    products: Products[];
    precautions: string;
    createdAt: string;
}