import type { Severity } from "./Severity";
import type { Products } from "../../products/types/Products";
import type { SkinCondition } from "../../condition/type/SkinCondition";
export interface Recommendation {
    id: number;
    condition: SkinCondition;
    severity: Severity;
    treatment: string;
    products: Products[];
    precautions: string;
    createdAt: string;
}