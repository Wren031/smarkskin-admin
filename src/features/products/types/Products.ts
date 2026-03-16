import type { ProductStatus } from "./ProductStatus";

export interface Products {
    id: number;
    product_name: string;
    brand: string;
    price: number;
    image_url: string;
    description: string;
    status: ProductStatus;
}
    