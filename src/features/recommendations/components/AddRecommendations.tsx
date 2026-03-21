// import { useEffect, useState, type CSSProperties } from "react";
// import type { Recommendation } from "../types/Recommendation";
// import { SEVERITY } from "../types/Severity";

// import type { SkinCondition } from "../../condition/type/SkinCondition";
// import type { Products } from "../../products/types/Products";
// import { supabase } from "../../../lib/supabase";

// interface Props {
//   onAdd: (rec: Recommendation) => void;
//   onCancel?: () => void;
// }

// export default function AddRecommendations({ onAdd, onCancel }: Props) {
//   const [products, setProducts] = useState<Products[]>([]);
//   const [conditions, setCondition] = useState<SkinCondition[]>([]);

//   const [form, setForm] = useState({
//     condition: null as SkinCondition | null,
//     severity: SEVERITY.MILD,
//     treatment: "",
//     precautions: "",
//     products: [] as Products[],
//   });

//   // Fetch conditions
//   useEffect(() => {
//     const fetchCondition = async () => {
//       const { data, error } = await supabase
//         .from("tbl_condition")
//         .select("*");

//       if (error) console.error(error);
//       if (data) setCondition(data);
//     };

//     fetchCondition();
//   }, []);

//   // Fetch products
//   useEffect(() => {
//     const fetchProducts = async () => {
//       const { data, error } = await supabase
//         .from("tbl_products")
//         .select("*");

//       if (error) console.error(error);
//       if (data) setProducts(data);
//     };

//     fetchProducts();
//   }, []);

//   // Set default condition after fetch
//   useEffect(() => {
//     if (conditions.length > 0) {
//       setForm((prev) => ({
//         ...prev,
//         condition: conditions[0],
//       }));
//     }
//   }, [conditions]);

//   const isValid =
//     form.condition !== null &&
//     form.treatment.trim() !== "" &&
//     form.precautions.trim() !== "" &&
//     form.products.length > 0;

//   const handleChange = (field: keyof typeof form, value: any) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!isValid || !form.condition) return;

//     const newRecommendation: Recommendation = {
//       id: Date.now(),
//       condition: form.condition,
//       severity: form.severity,
//       treatment: form.treatment,
//       precautions: form.precautions,
//       products: form.products,
//       createdAt: new Date().toISOString(),
//     };

//     onAdd(newRecommendation);

//     setForm({
//       condition: conditions[0] || null,
//       severity: SEVERITY.MILD,
//       treatment: "",
//       precautions: "",
//       products: [],
//     });
//   };

//   return (
//     <div style={styles.overlay}>
//       <form onSubmit={handleSubmit} style={styles.card}>
//         <div style={styles.header}>
//           <h2 style={styles.title}>Add Recommendation</h2>
//           <p style={styles.subtitle}>
//             Create a treatment plan for a specific condition
//           </p>
//         </div>

//         <div style={styles.row}>
//           <div style={styles.formGroup}>
//             <label style={styles.label}>Condition</label>
//             <select
//               value={form.condition?.id || ""}
//               disabled={!conditions.length}
//               onChange={(e) => {
//                 const selected = conditions.find(
//                   (c) => c.id === Number(e.target.value)
//                 );
//                 if (selected) handleChange("condition", selected);
//               }}
//               style={styles.input}
//             >
//               <option value="">Select condition</option>
//               {conditions.map((cond) => (
//                 <option key={cond.id} value={cond.id}>
//                   {cond.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div style={styles.formGroup}>
//             <label style={styles.label}>Severity</label>
//             <select
//               value={form.severity}
//               onChange={(e) => handleChange("severity", e.target.value)}
//               style={styles.input}
//             >
//               {Object.values(SEVERITY).map((sev) => (
//                 <option key={sev} value={sev}>
//                   {sev}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div style={styles.formGroup}>
//           <label style={styles.label}>Treatment Plan</label>
//           <textarea
//             placeholder="Describe the treatment..."
//             value={form.treatment}
//             onChange={(e) => handleChange("treatment", e.target.value)}
//             style={styles.textarea}
//           />
//         </div>

//         <div style={styles.formGroup}>
//           <label style={styles.label}>Precautions</label>
//           <textarea
//             placeholder="Any precautions..."
//             value={form.precautions}
//             onChange={(e) => handleChange("precautions", e.target.value)}
//             style={styles.textarea}
//           />
//         </div>

//         <div style={styles.formGroup}>
//           <label style={styles.label}>Products</label>

//           <select
//             onChange={(e) => {
//               const selected = products.find(
//                 (p) => p.id === Number(e.target.value)
//               );

