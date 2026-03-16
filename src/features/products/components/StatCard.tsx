import type { IconType } from "react-icons";

type StatsCardProps = {
  title: string;
  value: number | string;
  icon: IconType;
};

export default function StatsCard({ title, value, icon: Icon }: StatsCardProps) {
  return (

      <div style={styles.card}>
        <div style={styles.top}>
          <p style={styles.title}>{title}</p>
          <div style={styles.iconContainer}>
              <Icon size={25} color="#000000" />
          </div>
        </div>

        <h2 style={styles.value}>{value}</h2>
      </div>

  );
}

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    flex: 1,
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "#ffffff",
    border: "1px solid #f1f5f9",
    boxShadow: "0 15px 30px rgba(0,0,0,0.05)",
  },
  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: "15px",
    color: "#000000",
    fontFamily: "sans-serif"
  },
  value: {
    fontSize: "26px",
    fontWeight: "600",
    color: "#111827",
    marginTop: "10px",
  },
  iconContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",   
    background: "#f6f6f6",
    borderRadius: 10,
    width: 50,
    height: 50,
  },

};