//               if (
//                 selected &&
//                 !form.products.some((p) => p.id === selected.id)
//               ) {
//                 handleChange("products", [...form.products, selected]);
//               }
//             }}
//           >
//             <option value="">Select product</option>
//             {products.map((p) => (
//               <option key={p.id} value={p.id}>
//                 {p.product_name}
//               </option>
//             ))}
//           </select>

//           <div style={styles.productList}>
//             {form.products.map((product) => (
//               <div key={product.id} style={styles.productCard}>
//                 <img
//                   src={product.image_url}
//                   alt={product.product_name}
//                   style={styles.productImage}
//                 />

//                 <div style={styles.productInfo}>
//                   <span style={styles.productName}>
//                     {product.product_name}
//                   </span>
//                   <span style={styles.productBrand}>
//                     {product.brand}
//                   </span>
//                 </div>

//                 <button
//                   type="button"
//                   style={styles.removeButton}
//                   onClick={() =>
//                     handleChange(
//                       "products",
//                       form.products.filter((p) => p.id !== product.id)
//                     )
//                   }
//                 >
//                   ✕
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div style={styles.actions}>
//           <button
//             type="button"
//             style={styles.secondaryButton}
//             onClick={() => onCancel && onCancel()}
//           >
//             Cancel
//           </button>

//           <button
//             type="submit"
//             disabled={!isValid}
//             style={{
//               ...styles.primaryButton,
//               opacity: isValid ? 1 : 0.5,
//               cursor: isValid ? "pointer" : "not-allowed",
//             }}
//           >
//             Save Recommendation
//           </button>
//         </div>

//         {!form.treatment && (
//           <span style={{ color: "red", fontSize: 12 }}>
//             Treatment is required
//           </span>
//         )}
//       </form>
//     </div>
//   );
// }

// const styles: Record<string, CSSProperties> = {
//   overlay: {
//     position: "fixed",
//     inset: 0,
//     background: "rgba(0,0,0,0.45)",
//     backdropFilter: "blur(6px)",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     zIndex: 1000,
//   },

//   card: {
//     width: 460,
//     background: "#ffffff",
//     borderRadius: 18,
//     padding: 28,
//     boxShadow: "0 20px 50px rgba(0,0,0,0.2)",
//     display: "flex",
//     flexDirection: "column",
//     gap: 18,
//   },

//   header: {
//     marginBottom: 6,
//   },

//   title: {
//     margin: 0,
//     fontSize: 22,
//     fontWeight: 600,
//     color: "#111",
//   },

//   subtitle: {
//     marginTop: 4,
//     fontSize: 13,
//     color: "#666",
//   },

//   row: {
//     display: "flex",
//     gap: 12,
//   },

//   formGroup: {
//     flex: 1,
//     display: "flex",
//     flexDirection: "column",
//     gap: 6,
//   },

//   label: {
//     fontSize: 13,
//     fontWeight: 500,
//     color: "#333",
//   },

//   input: {
//     padding: "10px 12px",
//     borderRadius: 10,
//     border: "1px solid #ddd",
//     fontSize: 14,
//   },

//   textarea: {
//     padding: "10px 12px",
//     borderRadius: 10,
//     border: "1px solid #ddd",
//     fontSize: 14,
//     minHeight: 90,
//     resize: "vertical",
//   },

//   productList: {
//     marginTop: 10,
//     display: "flex",
//     flexDirection: "column",
//     gap: 10,
//   },

//   productCard: {
//     display: "flex",
//     alignItems: "center",
//     gap: 12,
//     padding: 10,
//     borderRadius: 10,
//     border: "1px solid #eee",
//     background: "#fafafa",
//   },

//   productImage: {
//     width: 48,
//     height: 48,
//     borderRadius: 8,
//     objectFit: "cover",
//   },

//   productInfo: {
//     flex: 1,
//     display: "flex",
//     flexDirection: "column",
//   },

//   productName: {
//     fontSize: 14,
//     fontWeight: 500,
//     color: "#222",
//   },

//   productBrand: {
//     fontSize: 12,
//     color: "#777",
//   },

//   removeButton: {
//     border: "none",
//     background: "#ffe5e5",
//     color: "#d11",
//     borderRadius: 6,
//     width: 28,
//     height: 28,
//     cursor: "pointer",
//   },

//   actions: {
//     display: "flex",
//     justifyContent: "flex-end",
//     marginTop: 10,
//   },

//   primaryButton: {
//     padding: "11px 18px",
//     borderRadius: 10,
//     border: "none",
//     background: "#111",
//     color: "#fff",
//     fontSize: 14,
//     fontWeight: 500,
//     cursor: "pointer",
//   },

//   secondaryButton: {
//     padding: "11px 18px",
//     borderRadius: 10,
//     border: "1px solid #ddd",
//     background: "#fff",
//     color: "#333",
//     fontSize: 14,
//     fontWeight: 500,
//     cursor: "pointer",
//     marginRight: 10,
//   },
// };